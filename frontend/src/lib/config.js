// Default site configuration. These are used as fallbacks before the live
// settings load from the API (and are editable in the Admin panel → Settings).
export const SITE = {
    brandName: "Hariom Patidar",
    brandShort: "Hariom",
    role: "Full Stack Developer",
    email: "hello@hariompatidar.dev",
    phone: "+91 99999 99999",
    location: "India · Working worldwide",
    // WhatsApp number in international format, digits only (country code + number).
    whatsappNumber: "919999999999",
    whatsappMessage:
        "Hi Hariom! I came across your portfolio and I'd like to discuss a project.",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    twitter: "https://twitter.com/",
    github: "https://github.com/",
    facebook: "",
    youtube: "",
};

// Build a wa.me link from any number + message.
export const buildWhatsappLink = (number, message) => {
    const digits = String(number || "").replace(/[^\d]/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent(message || "")}`;
};

// Fallback link using defaults (used when settings context isn't available).
export const whatsappLink = (message = SITE.whatsappMessage) =>
    buildWhatsappLink(SITE.whatsappNumber, message);

export const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const NAV_LINKS = [
    { label: "Home", target: "home" },
    { label: "Services", target: "services" },
    { label: "Projects", target: "projects" },
    { label: "Pricing", target: "price" },
    { label: "About", target: "about" },
    { label: "Contact", target: "contact" },
];
