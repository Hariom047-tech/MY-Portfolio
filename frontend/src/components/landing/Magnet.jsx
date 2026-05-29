import React, { useEffect, useRef, useState } from "react";

export const Magnet = ({
    children,
    padding = 150,
    strength = 3,
    activeTransition = "transform 0.3s ease-out",
    inactiveTransition = "transform 0.6s ease-in-out",
    className = "",
    style = {},
}) => {
    const ref = useRef(null);
    const [transform, setTransform] = useState("translate3d(0px, 0px, 0)");
    const [active, setActive] = useState(false);

    useEffect(() => {
        const handleMove = (e) => {
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const insideX =
                e.clientX >= rect.left - padding &&
                e.clientX <= rect.right + padding;
            const insideY =
                e.clientY >= rect.top - padding &&
                e.clientY <= rect.bottom + padding;

            if (insideX && insideY) {
                setActive(true);
                setTransform(
                    `translate3d(${dx / strength}px, ${dy / strength}px, 0)`
                );
            } else {
                setActive(false);
                setTransform("translate3d(0px, 0px, 0)");
            }
        };

        window.addEventListener("mousemove", handleMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMove);
    }, [padding, strength]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                transform,
                transition: active ? activeTransition : inactiveTransition,
                willChange: "transform",
            }}
        >
            {children}
        </div>
    );
};

export default Magnet;
