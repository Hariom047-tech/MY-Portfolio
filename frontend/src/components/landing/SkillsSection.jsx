import React from "react";
import {
    Code2,
    Atom,
    Smartphone,
    Server,
    Database,
    Flame,
    Wind,
    Workflow,
    Phone,
    Bot,
    Container,
    Cloud,
} from "lucide-react";
import { FadeIn } from "./FadeIn";

const SKILLS = [
    { name: "React", Icon: Atom },
    { name: "Next.js", Icon: Code2 },
    { name: "Flutter", Icon: Smartphone },
    { name: "Node.js", Icon: Server },
    { name: "MongoDB", Icon: Database },
    { name: "Firebase", Icon: Flame },
    { name: "Tailwind CSS", Icon: Wind },
    { name: "n8n", Icon: Workflow },
    { name: "Twilio", Icon: Phone },
    { name: "AI Automation", Icon: Bot },
    { name: "Docker", Icon: Container },
    { name: "AWS", Icon: Cloud },
];

const Pill = ({ name, Icon }) => (
    <div className="flex items-center gap-3 rounded-full glass px-5 py-3 mx-2 flex-shrink-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#B600A8] to-[#BE4C00] text-white">
            <Icon className="h-4 w-4" />
        </span>
        <span className="text-[#D7E2EA] text-sm sm:text-base font-medium whitespace-nowrap">
            {name}
        </span>
    </div>
);

export const SkillsSection = () => {
    const row = [...SKILLS, ...SKILLS];
    return (
        <section
            id="skills"
            data-testid="skills-section"
            className="relative w-full py-16 sm:py-20 overflow-hidden"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-10 sm:mb-14 text-center">
                <FadeIn y={20}>
                    <span
                        className="uppercase tracking-[0.4em] font-light text-[#D7E2EA]/60"
                        style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)" }}
                    >
                        Tech Stack
                    </span>
                </FadeIn>
                <FadeIn y={30} delay={0.05}>
                    <h2
                        className="mt-4 hero-heading font-black uppercase leading-none tracking-tight"
                        style={{ fontSize: "clamp(2rem, 7vw, 90px)" }}
                    >
                        Tools I work with
                    </h2>
                </FadeIn>
            </div>

            {/* Fading edges */}
            <div className="relative">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-[#0C0C0C] to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-[#0C0C0C] to-transparent" />

                <div className="flex w-max animate-marquee mb-4">
                    {row.map((s, i) => (
                        <Pill key={`a-${i}`} {...s} />
                    ))}
                </div>
                <div className="flex w-max animate-marquee-reverse">
                    {row.map((s, i) => (
                        <Pill key={`b-${i}`} {...s} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;
