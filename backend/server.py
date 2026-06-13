from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import hashlib
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import database as db
from database import configure as configure_db, init_db, seed_if_empty
from database import insert_status_check, list_status_checks
from database import insert_contact, list_contacts, delete_contact
from database import get_settings, set_settings, seed_settings_if_empty


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# SQLite
db_path = Path(os.environ.get('SQLITE_PATH', str(ROOT_DIR / 'portfolio.db')))
configure_db(db_path)

# Uploads
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_IMAGE_EXT = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'}

# Admin auth (stateless token derived from password + secret — no extra deps)
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
SECRET_KEY = os.environ.get('SECRET_KEY', 'change-me-secret')
ADMIN_TOKEN = hashlib.sha256(f"{ADMIN_PASSWORD}:{SECRET_KEY}".encode()).hexdigest()

# Create the main app without a prefix
app = FastAPI()

# Serve uploaded images
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/api/admin", tags=["admin"])


# ------------------------------------------------------------------
# Auth
# ------------------------------------------------------------------
class LoginRequest(BaseModel):
    password: str


def require_admin(authorization: Optional[str] = Header(default=None)):
    token = ""
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# ------------------------------------------------------------------
# Models
# ------------------------------------------------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    project_type: str = Field(min_length=1, max_length=80)
    budget: Optional[str] = Field(default=None, max_length=80)
    message: str = Field(min_length=1, max_length=2000)


