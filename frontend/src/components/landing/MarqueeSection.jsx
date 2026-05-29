import React, { useEffect, useRef, useState } from "react";

const ALL_IMAGES = [
    "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
    "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
    "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
    "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
    "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
    "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
    "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
    "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
    "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
    "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
    "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
    "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
    "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
    "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
    "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
    "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
    "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
    "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
    "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const ROW_1 = ALL_IMAGES.slice(0, 11);
const ROW_2 = ALL_IMAGES.slice(11);

const triple = (arr) => [...arr, ...arr, ...arr];

const Tile = ({ src, idx }) => (
    <img
        data-testid={`marquee-tile-${idx}`}
        src={src}
        alt=""
        loading="lazy"
        className="rounded-2xl object-cover flex-shrink-0"
        style={{ width: 420, height: 270 }}
        draggable={false}
    />
);

export const MarqueeSection = () => {
    const sectionRef = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const el = sectionRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            const raw =
                (window.scrollY - sectionTop + window.innerHeight) * 0.3;
            setOffset(raw);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const row1Tiles = triple(ROW_1);
    const row2Tiles = triple(ROW_2);

    return (
        <section
            ref={sectionRef}
            data-testid="marquee-section"
            className="w-full pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
            style={{ backgroundColor: "#0C0C0C" }}
        >
            <div className="flex flex-col gap-3">
                {/* Row 1 - moves right */}
                <div className="w-full overflow-hidden">
                    <div
                        data-testid="marquee-row-1"
                        className="flex gap-3"
                        style={{
                            transform: `translateX(${offset - 200}px)`,
                            willChange: "transform",
                        }}
                    >
                        {row1Tiles.map((src, i) => (
                            <Tile key={`r1-${i}`} src={src} idx={`r1-${i}`} />
                        ))}
                    </div>
                </div>

                {/* Row 2 - moves left */}
                <div className="w-full overflow-hidden">
                    <div
                        data-testid="marquee-row-2"
                        className="flex gap-3"
                        style={{
                            transform: `translateX(${-(offset - 200)}px)`,
                            willChange: "transform",
                        }}
                    >
                        {row2Tiles.map((src, i) => (
                            <Tile key={`r2-${i}`} src={src} idx={`r2-${i}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MarqueeSection;
