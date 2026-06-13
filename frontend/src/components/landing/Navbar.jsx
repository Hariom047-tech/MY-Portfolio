import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, scrollToId } from "@/lib/config";
import { useSettings } from "@/lib/SettingsContext";

export const Navbar = () => {
    const { settings, wa } = useSettings();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleNav = (target) => {
        setOpen(false);
        if (target === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            scrollToId(target);
        }
    };

    return (
        <motion.header
            data-testid="navbar"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div
                className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-300 ${
                    scrolled ? "mt-2 sm:mt-3" : "mt-3 sm:mt-5"
                }`}
            >
                <nav
                    className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 ${
                        scrolled ? "glass shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]" : "bg-transparent"
                    }`}
                >
                    <button
                        data-testid="navbar-brand"
                        onClick={() => handleNav("home")}
                        className="flex items-center gap-2 text-[#D7E2EA] font-bold tracking-tight text-base sm:text-lg"
                    >
                        <img
                            src="/logo.png"
                            alt={`${settings.brandName} logo`}
                            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-white/10"
                            draggable={false}
                        />
                        <span className="hidden sm:inline">{settings.brandShort}</span>
                    </button>

                    <div className="hidden lg:flex items-center gap-6 xl:gap-9">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.target}
                                data-testid={`nav-link-${link.target}`}
                                onClick={() => handleNav(link.target)}
                                className="text-[#D7E2EA]/80 hover:text-white text-sm uppercase tracking-wider transition-colors duration-200 whitespace-nowrap"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={wa()}
                            target="_blank"
                            rel="noreferrer"
                            data-testid="navbar-cta"
                            className="hidden sm:inline-flex rounded-full text-white text-xs sm:text-sm font-medium uppercase tracking-widest px-5 py-2.5 transition-transform duration-300 hover:scale-[1.04]"
                            style={{
                                background:
                                    "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                                outline: "2px solid #ffffff",
                                outlineOffset: "-3px",
                            }}
                        >
                            Hire Me
                        </a>
                        <button
                            data-testid="navbar-menu-toggle"
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Toggle menu"
                            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full glass text-[#D7E2EA]"
                        >
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </nav>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="lg:hidden mt-2 rounded-3xl glass p-4 flex flex-col gap-1"
                        >
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.target}
                                    onClick={() => handleNav(link.target)}
                                    className="text-left text-[#D7E2EA]/85 hover:text-white text-base uppercase tracking-wider py-3 px-2 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <a
                                href={wa()}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpen(false)}
                                className="mt-2 text-center rounded-full text-white text-sm font-medium uppercase tracking-widest px-5 py-3"
                                style={{
                                    background:
                                        "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                                }}
                            >
                                Contact on WhatsApp
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default Navbar;
