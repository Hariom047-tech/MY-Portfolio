# PRD — Jack: 3D Creator Portfolio Landing Page

## Original Problem Statement
Build a 3D Creator portfolio landing page for "Jack". Iteration 2: connect to backend; make Contact, Price, Project sections feel like a real portfolio site; ensure mobile / tablet / desktop look.

## Stack
- Frontend: React 19 (JSX) + Tailwind 3.4 + Framer Motion 11 + Lucide React, Kanit font
- Backend: FastAPI + Motor (MongoDB)
- Comms: axios via process.env.REACT_APP_BACKEND_URL

## Sections (in order)
Hero → Marquee → About → Services → Pricing (id=price) → Projects (id=projects) → Contact (id=contact)

## Backend (/app/backend/server.py)
- GET  /api/health
- GET  /api/pricing       -> 3 plans (starter, studio[highlighted], custom)
- GET  /api/projects      -> 3 projects with tags, images, year, role, description
- GET  /api/projects/{id} -> single project (404 if not found)
- POST /api/contact       -> store submission in Mongo (db.contacts)
- GET  /api/contact       -> list submissions newest first
- GET/POST /api/status    -> legacy
MongoDB collections: contacts, status_checks. All datetimes stored as ISO strings.

## Frontend
- /app/frontend/src/lib/api.js — axios client + getPricing / getProjects / submitContact
- /app/frontend/src/components/landing/
  - FadeIn, Magnet, AnimatedText, ContactButton, LiveProjectButton
  - HeroSection — smooth-scroll navbar (About/Price/Projects/Contact)
  - MarqueeSection — 21 GIFs, 2 counter-scrolling rows
  - AboutSection — 4 decorative corner 3D images, animated paragraph
  - ServicesSection — id=services, white bg, 5 items
  - PricingSection — id=price, 3 plans loaded from /api/pricing (fallback bundled); studio card highlighted with gradient + POPULAR badge; CTAs scroll to #contact
  - ProjectsSection — id=projects, loads /api/projects (fallback bundled), sticky-stacking cards with tag pills, year, role, description, anchor-wrapped Live Project button
  - ContactSection — id=contact, full form (name, email, project_type, budget, message) posting to /api/contact; success/error/idle/submitting status messages; email + location + Instagram/LinkedIn/Twitter icons; copyright footer

## Responsive
- Pricing: 1-col <768, 3-col >=768 (md)
- Contact: info+form stacked on <1024, side-by-side at lg+
- All headings use clamp() fluid type
- Project image grid uses clamp() heights; cards use rounded-[32→60]
- Hero portrait centered via parent wrapper (Magnet inside)

## Testing
- iteration_1.json: 100% frontend pass (static page)
- iteration_2.json: backend 13/13 + frontend all flows incl. responsive 390/820/1440

## Personas
- Prospective clients (founders / startups) evaluating Jack's 3D & branding work
- Recruiters / studios reviewing portfolio quality
- Visitors who want to send an inquiry directly

## Backlog
- P1: Auth-protected admin dashboard to view submitted contacts
- P1: Email notification (Resend / SMTP) on new contact submission
- P2: Project detail pages / case studies (already have /api/projects/{id})
- P2: Replace project card stock photos with real 3D-render visuals
- P2: SEO/OG tags, structured data, sitemap
- P2: Cursor follower, loading states for fetches

## Test Credentials
N/A — no auth in this app
