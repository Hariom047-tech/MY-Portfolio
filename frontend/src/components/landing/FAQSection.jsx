import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { FadeIn } from "./FadeIn";

const FAQS = [
    {
        q: "What services do you offer?",
        a: "I offer full-stack web development, mobile app development (Flutter, Android & iOS), business automation, AI agents & agentic workflows, and CRM/dashboard systems — everything to take your business digital and automate it.",
    },
    {
        q: "How long does a project take?",
        a: "A starter website typically takes 5–10 days, business websites 2–3 weeks, mobile apps 4–6 weeks, and AI automation systems 2–4 weeks depending on complexity. You'll always get a clear timeline before we start.",
    },
    {
        q: "What is your pricing model?",
        a: "I work on transparent, project-based pricing (in INR). Pick a plan that fits your needs, or request a custom quote for enterprise solutions. Every plan is fully customizable to your requirements.",
    },
    {
        q: "Do you provide support after launch?",
        a: "Yes. Every project includes a support period after launch, and I offer ongoing maintenance and feature plans so your software keeps running smoothly as your business grows.",
    },
    {
        q: "Can you automate my existing business workflows?",
        a: "Absolutely. I build WhatsApp automation, CRM automation, AI calling agents, n8n workflows, Twilio and Google Sheets integrations that connect to your existing tools and save your team hours every day.",
    },
    {
        q: "How do we get started?",
        a: "Just message me on WhatsApp or fill out the contact form with a few details about your project. I'll reply within 24 hours with next steps and a clear plan.",
    },
];

const Item = ({ faq, isOpen, onToggle, index }) => {
    return (
        <FadeIn y={20} delay={index * 0.05}>
            <div
                data-testid={`faq-item-${index}`}
                className="glass rounded-2xl sm:rounded-3xl overflow-hidden"
            >
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-7 py-5 sm:py-6"
                >
                    <span className="text-[#D7E2EA] font-medium text-base sm:text-lg">
                        {faq.q}
                    </span>
                    <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B600A8] to-[#BE4C00] text-white"
                    >
                        <Plus className="h-4 w-4" />
                    </motion.span>
                </button>
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            <p className="px-5 sm:px-7 pb-5 sm:pb-6 text-[#D7E2EA]/65 font-light leading-relaxed text-sm sm:text-base">
                                {faq.a}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </FadeIn>
    );
};

export const FAQSection = () => {
    const [open, setOpen] = useState(0);

    return (
        <section
            id="faq"
            data-testid="faq-section"
            className="relative w-full px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mb-12 sm:mb-16">
                    <FadeIn y={20}>
                        <span
                            className="uppercase tracking-[0.4em] font-light text-[#D7E2EA]/60"
                            style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)" }}
                        >
                            FAQ
                        </span>
                    </FadeIn>
                    <FadeIn y={40} delay={0.05}>
                        <h2
                            data-testid="faq-heading"
                            className="hero-heading font-black uppercase leading-none tracking-tight"
                            style={{ fontSize: "clamp(2.5rem, 9vw, 120px)" }}
                        >
                            Questions
                        </h2>
                    </FadeIn>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4">
                    {FAQS.map((faq, i) => (
                        <Item
                            key={faq.q}
                            faq={faq}
                            index={i}
                            isOpen={open === i}
                            onToggle={() => setOpen(open === i ? -1 : i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
