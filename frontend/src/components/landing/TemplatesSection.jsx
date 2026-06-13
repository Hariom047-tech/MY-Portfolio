import React from "react";
import { Instagram, ArrowUpRight, Heart } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { useSettings } from "@/lib/SettingsContext";

// Templates showcased from Instagram (@ai_wallah.o).
// Images live in `frontend/public/templates/`. To add more, drop the file
// into that folder and add an entry below. Set `link` to the specific
// Instagram post URL (or leave the profile link as the fallback).
const TEMPLATES = [
    {
        id: 1,
        title: "Clothing Website & App Development",
        tag: "E-commerce",
        image: "/templates/clothing-website.png",
    },
    {
        id: 2,
        title: "AI Automation for Local Business",
        tag: "AI Automation",
        image: "/templates/ai-automation.png",
    },
    {
        id: 3,
        title: "Business Ideas We Can Launch",
        tag: "Web & App",
        image: "/templates/business-ideas.png",
    },
    {
        id: 4,
        title: "Restaurant Website & Food Delivery App",
        tag: "E-commerce",
        image: "/templates/restaurant.png",
    },
    {
        id: 5,
        title: "AI Calling Agent for Business",
        tag: "AI Automation",
        image: "/templates/ai-calling.png",
    },
    {
        id: 6,
        title: "Real Estate Website & Property App",
        tag: "Web & App",
        image: "/templates/real-estate.png",
    },
];

const TemplateCard = ({ template, link, delay }) => (
    <FadeIn y={30} delay={delay} className="mb-4 sm:mb-5 break-inside-avoid">
        <a
            href={link}
            target="_blank"
            rel="noreferrer"
            data-testid={`template-card-${template.id}`}
            className="group relative block overflow-hidden rounded-[20px] sm:rounded-[26px] border-2"
            style={{ borderColor: "#D7E2EA", backgroundColor: "#0C0C0C" }}
        >
            <img
                src={template.image}
                alt={template.title}
                loading="lazy"
                draggable={false}
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.04]"
            />

            {/* Tag */}
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-full bg-[#0C0C0C]/70 backdrop-blur-md border border-white/15 px-3 py-1 text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]">
                {template.tag}
            </span>

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-end justify-between gap-3">
                    <span
                        className="font-medium leading-tight text-[#D7E2EA]"
                        style={{ fontSize: "clamp(0.85rem, 1.4vw, 1.1rem)" }}
                    >
                        {template.title}
                    </span>
                    <span className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0C0C0C]/70 backdrop-blur-md border border-white/15 text-white">
                        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                </div>
            </div>

            {/* Instagram badge */}
            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#962fbf] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
        </a>
    </FadeIn>
);

export const TemplatesSection = () => {
    const { settings } = useSettings();
    const igLink = settings.instagram || "https://www.instagram.com/ai_wallah.o";
    const igHandle = settings.instagramHandle || "ai_wallah.o";

    return (
        <section
            id="templates"
            data-testid="templates-section"
            className="relative w-full px-4 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-12 sm:mb-16">
                    <FadeIn y={20}>
                        <span
                            className="uppercase tracking-[0.4em] font-light text-[#D7E2EA]/60"
                            style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)" }}
                        >
                            From my Instagram
                        </span>
                    </FadeIn>
                    <FadeIn y={40} delay={0.05}>
                        <h2
                            data-testid="templates-heading"
                            className="hero-heading font-black uppercase leading-none tracking-tight"
                            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
                        >
                            Templates
                        </h2>
                    </FadeIn>
                    <FadeIn y={20} delay={0.1}>
                        <p
                            className="text-[#D7E2EA]/65 font-light leading-relaxed max-w-xl"
                            style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)" }}
                        >
                            Website, app and AI automation marketing creatives I
                            design and share on Instagram. Follow{" "}
                            <span className="text-[#D7E2EA] font-medium">
                                @{igHandle}
                            </span>{" "}
                            for fresh drops every week.
                        </p>
                    </FadeIn>
                </div>

                {/* Profile / follow bar */}
                <FadeIn y={20} delay={0.1}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-[28px] sm:rounded-[32px] border-2 p-5 sm:p-6 mb-10 sm:mb-12"
                        style={{ borderColor: "#D7E2EA1A", backgroundColor: "#111" }}
                    >
                        <div className="flex items-center gap-4">
                            <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#962fbf] text-white">
                                <Instagram className="h-7 w-7 sm:h-8 sm:w-8" />
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[#D7E2EA] font-semibold text-base sm:text-lg">
                                    @{igHandle}
                                </span>
                                <span className="text-[#D7E2EA]/55 text-sm flex items-center gap-1.5">
                                    <Heart className="h-3.5 w-3.5" /> Design
                                    templates & AI content
                                </span>
                            </div>
                        </div>
                        <a
                            data-testid="templates-follow-btn"
                            href={igLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 rounded-full text-white font-medium uppercase tracking-widest px-7 py-3.5 text-sm w-full sm:w-auto transition-transform duration-300 hover:scale-[1.04]"
                            style={{
                                background:
                                    "linear-gradient(123deg, #feda75 0%, #d62976 50%, #962fbf 100%)",
                                boxShadow:
                                    "0 16px 40px -12px rgba(214, 41, 118, 0.55)",
                            }}
                        >
                            <Instagram className="h-5 w-5" />
                            Follow on Instagram
                        </a>
                    </div>
                </FadeIn>

                {/* Masonry grid (handles mixed portrait/landscape sizes) */}
                <div className="columns-1 sm:columns-2 gap-4 sm:gap-5">
                    {TEMPLATES.map((t, i) => (
                        <TemplateCard
                            key={t.id}
                            template={t}
                            link={igLink}
                            delay={0.05 * i}
                        />
                    ))}
                </div>

                {/* See all CTA */}
                <FadeIn y={20} delay={0.15}>
                    <div className="flex justify-center mt-12 sm:mt-16">
                        <a
                            data-testid="templates-see-all"
                            href={igLink}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-3 rounded-full border-2 border-[#D7E2EA]/25 text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-4 text-sm hover:bg-[#D7E2EA] hover:text-[#0C0C0C] transition-colors duration-300"
                        >
                            See all templates on Instagram
                            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default TemplatesSection;
