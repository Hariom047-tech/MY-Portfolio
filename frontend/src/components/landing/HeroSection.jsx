import React from "react";
import { FadeIn } from "./FadeIn";
import { Magnet } from "./Magnet";
import { ContactButton } from "./ContactButton";
import { scrollToId } from "@/lib/config";
import { useSettings } from "@/lib/SettingsContext";

const PORTRAIT =
    "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png";

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

                {/* Portrait with magnetic hover */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px] pointer-events-none">
                    <Magnet
                        padding={150}
                        strength={3}
                        activeTransition="transform 0.3s ease-out"
                        inactiveTransition="transform 0.6s ease-in-out"
                        className="w-full"
                    >
                        <FadeIn delay={0.6} y={30}>
                            <img
                                data-testid="hero-portrait"
                                src={PORTRAIT}
                                alt={`${settings.brandName || "Developer"} portrait`}
                                className="w-full h-auto block select-none"
                                draggable={false}
                            />
                        </FadeIn>
                    </Magnet>
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
