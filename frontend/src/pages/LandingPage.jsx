import React from "react";
import { Preloader } from "@/components/landing/Preloader";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { Navbar } from "@/components/landing/Navbar";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { MarqueeSection } from "@/components/landing/MarqueeSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SkillsSection } from "@/components/landing/SkillsSection";
import { ProjectsSection } from "@/components/landing/ProjectsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";

export const LandingPage = () => {
    return (
        <>
            <Preloader />
            <ScrollProgress />
            <CursorGlow />
            <Navbar />
            <WhatsAppButton />

            <main>
                <HeroSection />
                <StatsBar />
                <MarqueeSection />
                <ServicesSection />
                <SkillsSection />
                <ProjectsSection />
                <PricingSection />
                <AboutSection />
                <TestimonialsSection />
                <FAQSection />
                <ContactSection />
            </main>
        </>
    );
};

export default LandingPage;
