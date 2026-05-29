import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export const Counter = ({ to = 0, suffix = "", duration = 1600 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let raf = 0;
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * to));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, to, duration]);

    return (
        <span ref={ref}>
            {value}
            {suffix}
        </span>
    );
};

export default Counter;
