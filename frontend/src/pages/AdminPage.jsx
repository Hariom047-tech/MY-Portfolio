import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
    LogOut,
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    Lock,
    Loader2,
    X,
    Star,
    ArrowLeft,
    ImagePlus,
} from "lucide-react";
import {
    adminLogin,
    adminVerify,
    getToken,
    clearToken,
    getServices,
    getProjects,
    getPricing,
    getSettings,
    adminCreate,
    adminUpdate,
    adminDelete,
    adminUpdateSettings,
    adminUploadImage,
    adminGetContacts,
    adminDeleteContact,
} from "@/lib/api";
import { ICON_NAMES } from "@/components/landing/ServicesSection";

const SETTINGS_GROUPS = [
    {
        title: "Brand",
        fields: [
            { key: "brandName", label: "Brand / full name" },
            { key: "brandShort", label: "Short name (navbar)" },
            { key: "role", label: "Role / title" },
        ],
    },
    {
        title: "Contact",
        fields: [
            { key: "email", label: "Email (Gmail)" },
            { key: "phone", label: "Mobile number" },
            { key: "location", label: "Location" },
            { key: "whatsappNumber", label: "WhatsApp number (with country code, digits only)" },
            { key: "whatsappMessage", label: "Default WhatsApp message", type: "textarea" },
        ],
    },
    {
        title: "Social media links",
        fields: [
            { key: "instagram", label: "Instagram URL" },
            { key: "linkedin", label: "LinkedIn URL" },
            { key: "twitter", label: "Twitter / X URL" },
            { key: "github", label: "GitHub URL" },
            { key: "facebook", label: "Facebook URL" },
            { key: "youtube", label: "YouTube URL" },
        ],
    },
];

const SCHEMAS = {
    services: {
        label: "Services",
        resource: "services",
        empty: { number: "", icon: "Code2", name: "", description: "", items: [], sort_order: 0 },
        fields: [
            { key: "number", label: "Number (e.g. 01)", type: "text" },
            { key: "icon", label: "Icon", type: "icon" },
            { key: "name", label: "Service name", type: "text", required: true },
            { key: "description", label: "Description", type: "textarea" },
            { key: "items", label: "Features (one per line)", type: "list" },
            { key: "sort_order", label: "Sort order", type: "number" },
        ],
        title: (it) => it.name,
        meta: (it) => it.description,
    },
    projects: {
        label: "Projects",
        resource: "projects",
        empty: {
            number: "", category: "", name: "", description: "", year: "",
            role: "", tags: [], images: [], live_url: "#", sort_order: 0,
        },
        fields: [
            { key: "number", label: "Number (e.g. 01)", type: "text" },
            { key: "category", label: "Category (Web / Mobile / AI...)", type: "text" },
            { key: "name", label: "Project name", type: "text", required: true },
            { key: "year", label: "Year", type: "text" },
            { key: "role", label: "Your role", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "tags", label: "Tech stack tags (type & press Enter)", type: "tags" },
            { key: "images", label: "Images (upload or paste URL, 3 recommended)", type: "images" },
            { key: "live_url", label: "Live Project URL (https://...)", type: "text" },
            { key: "sort_order", label: "Sort order", type: "number" },
        ],
        title: (it) => it.name,
        meta: (it) =>
            it.live_url && it.live_url !== "#" ? it.live_url : "No live link set",
    },
    pricing: {
        label: "Pricing",
        resource: "pricing",
        empty: {
            name: "", tagline: "", price: "", period: "", description: "",
            features: [], cta: "Get started", highlighted: false, sort_order: 0,
        },
        fields: [
            { key: "name", label: "Plan name", type: "text", required: true },
            { key: "tagline", label: "Tagline", type: "text" },
            { key: "price", label: "Price (e.g. ₹15,000+)", type: "text" },
            { key: "period", label: "Period (e.g. /project)", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "features", label: "Features (one per line)", type: "list" },
            { key: "cta", label: "Button text", type: "text" },
            { key: "highlighted", label: "Highlight as popular", type: "bool" },
            { key: "sort_order", label: "Sort order", type: "number" },
        ],
        title: (it) => `${it.name} — ${it.price}`,
        meta: (it) => it.tagline,
    },
};

const TABS = ["services", "projects", "pricing", "messages", "settings"];

const inputClass =
    "w-full bg-[#141414] border border-[#D7E2EA]/15 focus:border-[#B600A8] outline-none rounded-xl px-4 py-2.5 text-[#D7E2EA] placeholder-[#D7E2EA]/30 text-sm transition-colors";

