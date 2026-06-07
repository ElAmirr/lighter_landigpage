"use client";

import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "AI Studio", href: "#studio" },
    { label: "Leaderboard", href: "#" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <>
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
                style={{
                    background: scrolled ? "rgba(15,16,20,0.94)" : "transparent",
                    backdropFilter: scrolled ? "blur(20px)" : "none",
                    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
                }}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Logo */}
                <a
                    href="/"
                    className="text-2xl font-black tracking-tighter transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                        background: "linear-gradient(135deg, #FFD60A 0%, #FF7A00 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    DAVAY
                </a>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            className="text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200"
                        >
                            {label}
                        </a>
                    ))}
                </div>

                {/* CTA + Mobile menu */}
                <div className="flex items-center gap-3">
                    <a
                        href="#"
                        className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-black text-sm transition-all duration-200 active:scale-95 hover:brightness-110"
                        style={{ background: "linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)" }}
                    >
                        <Download size={14} />
                        Download
                    </a>
                    <button
                        className="md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={18} color="white" /> : <Menu size={18} color="white" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 flex flex-col pt-20 px-6 pb-8"
                        style={{
                            background: "rgba(10,10,14,0.97)",
                            backdropFilter: "blur(30px)",
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="flex flex-col gap-2">
                            {NAV_LINKS.map(({ label, href }, idx) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-2xl font-black text-white/80 hover:text-white py-3 border-b transition-colors"
                                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.07 }}
                                >
                                    {label}
                                </motion.a>
                            ))}
                        </div>
                        <div className="mt-auto">
                            <a
                                href="#"
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-black text-black text-lg transition-all duration-200 active:scale-95"
                                style={{ background: "linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)" }}
                            >
                                <Download size={18} />
                                Download the App
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
