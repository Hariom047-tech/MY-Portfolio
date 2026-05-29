import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { LiveProjectButton } from "./LiveProjectButton";
import { getProjects } from "@/lib/api";

const shot = (seed) => `https://picsum.photos/seed/${seed}/900/700`;

const FALLBACK = [
    {
        id: "maa-baglamukhi",
        number: "01",
        category: "Web",
        name: "Maa Baglamukhi Website",
        description:
            "Professional spiritual and puja booking website for Maa Baglamukhi services with a responsive modern UI and online booking flow.",
        year: "2025",
        role: "Full Stack Development",
        tags: ["Next.js", "Tailwind CSS", "Vercel"],
        images: [shot("baglamukhi1"), shot("baglamukhi2"), shot("baglamukhi3")],
        live_url: "#",
    },
    {
        id: "rental-clothes-app",
        number: "02",
        category: "Mobile",
        name: "Rental Clothes Mobile Application",
        description:
            "Modern rental fashion mobile application with vendor management, customer booking system and real-time order tracking.",
        year: "2025",
        role: "Mobile App Development",
        tags: ["Flutter", "Firebase"],
        images: [shot("rental1"), shot("rental2"), shot("rental3")],
        live_url: "#",
    },
    {
        id: "school-management",
        number: "03",
        category: "Web",
        name: "School Management Website",
        description:
            "Complete school management platform with student management, attendance, fees, dashboards and a powerful admin panel.",
        year: "2024",
        role: "Full Stack Development",
        tags: ["React", "Node.js", "MongoDB"],
        images: [shot("school1"), shot("school2"), shot("school3")],
        live_url: "#",
    },
    {
        id: "crm-automation",
        number: "04",
        category: "Automation",
        name: "CRM Automation System",
        description:
            "Automated CRM system integrated with WhatsApp, Twilio, Google Sheets and AI workflow automation for lead capture and follow-up.",
        year: "2024",
        role: "Automation Engineering",
        tags: ["n8n", "Twilio", "Google Sheets API"],
        images: [shot("crm1"), shot("crm2"), shot("crm3")],
        live_url: "#",
    },
    {
        id: "ai-calling-agent",
        number: "05",
        category: "AI",
        name: "AI Calling Agent Automation",
        description:
            "AI voice calling system using ElevenLabs and Twilio for automated customer interactions and intelligent lead follow-up.",
        year: "2024",
        role: "AI Automation",
        tags: ["ElevenLabs", "Twilio", "n8n"],
        images: [shot("aicall1"), shot("aicall2"), shot("aicall3")],
        live_url: "#",
    },
];