// ---------------------------------------------------------------------------
// Login screen
// ---------------------------------------------------------------------------
const LoginScreen = ({ onLogin }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            await adminLogin(password);
            onLogin();
        } catch (err) {
            setError(
                err?.response?.status === 401
                    ? "Incorrect password."
                    : "Could not connect. Is the server running?"
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-5 page-glow">
            <form
                onSubmit={submit}
                className="glass rounded-[28px] p-8 sm:p-10 w-full max-w-md flex flex-col gap-6"
            >
                <div className="flex flex-col items-center gap-3 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B600A8] via-[#7621B0] to-[#BE4C00] text-white">
                        <Lock className="h-6 w-6" />
                    </span>
                    <h1 className="text-2xl font-bold text-[#D7E2EA]">Admin Login</h1>
                    <p className="text-[#D7E2EA]/50 text-sm">
                        Sign in to manage your portfolio content.
                    </p>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/50 mb-2">
                        Password
                    </label>
                    <input
                        data-testid="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className={inputClass}
                        autoFocus
                    />
                </div>

                {error && <p className="text-rose-400 text-sm">{error}</p>}

                <button
                    data-testid="admin-login-btn"
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-2 rounded-full text-white font-medium uppercase tracking-widest text-sm py-3 disabled:opacity-60"
                    style={{
                        background:
                            "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                    }}
                >
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    Sign in
                </button>

                <Link
                    to="/"
                    className="text-center text-[#D7E2EA]/50 hover:text-[#D7E2EA] text-sm inline-flex items-center justify-center gap-1.5"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to website
                </Link>
            </form>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Image picker field (upload from device OR paste URL)
// ---------------------------------------------------------------------------
const ImageListField = ({ value, onChange }) => {
    const images = value || [];
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [error, setError] = useState("");

    const addUrl = () => {
        const u = urlInput.trim();
        if (u) {
            onChange([...images, u]);
            setUrlInput("");
        }
    };

    const removeAt = (i) => onChange(images.filter((_, idx) => idx !== i));

    const onPick = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploading(true);
        setError("");
        try {
            const uploaded = [];
            for (const f of files) {
                const url = await adminUploadImage(f);
                uploaded.push(url);
            }
            onChange([...images, ...uploaded]);
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                    "Upload failed. Make sure the file is an image."
            );
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Thumbnails */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {images.map((src, i) => (
                        <div
                            key={`${src}-${i}`}
                            className="relative group rounded-xl overflow-hidden border border-[#D7E2EA]/15 aspect-square bg-[#141414]"
                        >
                            <img
                                src={src}
                                alt={`preview ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeAt(i)}
                                className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload button */}
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onPick}
                className="hidden"
            />
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#D7E2EA]/25 text-[#D7E2EA]/80 hover:border-[#B600A8] hover:text-white py-3 text-sm transition-colors disabled:opacity-60"
            >
                {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <ImagePlus className="h-4 w-4" />
                )}
                {uploading ? "Uploading…" : "Upload image from device"}
            </button>

            {/* Paste URL */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addUrl();
                        }
                    }}
                    placeholder="…or paste an image URL"
                    className={inputClass}
                />
                <button
                    type="button"
                    onClick={addUrl}
                    className="flex-shrink-0 rounded-xl border border-[#D7E2EA]/20 text-[#D7E2EA] px-4 text-sm hover:bg-white/5"
                >
                    Add
                </button>
            </div>

            {error && <p className="text-rose-400 text-xs">{error}</p>}
        </div>
    );
};

// ---------------------------------------------------------------------------
// Tag input field (chips — add multiple by Enter / comma)
// ---------------------------------------------------------------------------
const TagListField = ({ value, onChange, placeholder }) => {
    const tags = value || [];
    const [input, setInput] = useState("");

    const addTags = (raw) => {
        const parts = String(raw)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        if (parts.length) {
            const next = [...tags];
            parts.forEach((p) => {
                if (!next.includes(p)) next.push(p);
            });
            onChange(next);
        }
        setInput("");
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTags(input);
        } else if (e.key === "Backspace" && input === "" && tags.length) {
            onChange(tags.slice(0, -1));
        }
    };

    const remove = (i) => onChange(tags.filter((_, idx) => idx !== i));

    return (
        <div className="flex flex-wrap items-center gap-2 bg-[#141414] border border-[#D7E2EA]/15 focus-within:border-[#B600A8] rounded-xl px-3 py-2.5 transition-colors">
            {tags.map((t, i) => (
                <span
                    key={`${t}-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B600A8]/25 to-[#BE4C00]/25 border border-[#D7E2EA]/15 text-[#D7E2EA] text-xs uppercase tracking-wider px-3 py-1.5"
                >
                    {t}
                    <button
                        type="button"
                        onClick={() => remove(i)}
                        className="hover:text-white text-[#D7E2EA]/70"
                        title="Remove"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={() => input.trim() && addTags(input)}
                placeholder={placeholder || "Type and press Enter"}
                className="flex-1 min-w-[140px] bg-transparent outline-none text-[#D7E2EA] placeholder-[#D7E2EA]/30 text-sm py-1"
            />
        </div>
    );
};

// ---------------------------------------------------------------------------
// Entity form (modal)
// ---------------------------------------------------------------------------
const EntityForm = ({ schema, initial, onCancel, onSaved }) => {
    const isEdit = Boolean(initial?.id);
    const [form, setForm] = useState({ ...schema.empty, ...initial });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const setField = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const save = async () => {
        setBusy(true);
        setError("");
        try {
            const payload = { ...form };
            // Clean list fields and coerce numbers
            schema.fields.forEach((f) => {
                if (f.type === "list" || f.type === "images" || f.type === "tags") {
                    payload[f.key] = (payload[f.key] || []).filter(
                        (s) => String(s).trim() !== ""
                    );
                }
                if (f.type === "number") {
                    payload[f.key] = Number(payload[f.key]) || 0;
                }
            });
            if (isEdit) {
                await adminUpdate(schema.resource, initial.id, payload);
            } else {
                await adminCreate(schema.resource, payload);
            }
            onSaved();
        } catch (err) {
            setError(
                err?.response?.data?.detail
                    ? JSON.stringify(err.response.data.detail)
                    : "Could not save. Check your inputs."
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-8">
            <div className="glass rounded-[24px] w-full max-w-2xl my-4">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7E2EA]/10 sticky top-0 bg-[#0C0C0C]/80 backdrop-blur rounded-t-[24px]">
                    <h3 className="text-lg font-semibold text-[#D7E2EA]">
                        {isEdit ? "Edit" : "Add"} {schema.label.slice(0, -1)}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/10 text-[#D7E2EA]"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    {schema.fields.map((f) => (
                        <div key={f.key}>
                            {f.type !== "bool" && (
                                <label className="block text-xs uppercase tracking-[0.18em] text-[#D7E2EA]/50 mb-2">
                                    {f.label}
                                    {f.required && <span className="text-[#B600A8]"> *</span>}
                                </label>
                            )}

                            {f.type === "text" && (
                                <input
                                    type="text"
                                    value={form[f.key] ?? ""}
                                    onChange={(e) => setField(f.key, e.target.value)}
                                    className={inputClass}
                                />
                            )}

                            {f.type === "number" && (
                                <input
                                    type="number"
                                    value={form[f.key] ?? 0}
                                    onChange={(e) => setField(f.key, e.target.value)}
                                    className={inputClass}
                                />
                            )}

                            {f.type === "textarea" && (
                                <textarea
                                    rows={3}
                                    value={form[f.key] ?? ""}
                                    onChange={(e) => setField(f.key, e.target.value)}
                                    className={`${inputClass} resize-y`}
                                />
                            )}

                            {f.type === "list" && (
                                <textarea
                                    rows={4}
                                    value={(form[f.key] || []).join("\n")}
                                    onChange={(e) =>
                                        setField(f.key, e.target.value.split("\n"))
                                    }
                                    placeholder="One item per line"
                                    className={`${inputClass} resize-y font-mono text-xs`}
                                />
                            )}

                            {f.type === "tags" && (
                                <TagListField
                                    value={form[f.key]}
                                    onChange={(v) => setField(f.key, v)}
                                    placeholder="e.g. Next.js, Vercel — press Enter"
                                />
                            )}

                            {f.type === "images" && (
                                <ImageListField
                                    value={form[f.key]}
                                    onChange={(v) => setField(f.key, v)}
                                />
                            )}

                            {f.type === "icon" && (
                                <select
                                    value={form[f.key] ?? ICON_NAMES[0]}
                                    onChange={(e) => setField(f.key, e.target.value)}
                                    className={`${inputClass} cursor-pointer`}
                                    style={{ colorScheme: "dark" }}
                                >
                                    {ICON_NAMES.map((name) => (
                                        <option key={name} value={name} className="bg-[#141414]">
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {f.type === "bool" && (
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(form[f.key])}
                                        onChange={(e) => setField(f.key, e.target.checked)}
                                        className="h-5 w-5 accent-[#B600A8]"
                                    />
                                    <span className="text-[#D7E2EA] text-sm">{f.label}</span>
                                </label>
                            )}
                        </div>
                    ))}

                    {error && <p className="text-rose-400 text-sm break-words">{error}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D7E2EA]/10">
                    <button
                        onClick={onCancel}
                        className="rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA] px-5 py-2.5 text-sm hover:bg-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={save}
                        disabled={busy}
                        className="inline-flex items-center gap-2 rounded-full text-white px-6 py-2.5 text-sm font-medium disabled:opacity-60"
                        style={{
                            background:
                                "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                        }}
                    >
                        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isEdit ? "Save changes" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
const Dashboard = ({ onLogout }) => {
    const [tab, setTab] = useState("services");
    const [data, setData] = useState({
        services: [],
        projects: [],
        pricing: [],
        messages: [],
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // {schemaKey, item}

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [services, projects, pricing, messages] = await Promise.all([
                getServices().catch(() => []),
                getProjects().catch(() => []),
                getPricing().catch(() => []),
                adminGetContacts().catch(() => []),
            ]);
            setData({ services, projects, pricing, messages });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const remove = async (resource, id) => {
        if (!window.confirm("Delete this item? This cannot be undone.")) return;
        await adminDelete(resource, id);
        loadAll();
    };

    const removeMessage = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        await adminDeleteContact(id);
        loadAll();
    };

    const counts = {
        services: data.services.length,
        projects: data.projects.length,
        pricing: data.pricing.length,
        messages: data.messages.length,
    };

    return (
        <div className="min-h-screen">
            {/* Top bar */}
            <header className="sticky top-0 z-40 glass border-b border-[#D7E2EA]/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#B600A8] via-[#7621B0] to-[#BE4C00] text-white text-sm font-black">
                            H
                        </span>
                        <span className="text-[#D7E2EA] font-bold">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/"
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA] px-4 py-2 text-sm hover:bg-white/5"
                        >
                            <ExternalLink className="h-4 w-4" /> View site
                        </Link>
                        <button
                            onClick={onLogout}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA] px-4 py-2 text-sm hover:bg-white/5"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                                tab === t
                                    ? "text-white"
                                    : "glass text-[#D7E2EA]/70 hover:text-[#D7E2EA]"
                            }`}
                            style={
                                tab === t
                                    ? {
                                          background:
                                              "linear-gradient(123deg, #B600A8 0%, #7621B0 55%, #BE4C00 100%)",
                                      }
                                    : {}
                            }
                        >
                            {t}
                            {typeof counts[t] === "number" && (
                                <span className="opacity-60"> ({counts[t]})</span>
                            )}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 text-[#D7E2EA]/60 py-20 justify-center">
                        <Loader2 className="h-5 w-5 animate-spin" /> Loading…
                    </div>
                ) : tab === "settings" ? (
                    <SettingsPanel />
                ) : tab === "messages" ? (
                    <MessagesList
                        messages={data.messages}
                        onDelete={removeMessage}
                    />
                ) : (
                    <EntityList
                        schema={SCHEMAS[tab]}
                        items={data[tab]}
                        onAdd={() => setEditing({ schemaKey: tab, item: {} })}
                        onEdit={(item) => setEditing({ schemaKey: tab, item })}
                        onDelete={(id) => remove(SCHEMAS[tab].resource, id)}
                    />
                )}
            </div>

            {editing && (
                <EntityForm
                    schema={SCHEMAS[editing.schemaKey]}
                    initial={editing.item}
                    onCancel={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null);
                        loadAll();
                    }}
                />
            )}
        </div>
    );
};

const EntityList = ({ schema, items, onAdd, onEdit, onDelete }) => (
    <div>
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-[#D7E2EA]">{schema.label}</h2>
            <button
                data-testid={`admin-add-${schema.resource}`}
                onClick={onAdd}
                className="inline-flex items-center gap-2 rounded-full text-white px-5 py-2.5 text-sm font-medium"
                style={{
                    background:
                        "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                }}
            >
                <Plus className="h-4 w-4" /> Add new
            </button>
        </div>

        {items.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-[#D7E2EA]/50">
                Nothing here yet. Click “Add new” to create one.
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="glass rounded-2xl p-4 sm:p-5 flex items-center gap-4"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[#D7E2EA] font-medium truncate">
                                    {schema.title(item)}
                                </span>
                                {item.highlighted && (
                                    <Star className="h-4 w-4 fill-[#BE4C00] text-[#BE4C00] flex-shrink-0" />
                                )}
                            </div>
                            <p className="text-[#D7E2EA]/45 text-sm truncate mt-0.5">
                                {schema.meta(item)}
                            </p>
                        </div>
                        {schema.resource === "projects" &&
                            item.live_url &&
                            item.live_url !== "#" && (
                                <a
                                    href={item.live_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 text-[#D7E2EA]/70"
                                    title="Open live link"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        <button
                            onClick={() => onEdit(item)}
                            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/10 text-[#D7E2EA]/70"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-rose-500/15 text-rose-400/80"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const SettingsPanel = () => {
    const [form, setForm] = useState(null);
    const [busy, setBusy] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getSettings()
            .then((data) => setForm(data || {}))
            .catch(() => setForm({}));
    }, []);

    const setField = (key, value) => {
        setSaved(false);
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const save = async () => {
        setBusy(true);
        setError("");
        setSaved(false);
        try {
            await adminUpdateSettings(form);
            setSaved(true);
        } catch (err) {
            setError(
                err?.response?.status === 401
                    ? "Session expired. Please log in again."
                    : "Could not save settings."
            );
        } finally {
            setBusy(false);
        }
    };

    if (!form) {
        return (
            <div className="flex items-center gap-3 text-[#D7E2EA]/60 py-20 justify-center">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h2 className="text-xl font-semibold text-[#D7E2EA]">Site Settings</h2>
                <div className="flex items-center gap-3">
                    {saved && <span className="text-emerald-400 text-sm">Saved!</span>}
                    {error && <span className="text-rose-400 text-sm">{error}</span>}
                    <button
                        data-testid="admin-save-settings"
                        onClick={save}
                        disabled={busy}
                        className="inline-flex items-center gap-2 rounded-full text-white px-6 py-2.5 text-sm font-medium disabled:opacity-60"
                        style={{
                            background:
                                "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                        }}
                    >
                        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save settings
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {SETTINGS_GROUPS.map((group) => (
                    <div key={group.title} className="glass rounded-2xl p-5 sm:p-6">
                        <h3 className="text-[#D7E2EA] font-semibold mb-4">
                            {group.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {group.fields.map((f) => (
                                <div
                                    key={f.key}
                                    className={f.type === "textarea" ? "sm:col-span-2" : ""}
                                >
                                    <label className="block text-xs uppercase tracking-[0.18em] text-[#D7E2EA]/50 mb-2">
                                        {f.label}
                                    </label>
                                    {f.type === "textarea" ? (
                                        <textarea
                                            rows={2}
                                            value={form[f.key] ?? ""}
                                            onChange={(e) => setField(f.key, e.target.value)}
                                            className={`${inputClass} resize-y`}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={form[f.key] ?? ""}
                                            onChange={(e) => setField(f.key, e.target.value)}
                                            className={inputClass}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MessagesList = ({ messages, onDelete }) => (
    <div>
        <h2 className="text-xl font-semibold text-[#D7E2EA] mb-5">
            Contact Messages
        </h2>
        {messages.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-[#D7E2EA]/50">
                No messages yet.
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {messages.map((m) => (
                    <div key={m.id} className="glass rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span className="text-[#D7E2EA] font-medium">
                                        {m.name}
                                    </span>
                                    <a
                                        href={`mailto:${m.email}`}
                                        className="text-[#B600A8] text-sm hover:underline"
                                    >
                                        {m.email}
                                    </a>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs uppercase tracking-wider text-[#D7E2EA]/60 border border-[#D7E2EA]/15 rounded-full px-2.5 py-0.5">
                                        {m.project_type}
                                    </span>
                                    {m.budget && (
                                        <span className="text-xs uppercase tracking-wider text-[#D7E2EA]/60 border border-[#D7E2EA]/15 rounded-full px-2.5 py-0.5">
                                            {m.budget}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => onDelete(m.id)}
                                className="h-9 w-9 flex flex-shrink-0 items-center justify-center rounded-full hover:bg-rose-500/15 text-rose-400/80"
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-[#D7E2EA]/70 text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                            {m.message}
                        </p>
                    </div>
                ))}
            </div>
        )}
    </div>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const AdminPage = () => {
    const [authed, setAuthed] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setChecking(false);
            return;
        }
        adminVerify()
            .then(() => setAuthed(true))
            .catch(() => clearToken())
            .finally(() => setChecking(false));
    }, []);

    const logout = () => {
        clearToken();
        setAuthed(false);
    };

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#D7E2EA]/60">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return authed ? (
        <Dashboard onLogout={logout} />
    ) : (
        <LoginScreen onLogin={() => setAuthed(true)} />
    );
};

export default AdminPage;
