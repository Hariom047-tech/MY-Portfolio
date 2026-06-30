import json
import logging
import uuid
from pathlib import Path
from typing import List, Optional

import aiosqlite

logger = logging.getLogger(__name__)

DB_PATH: Path


def configure(db_path: Path) -> None:
    global DB_PATH
    DB_PATH = db_path


# ------------------------------------------------------------------
# Schema metadata for the content tables (services, projects, pricing)
# ------------------------------------------------------------------
COLUMNS = {
    "services": [
        "id", "number", "icon", "name", "description", "items", "sort_order",
    ],
    "projects": [
        "id", "number", "category", "name", "description", "year", "role",
        "tags", "images", "live_url", "sort_order",
    ],
    "pricing": [
        "id", "name", "tagline", "price", "period", "description",
        "features", "cta", "highlighted", "sort_order",
    ],
}

JSON_FIELDS = {
    "services": ["items"],
    "projects": ["tags", "images"],
    "pricing": ["features"],
}

BOOL_FIELDS = {
    "pricing": ["highlighted"],
}


def _serialize(table: str, data: dict) -> dict:
    out = dict(data)
    for f in JSON_FIELDS.get(table, []):
        if f in out and not isinstance(out[f], str):
            out[f] = json.dumps(out[f] or [])
    for f in BOOL_FIELDS.get(table, []):
        if f in out:
            out[f] = 1 if out[f] else 0
    return out


def _deserialize(table: str, row: dict) -> dict:
    out = dict(row)
    for f in JSON_FIELDS.get(table, []):
        if f in out:
            try:
                out[f] = json.loads(out[f]) if out[f] else []
            except (TypeError, json.JSONDecodeError):
                out[f] = []
    for f in BOOL_FIELDS.get(table, []):
        if f in out:
            out[f] = bool(out[f])
    return out


