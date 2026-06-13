import React, { useState } from "react";
import {
    Mail,
    MapPin,
    Phone,
    Instagram,
    Linkedin,
    Twitter,
    Github,
    Facebook,
    Youtube,
    ArrowRight,
    MessageCircle,
} from "lucide-react";
import { FadeIn } from "./FadeIn";
import { submitContact, submitToSheet, isSheetConfigured } from "@/lib/api";
import { NAV_LINKS, scrollToId } from "@/lib/config";
import { useSettings } from "@/lib/SettingsContext";

const PROJECT_TYPES = [
    "Website Development",
    "Mobile App Development",
    "Business Automation",
    "AI Agent / Workflow",
    "CRM / Dashboard",
    "Other",
];

const BUDGETS = ["< ₹25k", "₹25k – ₹60k", "₹60k – ₹1.5L", "₹1.5L+"];

// Strip the +91 / 91 country code (and spaces, dashes, leading 0) so the
// sheet stores a clean 10-digit number.
const cleanPhone = (raw) => {
    let digits = (raw || "").replace(/\D/g, "");
    if (digits.length > 10 && digits.startsWith("91")) {
        digits = digits.slice(2);
    }
    if (digits.length > 10 && digits.startsWith("0")) {
        digits = digits.replace(/^0+/, "");
    }
    return digits;
};

const buildSocials = (s) =>
    [
        { name: "GitHub", href: s.github, Icon: Github },
        { name: "LinkedIn", href: s.linkedin, Icon: Linkedin },
        { name: "Instagram", href: s.instagram, Icon: Instagram },
        { name: "Twitter", href: s.twitter, Icon: Twitter },
        { name: "Facebook", href: s.facebook, Icon: Facebook },
        { name: "YouTube", href: s.youtube, Icon: Youtube },
    ].filter((item) => item.href && item.href.trim() !== "");

const FieldLabel = ({ children }) => (
    <label className="block text-xs uppercase tracking-[0.25em] text-[#D7E2EA]/60 mb-2">
        {children}
    </label>
);

const inputClass =
    "w-full bg-transparent border-b-2 border-[#D7E2EA]/20 focus:border-[#D7E2EA] outline-none py-3 text-[#D7E2EA] placeholder-[#D7E2EA]/30 text-base sm:text-lg font-light transition-colors duration-200";

