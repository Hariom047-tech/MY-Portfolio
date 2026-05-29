import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { getPricing } from "@/lib/api";

// Distinct accent color per card (cycles for extra plans).
const PALETTE = [
    { from: "#22D3EE", to: "#3B82F6", glow: "rgba(59,130,246,0.45)" }, // cyan → blue
    { from: "#B600A8", to: "#7621B0", glow: "rgba(182,0,168,0.55)" }, // magenta → purple
    { from: "#34D399", to: "#059669", glow: "rgba(16,185,129,0.45)" }, // emerald
    { from: "#FB923C", to: "#F97316", glow: "rgba(249,115,22,0.45)" }, // orange
    { from: "#F472B6", to: "#F43F5E", glow: "rgba(244,63,94,0.45)" }, // pink → rose
    { from: "#A78BFA", to: "#7C3AED", glow: "rgba(124,58,237,0.45)" }, // violet
];

const FALLBACK = [
    {
        id: "starter",
        name: "Starter Website",
        tagline: "For founders & small brands",
        price: "₹15,000+",
        period: "/project",
        description:
            "A fast, modern, responsive website to establish your online presence and start capturing leads.",
        features: [
            "Responsive Website",
            "Modern UI Design",
            "Contact Form",
            "SEO Optimization",
        ],
        cta: "Start now",
        highlighted: false,
    },
    {
        id: "business",
        name: "Business Website",
        tagline: "The most popular plan",
        price: "₹35,000+",
        period: "/project",
        description:
            "A custom website with admin dashboard, database and WhatsApp integration to run and grow your business.",
        features: [
            "Custom Website",
            "Admin Dashboard",
            "Database Integration",
            "WhatsApp Integration",
            "SEO Optimization",
        ],
        cta: "Book this plan",
        highlighted: true,
    },
    {
        id: "mobile-app",
        name: "Mobile Application",
        tagline: "Android & iOS",
        price: "₹60,000+",
        period: "/project",
        description:
            "A cross-platform mobile app with Firebase backend, admin panel and push notifications.",
        features: [
            "Android & iOS App",
            "Firebase Integration",
            "Admin Panel",
            "Push Notifications",
        ],
        cta: "Build my app",
        highlighted: false,
    },
    {
        id: "ai-automation",
        name: "AI Automation System",
        tagline: "AI agents & workflows",
        price: "₹80,000+",
        period: "/project",
        description:
            "End-to-end AI automation with calling agents, WhatsApp automation and CRM workflows that run 24/7.",
        features: [
            "AI Calling Agent",
            "WhatsApp Automation",
            "CRM Integration",
            "Google Sheets Automation",
            "Twilio Integration",
            "n8n Workflow",
        ],
        cta: "Automate my business",
        highlighted: false,
    },
    {
        id: "enterprise",
        name: "Custom Enterprise Solution",
        tagline: "For ambitious teams",
        price: "Contact Us",
        period: "",
        description:
            "A fully custom software platform combining web, mobile, AI automation, dashboards and CRM with dedicated support.",
        features: [
            "Fully Custom Software",
            "AI Automation",
            "Dashboard & CRM",
            "Dedicated Support",
        ],
        cta: "Request proposal",
        highlighted: false,
    },
];

