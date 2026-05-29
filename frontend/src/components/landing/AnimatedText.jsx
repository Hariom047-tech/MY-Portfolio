import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Char = ({ char, progress, range }) => {
    const opacity = useTransform(progress, range, [0.2, 1]);
    return (
        <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ visibility: "hidden" }}>{char}</span>
            <motion.span
                style={{
                    opacity,
                    position: "absolute",
                    left: 0,
                    top: 0,
                }}
            >
                {char}
            </motion.span>
        </span>
    );
};

export const AnimatedText = ({
    text,
    className = "",
    style = {},
    ...rest
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.8", "end 0.2"],
    });

    const characters = Array.from(text);
    const total = characters.length;

    return (
        <p ref={ref} className={className} style={style} {...rest}>
            {characters.map((char, i) => {
                const start = i / total;
                const end = start + 1 / total;
                if (char === " ") {
                    return (
                        <span key={i} style={{ display: "inline-block", width: "0.25em" }}>
                            {" "}
                        </span>
                    );
                }
                return (
                    <Char
                        key={i}
                        char={char}
                        progress={scrollYProgress}
                        range={[start, end]}
                    />
                );
            })}
        </p>
    );
};

export default AnimatedText;