export const ContactSection = () => {
    const { settings, wa } = useSettings();
    const SOCIALS = buildSocials(settings);
    const emptyForm = {
        name: "",
        email: "",
        phone: "",
        project_type: PROJECT_TYPES[0],
        budget: BUDGETS[1],
        message: "",
    };
    const [form, setForm] = useState(emptyForm);
    const [status, setStatus] = useState({ state: "idle", error: "" });

    const update = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (status.state === "submitting") return;
        setStatus({ state: "submitting", error: "" });
        try {
            if (isSheetConfigured()) {
                // Primary: drop the lead straight into the Google Sheet.
                const callTime = new Date().toLocaleTimeString("en-GB", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
                await submitToSheet({
                    customer_name: form.name,
                    customer_phone: cleanPhone(form.phone),
                    customer_gmail: form.email,
                    call_time: callTime,
                    status: "pending",
                    project_type: form.project_type,
                    budget: form.budget,
                    message: form.message,
                });
                // Best-effort copy to the backend admin inbox (ignored if down).
                submitContact(form).catch(() => {});
            } else {
                // Fallback: backend only (e.g. during local development).
                await submitContact(form);
            }
            setStatus({ state: "success", error: "" });
            setForm(emptyForm);
        } catch (err) {
            const detail =
                err?.response?.data?.detail?.[0]?.msg ||
                err?.response?.data?.detail ||
                "Could not send. Please try again.";
            setStatus({ state: "error", error: String(detail) });
        }
    };

    return (
        <section
            id="contact"
            data-testid="contact-section"
            className="relative w-full px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 overflow-hidden"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="absolute inset-0 page-glow pointer-events-none opacity-70" />
            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="flex flex-col items-start gap-5 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
                    <FadeIn y={20}>
                        <span
                            className="uppercase tracking-[0.4em] font-light text-[#D7E2EA]/60"
                            style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)" }}
                        >
                            Contact
                        </span>
                    </FadeIn>
                    <FadeIn y={40} delay={0.05}>
                        <h2
                            data-testid="contact-heading"
                            className="hero-heading font-black uppercase leading-none tracking-tight"
                            style={{ fontSize: "clamp(2.5rem, 10vw, 140px)" }}
                        >
                            Let&apos;s build<br />something
                        </h2>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-14 lg:gap-20 items-start">
                    {/* Info side */}
                    <FadeIn y={30} className="lg:col-span-2 flex flex-col gap-8 sm:gap-10">
                        <p
                            className="text-[#D7E2EA]/75 font-light leading-relaxed max-w-md"
                            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}
                        >
                            Have a project in mind? Tell me what you&apos;re building
                            and I&apos;ll get back to you within 24&nbsp;hours — or
                            message me directly on WhatsApp for a faster reply.
                        </p>

                        <a
                            data-testid="contact-whatsapp"
                            href={wa()}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-3 rounded-full text-white font-medium uppercase tracking-widest px-7 py-3.5 text-sm sm:text-base w-full sm:w-auto transition-transform duration-300 hover:scale-[1.03]"
                            style={{
                                background: "#25D366",
                                boxShadow: "0 16px 40px -12px rgba(37,211,102,0.55)",
                            }}
                        >
                            <MessageCircle className="h-5 w-5" />
                            Chat on WhatsApp
                        </a>

                        <div className="flex flex-col gap-5 sm:gap-6">
                            <a
                                data-testid="contact-email"
                                href={`mailto:${settings.email}`}
                                className="group flex items-center gap-4 text-[#D7E2EA] hover:text-white transition-colors"
                            >
                                <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#D7E2EA]/30 group-hover:border-[#D7E2EA]">
                                    <Mail className="h-5 w-5" />
                                </span>
                                <span className="flex flex-col">
                                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D7E2EA]/50">
                                        Email
                                    </span>
                                    <span className="text-base sm:text-lg font-medium">
                                        {settings.email}
                                    </span>
                                </span>
                            </a>

                            {settings.phone && settings.phone.trim() !== "" && (
                                <a
                                    data-testid="contact-phone"
                                    href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                                    className="group flex items-center gap-4 text-[#D7E2EA] hover:text-white transition-colors"
                                >
                                    <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#D7E2EA]/30 group-hover:border-[#D7E2EA]">
                                        <Phone className="h-5 w-5" />
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D7E2EA]/50">
                                            Call / Mobile
                                        </span>
                                        <span className="text-base sm:text-lg font-medium">
                                            {settings.phone}
                                        </span>
                                    </span>
                                </a>
                            )}

                            <div className="flex items-center gap-4 text-[#D7E2EA]">
                                <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#D7E2EA]/30">
                                    <MapPin className="h-5 w-5" />
                                </span>
                                <span className="flex flex-col">
                                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D7E2EA]/50">
                                        Based in
                                    </span>
                                    <span className="text-base sm:text-lg font-medium">
                                        {settings.location}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D7E2EA]/50">
                                Elsewhere
                            </span>
                            <div className="flex items-center gap-3">
                                {SOCIALS.map(({ name, href, Icon }) => (
                                    <a
                                        key={name}
                                        data-testid={`social-${name.toLowerCase()}`}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={name}
                                        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors"
                                    >
                                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Form side */}
                    <FadeIn y={30} delay={0.1} className="lg:col-span-3">
                        <form
                            data-testid="contact-form"
                            onSubmit={onSubmit}
                            className="glass rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 flex flex-col gap-7 sm:gap-8"
                            noValidate
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8">
                                <div>
                                    <FieldLabel>Your name</FieldLabel>
                                    <input
                                        data-testid="contact-input-name"
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={update("name")}
                                        placeholder="Your full name"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Email</FieldLabel>
                                    <input
                                        data-testid="contact-input-email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={update("email")}
                                        placeholder="you@company.com"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <FieldLabel>Phone / WhatsApp number</FieldLabel>
                                <input
                                    data-testid="contact-input-phone"
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={update("phone")}
                                    placeholder="+91 98765 43210"
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8">
                                <div>
                                    <FieldLabel>Project type</FieldLabel>
                                    <select
                                        data-testid="contact-input-project-type"
                                        value={form.project_type}
                                        onChange={update("project_type")}
                                        className={`${inputClass} appearance-none cursor-pointer`}
                                        style={{ colorScheme: "dark" }}
                                    >
                                        {PROJECT_TYPES.map((t) => (
                                            <option key={t} value={t} className="bg-[#0C0C0C]">
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <FieldLabel>Budget</FieldLabel>
                                    <select
                                        data-testid="contact-input-budget"
                                        value={form.budget}
                                        onChange={update("budget")}
                                        className={`${inputClass} appearance-none cursor-pointer`}
                                        style={{ colorScheme: "dark" }}
                                    >
                                        {BUDGETS.map((b) => (
                                            <option key={b} value={b} className="bg-[#0C0C0C]">
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <FieldLabel>Tell me about your project</FieldLabel>
                                <textarea
                                    data-testid="contact-input-message"
                                    required
                                    value={form.message}
                                    onChange={update("message")}
                                    rows={4}
                                    placeholder="What are you building? Any goals, deadlines or references?"
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pt-2">
                                <p
                                    data-testid="contact-status"
                                    className={`text-sm ${
                                        status.state === "success"
                                            ? "text-emerald-400"
                                            : status.state === "error"
                                            ? "text-rose-400"
                                            : "text-[#D7E2EA]/50"
                                    }`}
                                >
                                    {status.state === "success" &&
                                        "Thanks! Your message is in — I'll reply within 24 hours."}
                                    {status.state === "error" && status.error}
                                    {status.state === "submitting" &&
                                        "Sending your message…"}
                                    {status.state === "idle" &&
                                        "Average reply time: under 24 hours."}
                                </p>
                                <button
                                    data-testid="contact-submit-btn"
                                    type="submit"
                                    disabled={status.state === "submitting"}
                                    className="group inline-flex items-center justify-center gap-3 rounded-full font-medium uppercase tracking-widest text-white px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed transition-transform duration-300 hover:scale-[1.02]"
                                    style={{
                                        background:
                                            "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                                        boxShadow:
                                            "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
                                        outline: "2px solid #ffffff",
                                        outlineOffset: "-3px",
                                    }}
                                >
                                    Send message
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </form>
                    </FadeIn>
                </div>

                {/* Footer */}
                <FadeIn y={20} delay={0.2}>
                    <footer className="mt-20 sm:mt-24 md:mt-28 pt-10 border-t border-[#D7E2EA]/10">
                        <div className="flex flex-col md:flex-row gap-10 md:gap-8 md:justify-between">
                            <div className="max-w-sm flex flex-col gap-4">
                                <div className="flex items-center gap-2.5 text-[#D7E2EA] font-bold text-lg">
                                    <img
                                        src="/logo.png"
                                        alt={`${settings.brandName} logo`}
                                        className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                                        draggable={false}
                                    />
                                    {settings.brandName}
                                </div>
                                <p className="text-[#D7E2EA]/55 font-light text-sm leading-relaxed">
                                    {settings.role} building modern websites, mobile apps
                                    and AI automation systems that help businesses grow.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D7E2EA]/50">
                                    Quick links
                                </span>
                                <div className="grid grid-cols-2 gap-x-10 gap-y-2.5">
                                    {NAV_LINKS.map((link) => (
                                        <button
                                            key={link.target}
                                            onClick={() =>
                                                link.target === "home"
                                                    ? window.scrollTo({ top: 0, behavior: "smooth" })
                                                    : scrollToId(link.target)
                                            }
                                            className="text-left text-[#D7E2EA]/70 hover:text-white text-sm transition-colors"
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D7E2EA]/50">
                                    Follow
                                </span>
                                <div className="flex items-center gap-3">
                                    {SOCIALS.map(({ name, href, Icon }) => (
                                        <a
                                            key={name}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={name}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors"
                                        >
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-[#D7E2EA]/10 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between text-[#D7E2EA]/45 text-xs uppercase tracking-[0.2em]">
                            <span>© {new Date().getFullYear()} {settings.brandName}</span>
                            <span>Built with React · Available for new work</span>
                        </div>
                    </footer>
                </FadeIn>
            </div>
        </section>
    );
};

export default ContactSection;
