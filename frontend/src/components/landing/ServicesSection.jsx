import React, { useEffect, useState } from "react";
import {
    Smartphone,
    Globe,
    Workflow,
    Bot,
    LayoutDashboard,
    Code2,
    Database,
    Cloud,
    Cpu,
    ShoppingCart,
    Palette,
    Rocket,
} from "lucide-react";
import { FadeIn } from "./FadeIn";
import { getServices } from "@/lib/api";

export const ICON_MAP = {
    Smartphone,
    Globe,
    Workflow,
    Bot,
    LayoutDashboard,
    Code2,
    Database,
    Cloud,
    Cpu,
    ShoppingCart,
    Palette,
    Rocket,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

const FALLBACK = [
    {
        id: "s1", number: "01", icon: "Smartphone",
        name: "Mobile Application Development",
        description: "Native-quality cross-platform apps that delight users and scale with your business.",
        items: ["Android & iOS apps", "Flutter apps", "Custom business applications"],
    },
    {
        id: "s2", number: "02", icon: "Globe",
        name: "Website Development",
        description: "Fast, SEO-optimized and responsive websites built for conversions and growth.",
        items: ["Business websites", "Custom web applications", "E-commerce websites", "School websites", "SEO optimized responsive websites"],
    },
    {
        id: "s3", number: "03", icon: "Workflow",
        name: "Business Automation",
        description: "Automate repetitive work so your team can focus on what actually grows revenue.",
        items: ["WhatsApp automation", "CRM automation", "Lead management systems", "Automated follow-up systems"],
    },
    {
        id: "s4", number: "04", icon: "Bot",
        name: "AI Agent & Agentic Workflows",
        description: "Intelligent AI agents and workflows that talk, decide and act on your behalf 24/7.",
        items: ["AI voice calling agents", "AI chatbots", "n8n automation workflows", "Twilio integrations", "ElevenLabs AI agents", "Google Sheets automation"],
    },
    {
        id: "s5", number: "05", icon: "LayoutDashboard",
        name: "CRM & Dashboard Systems",
        description: "Powerful admin panels and dashboards that turn your data into clear decisions.",
        items: ["Admin dashboards", "School management systems", "Customer management systems", "Analytics dashboards"],
    },
];

const ServiceCard = ({ service, index }) => {
    const Icon = ICON_MAP[service.icon] || Code2;
    return (
        <FadeIn delay={(index % 3) * 0.08} y={40} className="h-full">
            <div
                data-testid={`service-card-${service.number}`}
                className="glass glass-hover group h-full rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col"
            >
                <div className="flex items-center justify-between">
                    <span
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                        style={{
                            background:
                                "linear-gradient(140deg, #B600A8 0%, #7621B0 55%, #BE4C00 100%)",
                        }}
                    >
                        <Icon className="h-7 w-7" />
                    </span>
                    <span className="font-black text-[#D7E2EA]/10 text-5xl leading-none group-hover:text-[#D7E2EA]/20 transition-colors">
                        {service.number}
                    </span>
                </div>

                <h3
                    className="mt-6 font-semibold uppercase tracking-wide text-[#D7E2EA] leading-tight"
                    style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.4rem)" }}
                >
                    {service.name}
                </h3>
                <p className="mt-3 text-[#D7E2EA]/60 font-light text-sm sm:text-base leading-relaxed">
                    {service.description}
                </p>

                {service.items?.length > 0 && (
                    <ul className="mt-5 space-y-2.5 pt-5 border-t border-[#D7E2EA]/10">
                        {service.items.map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-3 text-sm text-[#D7E2EA]/75"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#B600A8] to-[#BE4C00] flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </FadeIn>
    );
};

export const ServicesSection = () => {
    const [services, setServices] = useState(FALLBACK);

    useEffect(() => {
        let cancelled = false;
        getServices()
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setServices(data);
                }
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section
            id="services"
            data-testid="services-section"
            className="relative w-full px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
                    <FadeIn y={20}>
                        <span
                            className="uppercase tracking-[0.4em] font-light text-[#D7E2EA]/60"
                            style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)" }}
                        >
                            What I do
                        </span>
                    </FadeIn>
                    <FadeIn y={40} delay={0.05}>
                        <h2
                            data-testid="services-heading"
                            className="hero-heading font-black uppercase leading-none tracking-tight"
                            style={{ fontSize: "clamp(3rem, 11vw, 150px)" }}
                        >
                            Services
                        </h2>
                    </FadeIn>
                    <FadeIn y={20} delay={0.15}>
                        <p
                            className="max-w-xl text-[#D7E2EA]/70 font-light leading-relaxed"
                            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}
                        >
                            End-to-end software services — from idea to launch and
                            automation. Everything your business needs to go digital
                            and scale.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {services.map((service, i) => (
                        <ServiceCard key={service.id || service.number} service={service} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
