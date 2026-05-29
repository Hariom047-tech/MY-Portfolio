import React from "react";
import { FadeIn } from "./FadeIn";
import { Counter } from "./Counter";

const STATS = [
    { value: 20, suffix: "+", label: "Projects Completed" },
    { value: 100, suffix: "%", label: "Client Satisfaction" },
    { text: "Fast", label: "Delivery Time" },
    { text: "AI", label: "Automation Expert" },
];

export const StatsBar = () => {
    return (
        <section
            data-testid="stats-bar"
            className="relative w-full px-5 sm:px-8 md:px-10 pt-10 sm:pt-12"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                {STATS.map((stat, i) => (
                    <FadeIn key={stat.label} y={30} delay={i * 0.08}>
                        <div
                            data-testid={`stat-${stat.label}`}
                            className="glass glass-hover rounded-3xl px-4 py-6 sm:py-7 flex flex-col items-center gap-1.5 h-full"
                        >
                            <span
                                className="gradient-text font-black leading-none"
                                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                            >
                                {typeof stat.value === "number" ? (
                                    <Counter to={stat.value} suffix={stat.suffix} />
                                ) : (
                                    stat.text
                                )}
                            </span>
                            <span className="text-[#D7E2EA]/60 text-xs sm:text-sm uppercase tracking-wider text-center">
                                {stat.label}
                            </span>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
};

export default StatsBar;
