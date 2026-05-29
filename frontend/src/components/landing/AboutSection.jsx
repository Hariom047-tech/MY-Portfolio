import React from "react";
import { motion } from "framer-motion";
import { Rocket, ShieldCheck, Clock, Headphones } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { AnimatedText } from "./AnimatedText";
import { ContactButton } from "./ContactButton";
import { scrollToId } from "@/lib/config";

const ABOUT_TEXT =
    "I am a Full Stack Developer specializing in web applications, mobile app development, AI automation systems, CRM platforms and business workflow automation. I help businesses automate operations and grow digitally with modern technology solutions.";

const HIGHLIGHTS = [
    { Icon: Rocket, title: "Modern Tech", text: "Latest frameworks & best practices" },
    { Icon: ShieldCheck, title: "Reliable Code", text: "Clean, secure & scalable systems" },
    { Icon: Clock, title: "Fast Delivery", text: "On-time, every time" },
    { Icon: Headphones, title: "Real Support", text: "Direct communication & care" },
];

export const AboutSection = () => {
    return (
        <section
            id="about"
            data-testid="about-section"
            className="relative w-full px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 overflow-hidden"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="absolute inset-0 page-glow pointer-events-none opacity-60" />

            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: text */}
                <div className="flex flex-col gap-7 sm:gap-9">
                    <FadeIn y={20}>
                        <span
                            className="uppercase tracking-[0.4em] font-light text-[#D7E2EA]/60"
                            style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)" }}
                        >
                            About me
                        </span>
                    </FadeIn>
                    <FadeIn y={40} delay={0.05}>
                        <h2
                            data-testid="about-heading"
                            className="hero-heading font-black uppercase leading-none tracking-tight"
                            style={{ fontSize: "clamp(2.5rem, 8vw, 110px)" }}
                        >
                            Who I am
                        </h2>
                    </FadeIn>
                    <AnimatedText
                        data-testid="about-paragraph"
                        text={ABOUT_TEXT}
                        className="font-medium leading-relaxed max-w-xl"
                        style={{
                            color: "#D7E2EA",
                            fontSize: "clamp(1rem, 1.7vw, 1.3rem)",
                        }}
                    />
                    <FadeIn y={20} delay={0.1}>
                        <ContactButton
                            onClick={() => scrollToId("contact")}
                            label="Work With Me"
                            dataTestId="about-contact-btn"
                        />
                    </FadeIn>
                </div>

                {/* Right: highlight grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                    {HIGHLIGHTS.map((h, i) => (
                        <FadeIn key={h.title} y={30} delay={i * 0.08}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="glass rounded-3xl p-5 sm:p-7 h-full flex flex-col gap-3"
                            >
                                <span
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                                    style={{
                                        background:
                                            "linear-gradient(140deg, #B600A8 0%, #7621B0 55%, #BE4C00 100%)",
                                    }}
                                >
                                    <h.Icon className="h-6 w-6" />
                                </span>
                                <h3 className="text-[#D7E2EA] font-semibold text-base sm:text-lg">
                                    {h.title}
                                </h3>
                                <p className="text-[#D7E2EA]/60 text-sm font-light leading-relaxed">
                                    {h.text}
                                </p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
