"""Backend API tests for Jack 3D Creator portfolio.

Covers:
- /api/health
- /api/pricing
- /api/projects (+ by id)
- /api/contact (POST/GET, validation)
"""

import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/") or \
           "https://jack-creator-dark-1.preview.emergentagent.com"
API = f"{BASE_URL}/api"


# ---- Health ----------------------------------------------------------------
def test_health():
    r = requests.get(f"{API}/health", timeout=15)
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ---- Pricing ---------------------------------------------------------------
class TestPricing:
    def test_get_pricing_returns_three_plans(self):
        r = requests.get(f"{API}/pricing", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3

    def test_pricing_plan_ids(self):
        r = requests.get(f"{API}/pricing", timeout=15)
        ids = {p["id"] for p in r.json()}
        assert ids == {"starter", "studio", "custom"}

    def test_studio_highlighted(self):
        r = requests.get(f"{API}/pricing", timeout=15)
        plans = {p["id"]: p for p in r.json()}
        assert plans["studio"]["highlighted"] is True
        assert plans["starter"]["highlighted"] is False
        assert plans["custom"]["highlighted"] is False

    def test_pricing_schema(self):
        r = requests.get(f"{API}/pricing", timeout=15)
        for p in r.json():
            for k in ("id", "name", "tagline", "price", "period",
                      "description", "features", "cta", "highlighted"):
                assert k in p, f"missing {k}"
            assert isinstance(p["features"], list) and len(p["features"]) > 0


# ---- Projects --------------------------------------------------------------
class TestProjects:
    def test_get_projects_returns_three(self):
        r = requests.get(f"{API}/projects", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3

    def test_project_schema(self):
        r = requests.get(f"{API}/projects", timeout=15)
        for p in r.json():
            for k in ("id", "number", "name", "description", "year",
                      "role", "tags", "images"):
                assert k in p, f"missing {k}"
            assert isinstance(p["tags"], list)
            assert isinstance(p["images"], list)
            assert len(p["images"]) >= 3

    def test_get_project_by_id(self):
        r = requests.get(f"{API}/projects/nextlevel-studio", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == "nextlevel-studio"
        assert data["number"] == "01"

    def test_get_project_unknown_returns_404(self):
        r = requests.get(f"{API}/projects/does-not-exist", timeout=15)
        assert r.status_code == 404


# ---- Contact ---------------------------------------------------------------
class TestContact:
    def test_post_contact_valid(self):
        payload = {
            "name": "TEST_Jane Doe",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "project_type": "3D Modeling",
            "budget": "$2k – $5k",
            "message": "TEST_ automated submission for QA",
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["project_type"] == payload["project_type"]
        assert data["message"] == payload["message"]
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "created_at" in data and len(data["created_at"]) > 0

        # Verify persistence via GET
        listing = requests.get(f"{API}/contact", timeout=15).json()
        assert any(c["id"] == data["id"] for c in listing), "submission not persisted"

    def test_post_contact_invalid_email_returns_422(self):
        payload = {
            "name": "TEST_Bad Email",
            "email": "not-an-email",
            "project_type": "Web Design",
            "budget": "< $2k",
            "message": "TEST_",
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_post_contact_missing_field_returns_422(self):
        # missing email
        r = requests.post(
            f"{API}/contact",
            json={"name": "x", "project_type": "Web Design", "message": "x"},
            timeout=15,
        )
        assert r.status_code == 422

    def test_get_contact_list_sorted_desc(self):
        # Create two submissions, second must appear before first
        e1 = f"test_{uuid.uuid4().hex[:8]}@example.com"
        e2 = f"test_{uuid.uuid4().hex[:8]}@example.com"
        base = {
            "name": "TEST_Order",
            "project_type": "Other",
            "budget": "< $2k",
            "message": "TEST_order",
        }
        a = requests.post(f"{API}/contact", json={**base, "email": e1}, timeout=15).json()
        b = requests.post(f"{API}/contact", json={**base, "email": e2}, timeout=15).json()

        listing = requests.get(f"{API}/contact", timeout=15).json()
        ids = [c["id"] for c in listing]
        # b created after a; should appear earlier in desc-sorted list
        assert ids.index(b["id"]) < ids.index(a["id"])
