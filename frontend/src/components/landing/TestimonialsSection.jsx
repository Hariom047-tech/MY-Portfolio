import React from "react";
import { Star, Quote } from "lucide-react";
import { FadeIn } from "./FadeIn";

const TESTIMONIALS = [
    {
        name: "Rahul Sharma",
        role: "Founder, EduSpark Academy",
        rating: 5,
        text: "Our school management system completely transformed how we handle admissions, fees and attendance. Delivered on time and the admin dashboard is incredibly easy to use.",
    },
    {
        name: "Priya Verma",
        role: "Owner, StyleRent",
        rating: 5,
        text: "The rental clothes app exceeded our expectations. Vendor management and bookings work flawlessly. Our customers love the smooth experience on both Android and iOS.",
    },
    {
        name: "Amit Patel",
        role: "Director, GrowthLeads",
        rating: 5,
        text: "The AI calling agent and WhatsApp automation now handle our entire lead follow-up. We've saved hours every day and our conversion rate jumped significantly.",
    },
    {
        name: "Neha Gupta",
        role: "CEO, Bloom Boutique",
        rating: 5,
        text: "A beautiful, fast website that actually brings in customers. Communication was clear throughout and the SEO results have been fantastic.",
    },
    {
        name: "Vikram Singh",
        role: "Co-founder, FinTrack",
        rating: 5,
        text: "The CRM automation integrated perfectly with our Google Sheets and Twilio. Truly a full-stack expert who understands business needs, not just code.",
    },
    {
        name: "Sneha Reddy",
        role: "Manager, CareClinic",
        rating: 5,
        text: "Professional, responsive and genuinely talented. Our analytics dashboard gives us real-time insights we never had before. Highly recommended!",
    },
];

// Brand gradients cycled across the client initials avatars.
const AVATAR_GRADIENTS = [
    "linear-gradient(135deg, #B600A8 0%, #7621B0 100%)",
    "linear-gradient(135deg, #7621B0 0%, #BE4C00 100%)",
    "linear-gradient(135deg, #BE4C00 0%, #B600A8 100%)",
];

const getInitials = (name) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();

const Stars = ({ count }) => (
    <div className="flex gap-1">
        {Array.from({ length: count }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[#BE4C00] text-[#BE4C00]" />
        ))}
    </div>
);

export const TestimonialsSection = () => {
    return (
        <section
            id="testimonials"
            data-testid="testimonials-section"
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
                            Testimonials
                        </span>
                    </FadeIn>
                    <FadeIn y={40} delay={0.05}>
                        <h2
                            data-testid="testimonials-heading"
                            className="hero-heading font-black uppercase leading-none tracking-tight"
                            style={{ fontSize: "clamp(2.5rem, 9vw, 120px)" }}
                        >
                            Client Love
                        </h2>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <FadeIn key={t.name} y={40} delay={(i % 3) * 0.08} className="h-full">
                            <div
                                data-testid={`testimonial-${i}`}
                                className="glass glass-hover h-full rounded-[28px] p-6 sm:p-8 flex flex-col gap-5"
                            >
                                <div className="flex items-center justify-between">
                                    <Stars count={t.rating} />
                                    <Quote className="h-7 w-7 text-[#D7E2EA]/15" />
                                </div>
                                <p className="text-[#D7E2EA]/80 font-light leading-relaxed text-sm sm:text-base flex-1">
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div className="flex items-center gap-3 pt-2 border-t border-[#D7E2EA]/10">
                                    <span
                                        aria-hidden="true"
                                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-white font-bold text-sm border border-white/15"
                                        style={{
                                            background:
                                                AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                                        }}
                                    >
                                        {getInitials(t.name)}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-[#D7E2EA] font-medium text-sm sm:text-base">
                                            {t.name}
                                        </span>
                                        <span className="text-[#D7E2EA]/50 text-xs sm:text-sm">
                                            {t.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
