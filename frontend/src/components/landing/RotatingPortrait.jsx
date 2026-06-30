import React, { useCallback, useEffect, useRef, useState } from "react";

const DRAG_SENSITIVITY = 0.4;
const INERTIA_FRICTION = 0.92;
const MIN_VELOCITY = 0.05;

export const RotatingPortrait = ({ src, alt, className = "", dataTestId }) => {
    const containerRef = useRef(null);
    const rotationRef = useRef(0);
    const velocityRef = useRef(0);
    const isDraggingRef = useRef(false);
    const lastPointerXRef = useRef(0);
    const rafRef = useRef(null);

    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const applyRotation = useCallback((deg) => {
        rotationRef.current = deg;
        setRotation(deg);
    }, []);

    const stopInertia = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    const startInertia = useCallback(() => {
        stopInertia();

        const tick = () => {
            if (isDraggingRef.current) return;

            velocityRef.current *= INERTIA_FRICTION;
            if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
                velocityRef.current = 0;
                rafRef.current = null;
                return;
            }

            applyRotation(rotationRef.current + velocityRef.current);
            rafRef.current = requestAnimationFrame(tick);
        };

        if (Math.abs(velocityRef.current) >= MIN_VELOCITY) {
            rafRef.current = requestAnimationFrame(tick);
        }
    }, [applyRotation, stopInertia]);

    const handlePointerDown = useCallback(
        (e) => {
            stopInertia();
            isDraggingRef.current = true;
            setIsDragging(true);
            lastPointerXRef.current = e.clientX;
            e.currentTarget.setPointerCapture(e.pointerId);
        },
        [stopInertia]
    );

    const handlePointerMove = useCallback(
        (e) => {
            if (!isDraggingRef.current) return;

            const deltaX = e.clientX - lastPointerXRef.current;
            lastPointerXRef.current = e.clientX;
            velocityRef.current = deltaX * DRAG_SENSITIVITY;
            applyRotation(rotationRef.current + velocityRef.current);
        },
        [applyRotation]
    );

    const handlePointerUp = useCallback(
        (e) => {
            if (!isDraggingRef.current) return;

            isDraggingRef.current = false;
            setIsDragging(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
            startInertia();
        },
        [startInertia]
    );

    useEffect(() => () => stopInertia(), [stopInertia]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full cursor-grab active:cursor-grabbing touch-none ${className}`}
            style={{ perspective: "1200px" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            data-testid={dataTestId}
            aria-label={`${alt} — drag to rotate 360°`}
        >
            <div
                className="relative w-full"
                style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${rotation}deg)`,
                    transition: isDragging ? "none" : "transform 0.15s ease-out",
                    willChange: "transform",
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto max-h-[58vh] sm:max-h-[78vh] lg:max-h-[85vh] object-contain object-bottom mx-auto block select-none pointer-events-none"
                    style={{ backfaceVisibility: "hidden" }}
                    draggable={false}
                />
                <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 w-full h-auto max-h-[58vh] sm:max-h-[78vh] lg:max-h-[85vh] object-contain object-bottom mx-auto block select-none pointer-events-none"
                    style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                    }}
                    draggable={false}
                />
            </div>
            <p
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-xs uppercase tracking-widest text-[#646973] opacity-70 pointer-events-none select-none"
                aria-hidden="true"
            >
                Drag to rotate
            </p>
        </div>
    );
};

export default RotatingPortrait;
