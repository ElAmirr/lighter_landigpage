"use client";

import { motion } from "framer-motion";
import { MessageCircle, Camera, Play } from "lucide-react";

const NAV_LINKS = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "AI Studio", href: "#studio" },
    { label: "Leaderboard", href: "#" },
    { label: "Blog", href: "#" },
];

const SOCIAL_LINKS = [
    { icon: MessageCircle, href: "#", label: "Twitter/X" },
    { icon: Camera, href: "#", label: "Instagram" },
    { icon: Play, href: "#", label: "YouTube" },
];

const LEGAL_LINKS = [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
];

export default function Footer() {
    return (
        <footer
            className="relative py-16 overflow-hidden"
            style={{ background: "#0A0A0E", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
            {/* Subtle glow */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 opacity-20 blur-3xl pointer-events-none"
                style={{ background: "linear-gradient(90deg, #FFD60A, #FF7A00)" }}
            />

            <div className="relative z-10 container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Logo */}
                        <div className="mb-4">
                            <span
                                className="text-4xl font-black tracking-tighter"
                                style={{
                                    background: "linear-gradient(135deg, #FFD60A 0%, #FF7A00 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                DAVAY
                            </span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                            The ultimate real-world collectible game. Find. Scan. Survive. The streets are your arena.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3 mt-6">
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 hover:scale-110"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(255,214,10,0.4)";
                                        e.currentTarget.style.background = "rgba(255,214,10,0.08)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                    }}
                                >
                                    <Icon size={16} color="rgba(255,255,255,0.6)" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="text-xs font-black tracking-widest text-white/30 uppercase mb-5">Game</h4>
                        <ul className="space-y-3">
                            {NAV_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="text-white/50 text-sm font-medium hover:text-white transition-colors duration-200"
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Download CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="text-xs font-black tracking-widest text-white/30 uppercase mb-5">Get In The Game</h4>
                        <p className="text-white/40 text-sm mb-5">Download the app and find your first lighter.</p>
                        <div className="flex flex-col gap-3">
                            <a
                                href="#"
                                className="flex items-center gap-3 rounded-2xl px-5 py-3 font-bold text-sm transition-all duration-200 active:scale-95 hover:brightness-110"
                                style={{
                                    background: "linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)",
                                    color: "#000",
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                App Store
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-3 rounded-2xl px-5 py-3 font-bold text-sm transition-all duration-200 active:scale-95"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    color: "rgba(255,255,255,0.7)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.18 23.76a2.5 2.5 0 0 0 2.64-.25l12.5-6.67-2.81-2.81zm16.64-11.05L16.7 10.2l-3.07 3.07 3.06 3.06 3.15-1.69a1.39 1.39 0 0 0 0-2.43zM2.34.25A1.38 1.38 0 0 0 2 1.1v21.8a1.38 1.38 0 0 0 .34.85l.12.12L14 12.24v-.29L2.46.13z" />
                                    <path d="M17.82 7.84L5.82.48A2.5 2.5 0 0 0 3.18.23L13.62 10.7z" />
                                </svg>
                                Google Play
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <p className="text-white/25 text-xs">
                        © 2026 DAVAY. All rights reserved. The streets are watching.
                    </p>
                    <div className="flex gap-6">
                        {LEGAL_LINKS.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="text-white/25 text-xs hover:text-white/50 transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