const ProjectCard = ({ project, index, progress, range, targetScale }) => {
    const scale = useTransform(progress, range, [1, targetScale]);
    const [img1, img2, img3] = project.images;

    return (
        <div
            className="sticky"
            style={{ top: `${index * 22 + 88}px` }}
        >
            <motion.div
                data-testid={`project-card-${project.number}`}
                style={{ scale, transformOrigin: "top center" }}
                className="w-full mx-auto"
            >
                <div
                    className="rounded-[32px] sm:rounded-[48px] md:rounded-[60px] border-2 p-4 sm:p-6 md:p-8 flex flex-col gap-5 md:gap-8"
                    style={{
                        borderColor: "#D7E2EA",
                        backgroundColor: "#0C0C0C",
                    }}
                >
                    {/* Top row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 px-1 sm:px-3 md:px-4 pt-2 md:pt-4">
                        <div className="flex items-end gap-4 sm:gap-6 md:gap-10 flex-1 min-w-0">
                            <span
                                className="font-black leading-none flex-shrink-0"
                                style={{
                                    color: "#D7E2EA",
                                    fontSize: "clamp(2.5rem, 9vw, 130px)",
                                }}
                            >
                                {project.number}
                            </span>
                            <div className="flex flex-col gap-1.5 md:gap-2.5 min-w-0 pb-1 md:pb-3 flex-1">
                                <span
                                    className="uppercase tracking-widest font-light opacity-60"
                                    style={{
                                        color: "#D7E2EA",
                                        fontSize:
                                            "clamp(0.65rem, 0.9vw, 0.9rem)",
                                    }}
                                >
                                    {project.category} · {project.year}
                                </span>
                                <h3
                                    className="font-medium uppercase leading-tight"
                                    style={{
                                        color: "#D7E2EA",
                                        fontSize:
                                            "clamp(1rem, 2.2vw, 2rem)",
                                    }}
                                >
                                    {project.name}
                                </h3>
                                <p
                                    className="font-light leading-relaxed text-[#D7E2EA]/60 hidden sm:block max-w-xl"
                                    style={{
                                        fontSize:
                                            "clamp(0.8rem, 1.05vw, 1rem)",
                                    }}
                                >
                                    {project.description}
                                </p>
                                {project.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                        {project.tags.map((t) => (
                                            <span
                                                key={t}
                                                className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/70 border border-[#D7E2EA]/20 rounded-full px-2.5 py-0.5"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0 self-start md:self-end pb-1 md:pb-3">
                            {project.live_url && project.live_url !== "#" ? (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block"
                                >
                                    <LiveProjectButton
                                        dataTestId={`project-${project.number}-live-btn`}
                                    />
                                </a>
                            ) : (
                                <LiveProjectButton
                                    label="Coming Soon"
                                    dataTestId={`project-${project.number}-live-btn`}
                                    onClick={(e) => e.preventDefault()}
                                />
                            )}
                        </div>
                    </div>

                    {/* Image grid */}
                    <div className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                        <div className="col-span-2 flex flex-col gap-3 sm:gap-4 md:gap-5">
                            {img1 && (
                                <img
                                    src={img1}
                                    alt={`${project.name} preview 1`}
                                    loading="lazy"
                                    className="w-full object-cover rounded-[24px] sm:rounded-[40px] md:rounded-[52px]"
                                    style={{
                                        height: "clamp(110px, 16vw, 230px)",
                                    }}
                                    draggable={false}
                                />
                            )}
                            {img2 && (
                                <img
                                    src={img2}
                                    alt={`${project.name} preview 2`}
                                    loading="lazy"
                                    className="w-full object-cover rounded-[24px] sm:rounded-[40px] md:rounded-[52px]"
                                    style={{
                                        height: "clamp(140px, 22vw, 320px)",
                                    }}
                                    draggable={false}
                                />
                            )}
                        </div>
                        <div className="col-span-3 relative group">
                            {img3 && (
                                <img
                                    src={img3}
                                    alt={`${project.name} hero`}
                                    loading="lazy"
                                    className="w-full h-full object-cover rounded-[24px] sm:rounded-[40px] md:rounded-[52px]"
                                    style={{
                                        minHeight:
                                            "clamp(260px, 40vw, 580px)",
                                    }}
                                    draggable={false}
                                />
                            )}
                            <div className="hidden sm:flex absolute top-4 right-4 h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#0C0C0C]/70 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const ProjectsSection = () => {
    const containerRef = useRef(null);
    const [projects, setProjects] = useState(FALLBACK);

    useEffect(() => {
        let cancelled = false;
        getProjects()
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                }
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const total = projects.length;

    return (
        <section
            id="projects"
            data-testid="projects-section"
            ref={containerRef}
            className="w-full relative -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-4 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-16 z-10"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
                    <FadeIn y={20}>
                        <span
                            className="uppercase tracking-[0.4em] font-light text-[#D7E2EA]/60"
                            style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)" }}
                        >
                            Selected work
                        </span>
                    </FadeIn>
                    <FadeIn y={40} delay={0.05}>
                        <h2
                            data-testid="projects-heading"
                            className="hero-heading font-black uppercase leading-none tracking-tight"
                            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
                        >
                            Projects
                        </h2>
                    </FadeIn>
                </div>

                <div>
                    {projects.map((p, i) => {
                        const rangeStart = i / total;
                        const rangeEnd = 1;
                        const targetScale = 1 - (total - 1 - i) * 0.03;
                        return (
                            <div
                                key={p.id || p.number}
                                className="min-h-[60vh] sm:min-h-[75vh] md:min-h-[85vh] flex items-start"
                            >
                                <ProjectCard
                                    project={p}
                                    index={i}
                                    progress={scrollYProgress}
                                    range={[rangeStart, rangeEnd]}
                                    targetScale={targetScale}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;
