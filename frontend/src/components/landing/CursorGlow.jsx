import React, { useEffect, useRef, useState } from "react";

export const CursorGlow = () => {
    const ref = useRef(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // Only enable on devices with a fine pointer (mouse).
        const mq = window.matchMedia("(pointer: fine)");
        setEnabled(mq.matches);
        if (!mq.matches) return;

        let raf = 0;
        const move = (e) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                if (ref.current) {
                    ref.current.style.transform = `translate3d(${e.clientX - 250}px, ${
                        e.clientY - 250
                    }px, 0)`;
                }
            });
        };
        window.addEventListener("mousemove", move, { passive: true });
        return () => {
            window.removeEventListener("mousemove", move);
            cancelAnimationFrame(raf);
        };
    }, []);

    if (!enabled) return null;

    return (
        <div
            ref={ref}
            data-testid="cursor-glow"
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[5] h-[500px] w-[500px] rounded-full"
            style={{
                background:
                    "radial-gradient(circle, rgba(182,0,168,0.12) 0%, rgba(118,33,176,0.08) 35%, transparent 70%)",
                willChange: "transform",
            }}
        />
    );
};

export default CursorGlow;