class Contact(ContactCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ServiceBase(BaseModel):
    number: str = ""
    icon: str = "Code2"
    name: str = Field(min_length=1, max_length=120)
    description: str = ""
    items: List[str] = []
    sort_order: int = 0


class Service(ServiceBase):
    id: str


class ProjectBase(BaseModel):
    number: str = ""
    category: str = ""
    name: str = Field(min_length=1, max_length=160)
    description: str = ""
    year: str = ""
    role: str = ""
    tags: List[str] = []
    images: List[str] = []
    live_url: Optional[str] = "#"
    sort_order: int = 0


class Project(ProjectBase):
    id: str


class PricingBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    tagline: str = ""
    price: str = ""
    period: str = ""
    description: str = ""
    features: List[str] = []
    cta: str = "Get started"
    highlighted: bool = False
    sort_order: int = 0


class PricingPlan(PricingBase):
    id: str


class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    brandName: Optional[str] = None
    brandShort: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    whatsappNumber: Optional[str] = None
    whatsappMessage: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    github: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None


# ------------------------------------------------------------------
# Seed data (used only the first time each table is empty)
# ------------------------------------------------------------------
def _shot(name: str) -> str:
    return f"/projects/{name}.png"


DEFAULT_SERVICES = [
    {
        "number": "01", "icon": "Smartphone",
        "name": "Mobile Application Development",
        "description": "Native-quality cross-platform apps that delight users and scale with your business.",
        "items": ["Android & iOS apps", "Flutter apps", "Custom business applications"],
    },
    {
        "number": "02", "icon": "Globe",
        "name": "Website Development",
        "description": "Fast, SEO-optimized and responsive websites built for conversions and growth.",
        "items": ["Business websites", "Custom web applications", "E-commerce websites", "School websites", "SEO optimized responsive websites"],
    },
    {
        "number": "03", "icon": "Workflow",
        "name": "Business Automation",
        "description": "Automate repetitive work so your team can focus on what actually grows revenue.",
        "items": ["WhatsApp automation", "CRM automation", "Lead management systems", "Automated follow-up systems"],
    },
    {
        "number": "04", "icon": "Bot",
        "name": "AI Agent & Agentic Workflows",
        "description": "Intelligent AI agents and workflows that talk, decide and act on your behalf 24/7.",
        "items": ["AI voice calling agents", "AI chatbots", "n8n automation workflows", "Twilio integrations", "ElevenLabs AI agents", "Google Sheets automation"],
    },
    {
        "number": "05", "icon": "LayoutDashboard",
        "name": "CRM & Dashboard Systems",
        "description": "Powerful admin panels and dashboards that turn your data into clear decisions.",
        "items": ["Admin dashboards", "School management systems", "Customer management systems", "Analytics dashboards"],
    },
]

DEFAULT_PROJECTS = [
    {
        "id": "maa-baglamukhi", "number": "01", "category": "Web",
        "name": "Maa Baglamukhi Website",
        "description": "Professional spiritual and puja booking website for Maa Baglamukhi services with a responsive modern UI and online booking flow.",
        "year": "2025", "role": "Full Stack Development",
        "tags": ["Next.js", "Tailwind CSS", "Vercel"],
        "images": [_shot("baglamukhi-1"), _shot("baglamukhi-2"), _shot("baglamukhi-3")],
        "live_url": "#",
    },
    {
        "id": "rental-clothes-app", "number": "02", "category": "Mobile",
        "name": "Rental Clothes Mobile Application",
        "description": "Modern rental fashion mobile application with vendor management, customer booking system and real-time order tracking.",
        "year": "2025", "role": "Mobile App Development",
        "tags": ["Flutter", "Firebase"],
        "images": [_shot("rental-1"), _shot("rental-2"), _shot("rental-3")],
        "live_url": "#",
    },
    {
        "id": "school-management", "number": "03", "category": "Web",
        "name": "School Management Website",
        "description": "Complete school management platform with student management, attendance, fees, dashboards and a powerful admin panel.",
        "year": "2024", "role": "Full Stack Development",
        "tags": ["React", "Node.js", "MongoDB"],
        "images": [_shot("school-1"), _shot("school-2"), _shot("school-3")],
        "live_url": "#",
    },
    {
        "id": "crm-automation", "number": "04", "category": "Automation",
        "name": "CRM Automation System",
        "description": "Automated CRM system integrated with WhatsApp, Twilio, Google Sheets and AI workflow automation for lead capture and follow-up.",
        "year": "2024", "role": "Automation Engineering",
        "tags": ["n8n", "Twilio", "Google Sheets API"],
        "images": [_shot("crm-1"), _shot("crm-2"), _shot("crm-3")],
        "live_url": "#",
    },
    {
        "id": "ai-calling-agent", "number": "05", "category": "AI",
        "name": "AI Calling Agent Automation",
        "description": "AI voice calling system using ElevenLabs and Twilio for automated customer interactions and intelligent lead follow-up.",
        "year": "2024", "role": "AI Automation",
        "tags": ["ElevenLabs", "Twilio", "n8n"],
        "images": [_shot("aicall-1"), _shot("aicall-2"), _shot("aicall-3")],
        "live_url": "#",
    },
]

DEFAULT_SETTINGS = {
    "brandName": "AI Wallah",
    "brandShort": "AI Wallah",
    "role": "Full Stack Developer",
    "email": "patidarhariom047@gmail.com",
    "phone": "+91 70672 57835",
    "location": "India · Working worldwide",
    "whatsappNumber": "917067257835",
    "whatsappMessage": "Hi AI Wallah! I came across your portfolio and I'd like to discuss a project.",
    "instagram": "https://www.instagram.com/ai_wallah.o",
    "linkedin": "https://www.linkedin.com/in/hariom-patidar-624262300?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    "twitter": "",
    "github": "",
    "facebook": "",
    "youtube": "",
}


DEFAULT_PRICING = [
    {
        "id": "starter", "name": "Starter Website", "tagline": "For founders & small brands",
        "price": "₹15,000+", "period": "/project",
        "description": "A fast, modern, responsive website to establish your online presence and start capturing leads.",
        "features": ["Responsive Website", "Modern UI Design", "Contact Form", "SEO Optimization"],
        "cta": "Start now", "highlighted": False,
    },
    {
        "id": "business", "name": "Business Website", "tagline": "The most popular plan",
        "price": "₹35,000+", "period": "/project",
        "description": "A custom website with admin dashboard, database and WhatsApp integration to run and grow your business.",
        "features": ["Custom Website", "Admin Dashboard", "Database Integration", "WhatsApp Integration", "SEO Optimization"],
        "cta": "Book this plan", "highlighted": True,
    },
    {
        "id": "mobile-app", "name": "Mobile Application", "tagline": "Android & iOS",
        "price": "₹60,000+", "period": "/project",
        "description": "A cross-platform mobile app with Firebase backend, admin panel and push notifications.",
        "features": ["Android & iOS App", "Firebase Integration", "Admin Panel", "Push Notifications"],
        "cta": "Build my app", "highlighted": False,
    },
    {
        "id": "ai-automation", "name": "AI Automation System", "tagline": "AI agents & workflows",
        "price": "₹80,000+", "period": "/project",
        "description": "End-to-end AI automation with calling agents, WhatsApp automation and CRM workflows that run 24/7.",
        "features": ["AI Calling Agent", "WhatsApp Automation", "CRM Integration", "Google Sheets Automation", "Twilio Integration", "n8n Workflow"],
        "cta": "Automate my business", "highlighted": False,
    },
    {
        "id": "enterprise", "name": "Custom Enterprise Solution", "tagline": "For ambitious teams",
        "price": "Contact Us", "period": "",
        "description": "A fully custom software platform combining web, mobile, AI automation, dashboards and CRM with dedicated support.",
        "features": ["Fully Custom Software", "AI Automation", "Dashboard & CRM", "Dedicated Support"],
        "cta": "Request proposal", "highlighted": False,
    },
]


# ------------------------------------------------------------------
# Public routes
# ------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "AI Wallah — Full Stack Developer API"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await insert_status_check(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await list_status_checks()
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ---- Services --------------------------------------------------------------
@api_router.get("/services", response_model=List[Service])
async def get_services():
    return await db.list_rows("services")


# ---- Pricing & Projects ----------------------------------------------------
@api_router.get("/pricing", response_model=List[PricingPlan])
async def get_pricing():
    return await db.list_rows("pricing")


@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    return await db.list_rows("projects")


@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    row = await db.get_row("projects", project_id)
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    return row


# ---- Settings --------------------------------------------------------------
@api_router.get("/settings")
async def public_settings():
    merged = {**DEFAULT_SETTINGS, **(await get_settings())}
    return merged


# ---- Contact ---------------------------------------------------------------
@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await insert_contact(doc)
    logger.info("New contact submission from %s <%s>", contact.name, contact.email)
    return contact


@api_router.get("/contact", response_model=List[Contact])
async def get_contacts(limit: int = 100):
    docs = await list_contacts(limit)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


# ------------------------------------------------------------------
# Admin routes (protected)
# ------------------------------------------------------------------
@admin_router.post("/login")
async def admin_login(payload: LoginRequest):
    if payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": ADMIN_TOKEN}


@admin_router.get("/verify")
async def admin_verify(_: bool = Depends(require_admin)):
    return {"ok": True}


# ---- Image upload ----------------------------------------------------------
@admin_router.post("/upload")
async def upload_image(file: UploadFile = File(...), _: bool = Depends(require_admin)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_IMAGE_EXT:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Use PNG, JPG, GIF, WEBP or SVG.",
        )
    name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / name
    content = await file.read()
    with open(dest, "wb") as f:
        f.write(content)
    return {"path": f"/uploads/{name}", "filename": name}


# ---- Settings --------------------------------------------------------------
@admin_router.put("/settings")
async def update_settings(payload: SiteSettings, _: bool = Depends(require_admin)):
    values = {k: v for k, v in payload.model_dump().items() if v is not None}
    await set_settings(values)
    return {**DEFAULT_SETTINGS, **(await get_settings())}


# ---- Services CRUD ---------------------------------------------------------
@admin_router.post("/services", response_model=Service)
async def create_service(payload: ServiceBase, _: bool = Depends(require_admin)):
    return await db.create_row("services", payload.model_dump())


@admin_router.put("/services/{item_id}", response_model=Service)
async def update_service(item_id: str, payload: ServiceBase, _: bool = Depends(require_admin)):
    row = await db.update_row("services", item_id, payload.model_dump())
    if not row:
        raise HTTPException(status_code=404, detail="Service not found")
    return row


@admin_router.delete("/services/{item_id}")
async def delete_service(item_id: str, _: bool = Depends(require_admin)):
    ok = await db.delete_row("services", item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"ok": True}


# ---- Projects CRUD ---------------------------------------------------------
@admin_router.post("/projects", response_model=Project)
async def create_project(payload: ProjectBase, _: bool = Depends(require_admin)):
    return await db.create_row("projects", payload.model_dump())


@admin_router.put("/projects/{item_id}", response_model=Project)
async def update_project(item_id: str, payload: ProjectBase, _: bool = Depends(require_admin)):
    row = await db.update_row("projects", item_id, payload.model_dump())
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    return row


@admin_router.delete("/projects/{item_id}")
async def delete_project(item_id: str, _: bool = Depends(require_admin)):
    ok = await db.delete_row("projects", item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"ok": True}


# ---- Pricing CRUD ----------------------------------------------------------
@admin_router.post("/pricing", response_model=PricingPlan)
async def create_pricing(payload: PricingBase, _: bool = Depends(require_admin)):
    return await db.create_row("pricing", payload.model_dump())


@admin_router.put("/pricing/{item_id}", response_model=PricingPlan)
async def update_pricing(item_id: str, payload: PricingBase, _: bool = Depends(require_admin)):
    row = await db.update_row("pricing", item_id, payload.model_dump())
    if not row:
        raise HTTPException(status_code=404, detail="Plan not found")
    return row


@admin_router.delete("/pricing/{item_id}")
async def delete_pricing(item_id: str, _: bool = Depends(require_admin)):
    ok = await db.delete_row("pricing", item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"ok": True}


# ---- Messages (contacts) ---------------------------------------------------
@admin_router.get("/contacts", response_model=List[Contact])
async def admin_contacts(limit: int = 200, _: bool = Depends(require_admin)):
    docs = await list_contacts(limit)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


@admin_router.delete("/contacts/{item_id}")
async def admin_delete_contact(item_id: str, _: bool = Depends(require_admin)):
    ok = await delete_contact(item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"ok": True}


# ------------------------------------------------------------------
# Register router & middleware
# ------------------------------------------------------------------
app.include_router(api_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_db():
    await init_db()
    await seed_if_empty("services", DEFAULT_SERVICES)
    await seed_if_empty("projects", DEFAULT_PROJECTS)
    await seed_if_empty("pricing", DEFAULT_PRICING)
    await seed_settings_if_empty(DEFAULT_SETTINGS)