const PlanCard = ({ plan, index }) => {
    const highlighted = plan.highlighted;
    const c = PALETTE[index % PALETTE.length];
    const gradient = `linear-gradient(140deg, ${c.from} 0%, ${c.to} 100%)`;
    const gradientText = {
        backgroundImage: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
    };

    const goToContact = () => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <FadeIn delay={index * 0.08} y={40} className="h-full">
            <motion.div
                data-testid={`pricing-card-${plan.id}`}
                whileHover={{ y: -12, boxShadow: `0 45px 90px -30px ${c.glow}` }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`relative h-full flex flex-col overflow-hidden rounded-[28px] sm:rounded-[32px] md:rounded-[40px] p-6 sm:p-8 md:p-10 ${
                    highlighted ? "text-white md:scale-[1.04]" : "text-[#D7E2EA] glass"
                }`}
                style={
                    highlighted
                        ? {
                              background: gradient,
                              boxShadow: `0 35px 80px -30px ${c.glow}`,
                          }
                        : {
                              border: `1px solid ${c.from}55`,
                              boxShadow: `0 25px 70px -45px ${c.glow}`,
                          }
                }
            >
                {/* Colored top glow */}
                {!highlighted && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-40"
                        style={{
                            background: `radial-gradient(120% 90% at 50% 0%, ${c.glow} 0%, transparent 65%)`,
                            opacity: 0.5,
                        }}
                    />
                )}

                {highlighted && (
                    <span
                        data-testid={`pricing-badge-${plan.id}`}
                        className="absolute top-5 right-6 sm:right-8 rounded-full bg-white text-[#0C0C0C] text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-3 py-1 shadow-lg"
                    >
                        ★ Popular
                    </span>
                )}

                <div className="relative z-10 flex items-center justify-between gap-3">
                    <h3
                        className="font-semibold uppercase tracking-wide"
                        style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)" }}
                    >
                        {plan.name}
                    </h3>
                    {!highlighted && (
                        <span
                            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                            style={{ background: gradient }}
                        />
                    )}
                </div>

                <p
                    className={`relative z-10 mt-2 text-sm sm:text-base font-light ${
                        highlighted ? "text-white/85" : "text-[#D7E2EA]/60"
                    }`}
                >
                    {plan.tagline}
                </p>

                <div className="relative z-10 mt-6 sm:mt-8 flex items-baseline gap-2">
                    <span
                        className="font-black leading-none"
                        style={{
                            fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
                            ...(highlighted ? {} : gradientText),
                        }}
                    >
                        {plan.price}
                    </span>
                    {plan.period && (
                        <span
                            className={`text-sm sm:text-base font-light ${
                                highlighted ? "text-white/75" : "text-[#D7E2EA]/50"
                            }`}
                        >
                            {plan.period}
                        </span>
                    )}
                </div>

                <p
                    className={`relative z-10 mt-4 sm:mt-5 text-sm sm:text-base font-light leading-relaxed ${
                        highlighted ? "text-white/85" : "text-[#D7E2EA]/65"
                    }`}
                >
                    {plan.description}
                </p>

                <ul className="relative z-10 mt-6 sm:mt-8 space-y-3 flex-1">
                    {plan.features.map((f, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 text-sm sm:text-base"
                        >
                            <span
                                className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                                style={
                                    highlighted
                                        ? { background: "rgba(255,255,255,0.2)" }
                                        : { background: gradient }
                                }
                            >
                                <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            </span>
                            <span
                                className={
                                    highlighted ? "text-white/90" : "text-[#D7E2EA]/85"
                                }
                            >
                                {f}
                            </span>
                        </li>
                    ))}
                </ul>

                <motion.button
                    data-testid={`pricing-cta-${plan.id}`}
                    onClick={goToContact}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative z-10 mt-8 sm:mt-10 w-full rounded-full font-semibold uppercase tracking-widest text-sm sm:text-base py-3 sm:py-3.5"
                    style={
                        highlighted
                            ? { background: "#ffffff", color: "#0C0C0C" }
                            : { background: gradient, color: "#ffffff" }
                    }
                >
                    {plan.cta}
                </motion.button>
            </motion.div>
        </FadeIn>
    );
};

export const PricingSection = () => {
    const [plans, setPlans] = useState(FALLBACK);

    useEffect(() => {
        let cancelled = false;
        getPricing()
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setPlans(data);
                }
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section
            id="price"
            data-testid="pricing-section"
            className="w-full px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative z-10"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
                    <FadeIn y={20}>
                        <span
                            className="uppercase tracking-[0.4em] font-light text-[#D7E2EA]/60"
                            style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)" }}
                        >
                            Pricing
                        </span>
                    </FadeIn>
                    <FadeIn y={40} delay={0.05}>
                        <h2
                            data-testid="pricing-heading"
                            className="hero-heading font-black uppercase leading-none tracking-tight"
                            style={{ fontSize: "clamp(2.5rem, 9vw, 120px)" }}
                        >
                            Pick a plan
                        </h2>
                    </FadeIn>
                    <FadeIn y={20} delay={0.15}>
                        <p
                            className="max-w-xl text-[#D7E2EA]/70 font-light leading-relaxed"
                            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}
                        >
                            Transparent, project-based pricing in INR. Pick a plan,
                            share your requirements, and we&apos;ll start building
                            this week. Every plan is customizable.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 items-stretch">
                    {plans.map((plan, i) => (
                        <PlanCard key={plan.id} plan={plan} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
