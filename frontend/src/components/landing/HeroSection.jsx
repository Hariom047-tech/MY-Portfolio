import React from "react";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";
import { RotatingPortrait } from "./RotatingPortrait";
import { scrollToId } from "@/lib/config";
import { useSettings } from "@/lib/SettingsContext";

const PORTRAIT = "/hero-portrait.png";

export const HeroSection = () => {
    const { settings } = useSettings();
    const handleContact = () => scrollToId("contact");

    return (
        <section
            id="home"
            data-testid="hero-section"
            className="relative h-screen w-full flex flex-col"
            style={{ overflowX: "clip", backgroundColor: "#0C0C0C" }}
        >
            {/* Background glow */}
            <div className="absolute inset-0 page-glow pointer-events-none" />

            {/* Hero heading + portrait */}
            <div className="relative z-10 flex-1 flex flex-col justify-between pt-24 sm:pt-24 md:pt-20">
                <div className="w-full overflow-hidden px-4 mt-6 sm:mt-4 md:-mt-2">
                    <FadeIn delay={0.15} y={40}>
                        <h1
                            data-testid="hero-heading"
                            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center"
                            style={{ fontSize: "clamp(2rem, 11.5vw, 13rem)" }}
                        >
                            Hi, i&apos;m {settings.brandShort || "AI Wallah"}
                        </h1>
                    </FadeIn>
                </div>

                {/* Portrait with 360° drag rotation */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[min(94vw,320px)] sm:w-[400px] md:w-[520px] lg:w-[640px] xl:w-[720px] 2xl:w-[800px] max-h-[58vh] sm:max-h-[78vh] lg:max-h-[85vh] pb-6 sm:pb-8 pointer-events-auto flex items-end justify-center">
                    <FadeIn delay={0.6} y={30} className="w-full">
                        <RotatingPortrait
                            dataTestId="hero-portrait"
                            src={PORTRAIT}
                            alt={`${settings.brandName || "Developer"} portrait`}
                        />
                    </FadeIn>
                </div>

                {/* Bottom bar: tagline + CTA */}
                <div className="relative z-20 flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
                    <FadeIn delay={0.35} y={20}>
                        <p
                            data-testid="hero-tagline"
                            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[180px] sm:max-w-[260px] md:max-w-[340px]"
                            style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.4rem)" }}
                        >
                            A {settings.role || "Full Stack Developer"} building modern
                            websites, mobile apps &amp; AI automation systems
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.5} y={20}>
                        <ContactButton onClick={handleContact} dataTestId="hero-contact-btn" />
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
