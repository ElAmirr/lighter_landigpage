"use client";

import { motion } from "framer-motion";
import { Search, QrCode, Shield } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Find",
        subtitle: "Hit the Streets",
        description:
            "Locate a physical DAVAY lighter dropped by players or seeded in your city. Every lighter has a unique QR code. The hunt is part of the game.",
        color: "#FFD60A",
        tags: ["Real-World Hunt", "GPS Tracking", "City Drops"],
    },
    {
        number: "02",
        icon: QrCode,
        title: "Scan",
        subtitle: "Claim Your Territory",
        description:
            "Capture the QR code with the DAVAY app. Instantly log its current location, add your tag, and register as the current owner on the global leaderboard.",
        color: "#FF9500",
        tags: ["Instant Claim", "Location Log", "Ownership NFT"],
    },
    {
        number: "03",
        icon: Shield,
        title: "Survive",
        subtitle: "Defend Your Rank",
        description:
            "Defend your lighters from rival players or go on the offensive — steal from others to earn XP, rare achievements, and climb the national leaderboard.",
        color: "#FF7A00",
        tags: ["Earn XP", "Rare Drops", "Leaderboard"],
    },
];

export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative py-24 lg:py-32 overflow-hidden"
            style={{ background: "#0F1014" }}
        >
            {/* Background decoration */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #FFD60A 0%, transparent 70%)" }}
            />

            <div className="relative z-10 container mx-auto px-6">
                {/* Section header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div
                        className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
                    >
                        <span className="text-sm font-bold gradient-text">HOW IT WORKS</span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                        Three Moves.
                        <br />
                        <span className="gradient-text">Infinite Game.</span>
                    </h2>
                    <p className="text-white/50 text-lg mt-4 max-w-md mx-auto">
                        No controllers. No screens. Just the streets, your phone, and your instincts.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.number}
                            className="relative group"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                        >
                            {/* Connector line (between cards) */}
                            {idx < 2 && (
                                <div
                                    className="hidden md:block absolute top-12 left-full w-full h-px z-10 -translate-x-1/2"
                                    style={{
                                        background: `linear-gradient(90deg, ${step.color}60, transparent)`,
                                        width: "calc(50% + 2rem)",
                                    }}
                                />
                            )}

                            {/* Card */}
                            <div
                                className="relative h-full rounded-3xl p-8 transition-all duration-300 group-hover:scale-[1.02] glass"
                                style={{
                                    background: "rgba(27,27,31,0.8)",
                                    border: `1px solid rgba(255,255,255,0.07)`,
                                    boxShadow: `0 0 0 0 ${step.color}00`,
                                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 0 30px ${step.color}25, inset 0 0 30px ${step.color}08`;
                                    e.currentTarget.style.border = `1px solid ${step.color}40`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                                }}
                            >
                                {/* Step number */}
                                <div
                                    className="text-7xl font-black opacity-10 absolute top-4 right-6 leading-none select-none"
                                    style={{ color: step.color }}
                                >
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                    style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}
                                >
                                    <step.icon size={24} color={step.color} strokeWidth={2.5} />
                                </div>

                                {/* Title */}
                                <div className="mb-1">
                                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: step.color }}>
                                        {step.subtitle}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4">{step.title}</h3>

                                {/* Description */}
                                <p className="text-white/55 leading-relaxed text-sm mb-6">{step.description}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {step.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-bold px-3 py-1 rounded-full"
                                            style={{
                                                background: `${step.color}14`,
                                                color: step.color,
                                                border: `1px solid ${step.color}25`,
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <button
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black text-black text-lg transition-all duration-200 active:scale-95 glow-yellow hover:brightness-110"
                        style={{ background: "linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)" }}
                    >
                        Start Playing Now — It's Free
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