# ------------------------------------------------------------------
# Init
# ------------------------------------------------------------------
async def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS status_checks (
                id TEXT PRIMARY KEY,
                client_name TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
            """
        )
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS contacts (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                project_type TEXT NOT NULL,
                budget TEXT,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS services (
                id TEXT PRIMARY KEY,
                number TEXT,
                icon TEXT,
                name TEXT NOT NULL,
                description TEXT,
                items TEXT,
                sort_order INTEGER DEFAULT 0
            )
            """
        )
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                number TEXT,
                category TEXT,
                name TEXT NOT NULL,
                description TEXT,
                year TEXT,
                role TEXT,
                tags TEXT,
                images TEXT,
                live_url TEXT,
                sort_order INTEGER DEFAULT 0
            )
            """
        )
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS pricing (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                tagline TEXT,
                price TEXT,
                period TEXT,
                description TEXT,
                features TEXT,
                cta TEXT,
                highlighted INTEGER DEFAULT 0,
                sort_order INTEGER DEFAULT 0
            )
            """
        )
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )
            """
        )
        await db.commit()
    logger.info("SQLite database ready at %s", DB_PATH)


async def seed_if_empty(table: str, rows: List[dict]) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        cur = await db.execute(f"SELECT COUNT(*) FROM {table}")
        (count,) = await cur.fetchone()
    if count == 0:
        for i, row in enumerate(rows):
            data = dict(row)
            data.setdefault("sort_order", i)
            await create_row(table, data)
        logger.info("Seeded %d rows into %s", len(rows), table)


async def sync_portfolio_projects(defaults: List[dict]) -> None:
    """Apply shipped project links and HireFlow replacement to existing rows."""
    by_id = {row["id"]: row for row in defaults}
    hireflow = by_id.get("hireflow-ats")
    link_only = {
        "maa-baglamukhi": "https://maa-baglamukhi-website.vercel.app/",
        "rental-clothes-app": "https://play.google.com/store/apps/details?id=com.chaitanya.rentalcothes",
    }

    for project_id, live_url in link_only.items():
        row = await get_row("projects", project_id)
        if row:
            await update_row("projects", project_id, {**row, "live_url": live_url})

    if not hireflow:
        return

    legacy = await get_row("projects", "crm-automation")
    current = await get_row("projects", "hireflow-ats")

    if legacy and not current:
        data = {**hireflow, "sort_order": legacy.get("sort_order", 3)}
        await create_row("projects", data)
        await delete_row("projects", "crm-automation")
        logger.info("Migrated crm-automation project to hireflow-ats")
    elif legacy:
        await update_row("projects", "crm-automation", {**legacy, **hireflow, "id": "crm-automation"})
    elif current:
        await update_row("projects", "hireflow-ats", {**current, **hireflow})

    travel = by_id.get("travel-agency")
    if not travel:
        return

    legacy_ai = await get_row("projects", "ai-calling-agent")
    current_travel = await get_row("projects", "travel-agency")

    if legacy_ai and not current_travel:
        data = {**travel, "sort_order": legacy_ai.get("sort_order", 4)}
        await create_row("projects", data)
        await delete_row("projects", "ai-calling-agent")
        logger.info("Migrated ai-calling-agent project to travel-agency")
    elif legacy_ai:
        await update_row(
            "projects",
            "ai-calling-agent",
            {**legacy_ai, **travel, "id": "ai-calling-agent"},
        )
    elif current_travel:
        await update_row("projects", "travel-agency", {**current_travel, **travel})


# ------------------------------------------------------------------
# Generic content CRUD
# ------------------------------------------------------------------
async def list_rows(table: str) -> List[dict]:
    cols = COLUMNS[table]
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cur = await db.execute(
            f"SELECT {', '.join(cols)} FROM {table} ORDER BY sort_order ASC, name ASC"
        )
        rows = await cur.fetchall()
    return [_deserialize(table, dict(r)) for r in rows]


async def get_row(table: str, row_id: str) -> Optional[dict]:
    cols = COLUMNS[table]
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cur = await db.execute(
            f"SELECT {', '.join(cols)} FROM {table} WHERE id = ?", (row_id,)
        )
        row = await cur.fetchone()
    return _deserialize(table, dict(row)) if row else None


async def create_row(table: str, data: dict) -> dict:
    cols = COLUMNS[table]
    payload = _serialize(table, data)
    if not payload.get("id"):
        payload["id"] = str(uuid.uuid4())
    values = {c: payload.get(c) for c in cols}
    placeholders = ", ".join(["?"] * len(cols))
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({placeholders})",
            tuple(values[c] for c in cols),
        )
        await db.commit()
    return await get_row(table, payload["id"])


async def update_row(table: str, row_id: str, data: dict) -> Optional[dict]:
    cols = [c for c in COLUMNS[table] if c != "id"]
    payload = _serialize(table, data)
    updates = {c: payload[c] for c in cols if c in payload}
    if not updates:
        return await get_row(table, row_id)
    set_clause = ", ".join(f"{c} = ?" for c in updates)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            f"UPDATE {table} SET {set_clause} WHERE id = ?",
            (*updates.values(), row_id),
        )
        await db.commit()
    return await get_row(table, row_id)


async def delete_row(table: str, row_id: str) -> bool:
    async with aiosqlite.connect(DB_PATH) as db:
        cur = await db.execute(f"DELETE FROM {table} WHERE id = ?", (row_id,))
        await db.commit()
        return cur.rowcount > 0


# ------------------------------------------------------------------
# Status checks
# ------------------------------------------------------------------
async def insert_status_check(doc: dict) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO status_checks (id, client_name, timestamp) VALUES (?, ?, ?)",
            (doc["id"], doc["client_name"], doc["timestamp"]),
        )
        await db.commit()


async def list_status_checks(limit: int = 1000) -> List[dict]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT id, client_name, timestamp FROM status_checks ORDER BY timestamp DESC LIMIT ?",
            (limit,),
        )
        rows = await cursor.fetchall()
    return [dict(row) for row in rows]


# ------------------------------------------------------------------
# Contacts
# ------------------------------------------------------------------
async def insert_contact(doc: dict) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """
            INSERT INTO contacts (id, name, email, project_type, budget, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                doc["id"],
                doc["name"],
                doc["email"],
                doc["project_type"],
                doc.get("budget"),
                doc["message"],
                doc["created_at"],
            ),
        )
        await db.commit()


async def list_contacts(limit: int = 100) -> List[dict]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT id, name, email, project_type, budget, message, created_at
            FROM contacts
            ORDER BY created_at DESC
            LIMIT ?
            """,
            (limit,),
        )
        rows = await cursor.fetchall()
    return [dict(row) for row in rows]


async def delete_contact(row_id: str) -> bool:
    async with aiosqlite.connect(DB_PATH) as db:
        cur = await db.execute("DELETE FROM contacts WHERE id = ?", (row_id,))
        await db.commit()
        return cur.rowcount > 0


# ------------------------------------------------------------------
# Settings (key/value site configuration)
# ------------------------------------------------------------------
async def get_settings() -> dict:
    async with aiosqlite.connect(DB_PATH) as db:
        cur = await db.execute("SELECT key, value FROM settings")
        rows = await cur.fetchall()
    return {k: v for (k, v) in rows}


async def set_settings(values: dict) -> dict:
    async with aiosqlite.connect(DB_PATH) as db:
        for k, v in values.items():
            await db.execute(
                """
                INSERT INTO settings (key, value) VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
                """,
                (k, "" if v is None else str(v)),
            )
        await db.commit()
    return await get_settings()


async def seed_settings_if_empty(defaults: dict) -> None:
    current = await get_settings()
    if not current:
        await set_settings(defaults)
        logger.info("Seeded %d site settings", len(defaults))
