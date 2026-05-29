import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/config";

export const Preloader = () => {
    const [done, setDone] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDone(true), 1400);
        return () => clearTimeout(t);
    }, []);

    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    data-testid="preloader"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
                    style={{ backgroundColor: "#0C0C0C" }}
                >
                    <div className="page-glow absolute inset-0 pointer-events-none" />
                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative flex flex-col items-center gap-6"
                    >
                        <div className="relative flex h-20 w-20 items-center justify-center">
                            <span className="absolute inset-0 rounded-full border-2 border-[#D7E2EA]/10" />
                            <span
                                className="absolute inset-0 rounded-full border-2 border-transparent animate-spin-slow"
                                style={{ borderTopColor: "#B600A8", borderRightColor: "#BE4C00" }}
                            />
                            <span className="text-2xl font-black text-white">H</span>
                        </div>
                        <span className="gradient-text font-bold uppercase tracking-[0.3em] text-sm">
                            {SITE.brandName}
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
