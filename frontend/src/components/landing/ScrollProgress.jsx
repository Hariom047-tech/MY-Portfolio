import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            data-testid="scroll-progress"
            style={{ scaleX }}
            className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left"
        >
            <div
                className="h-full w-full"
                style={{
                    background:
                        "linear-gradient(90deg, #B600A8 0%, #7621B0 50%, #BE4C00 100%)",
                }}
            />
        </motion.div>
    );
};

export default ScrollProgress;
