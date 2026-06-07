"use client";

import { motion } from "framer-motion";
import { Download, MapPin, Flame } from "lucide-react";

const LighterVisual = () => (
    <div className="relative flex items-center justify-center w-full h-full min-h-[400px]">
        {/* Glow blob behind */}
        <div
            className="absolute w-64 h-64 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #FFD60A 0%, #FF7A00 60%, transparent 100%)" }}
        />

        {/* Lighter SVG */}
        <motion.div
            className="relative z-10 animate-float"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="relative">
                {/* Glow ring */}
                <div
                    className="absolute inset-0 rounded-2xl blur-2xl animate-pulse-glow"
                    style={{ background: "rgba(255,214,10,0.35)", transform: "scale(1.2)" }}
                />
                {/* Lighter body */}
                <img src="./heroimg1.png" alt="" />
                <img src="./heroimg2.png" alt="" />
            </div>
        </motion.div>

        {/* iPhone mockup */}
        <motion.div
            className="relative z-10 ml-[-20px] mt-16 glass rounded-3xl overflow-hidden"
            style={{ width: 130, height: 260, border: "1.5px solid rgba(255,255,255,0.12)" }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
            {/* Phone header */}
            <div className="flex items-center justify-between px-3 py-2" style={{ background: "#1B1B1F" }}>
                <span className="text-xs font-bold" style={{ color: "#FFD60A" }}>DAVAY</span>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-400" />
                    <div className="w-1 h-1 rounded-full bg-yellow-400" />
                </div>
            </div>
            {/* Leaderboard rows */}
            {[
                { rank: 1, name: "KARIM_DZ", score: "9,420", color: "#FFD60A" },
                { rank: 2, name: "STREET_K", score: "7,100", color: "#C0C0C0" },
                { rank: 3, name: "AYA.TN", score: "5,830", color: "#CD7F32" },
                { rank: 4, name: "ROGUE_X", score: "4,210", color: "rgba(255,255,255,0.4)" },
                { rank: 5, name: "FLSH_MOB", score: "3,990", color: "rgba(255,255,255,0.4)" },
            ].map((item) => (
                <div
                    key={item.rank}
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                    <span className="text-xs font-black w-4" style={{ color: item.color }}>
                        {item.rank}
                    </span>
                    <span className="text-xs font-semibold flex-1 truncate" style={{ color: "rgba(255,255,255,0.85)", fontSize: 9 }}>
                        {item.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: item.color, fontSize: 9 }}>
                        {item.score}
                    </span>
                </div>
            ))}
            {/* Map mini */}
            <div
                className="mx-2 my-2 rounded-lg overflow-hidden flex items-center justify-center gap-1"
                style={{ background: "rgba(255,214,10,0.08)", height: 60, border: "1px solid rgba(255,214,10,0.2)" }}
            >
                <MapPin size={12} color="#FFD60A" />
                <span style={{ color: "#FFD60A", fontSize: 9, fontWeight: 700 }}>3 LIGHTERS NEARBY</span>
            </div>
        </motion.div>

        {/* Floating badges */}
        <motion.div
            className="absolute top-8 right-0 glass rounded-xl px-3 py-2 flex items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <Flame size={14} color="#FF7A00" />
            <span className="text-xs font-bold" style={{ color: "#FF7A00" }}>12 XP Earned</span>
        </motion.div>

        <motion.div
            className="absolute bottom-12 left-0 glass rounded-xl px-3 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
        >
            <span className="text-xs font-bold" style={{ color: "#FFD60A" }}>🏆 Rank #1 • Tunis</span>
        </motion.div>
    </div>
);

export default function HeroSection() {
    return (
        <section
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0F1014 0%, #141418 50%, #0F1014 100%)" }}
        >
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,214,10,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,214,10,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            {/* Radial light from top-left */}
            <div
                className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle at top left, #FFD60A, transparent 60%)" }}
            />
            {/* Radial light from bottom-right */}
            <div
                className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-15 pointer-events-none"
                style={{ background: "radial-gradient(circle at bottom right, #FF7A00, transparent 60%)" }}
            />

            <div className="relative z-10 container mx-auto px-6 py-24 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text */}
                    <div>
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm font-semibold text-white/70">Now Live in Tunisia & Morocco</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            className="text-6xl lg:text-8xl font-black leading-none tracking-tight mb-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <span className="text-white block">DAVAY:</span>
                            <span className="gradient-text text-glow-yellow block">The Streets</span>
                            <span className="text-white block">Are Alive.</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            The ultimate real-world collectible game. Find custom QR-code lighters in the wild,
                            scan them to claim ownership, steal them from other players, and track their journey
                            across the country.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <button
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black text-black text-lg transition-all duration-200 active:scale-95 glow-yellow hover:brightness-110"
                                style={{ background: "linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)" }}
                            >
                                <Download size={20} />
                                Download the App
                            </button>
                            <button
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-white text-lg transition-all duration-200 active:scale-95 glass hover:bg-white/10"
                            >
                                Watch How It Works
                            </button>
                        </motion.div>

                        {/* Social proof */}
                        <motion.div
                            className="flex flex-wrap items-center gap-6 mt-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <div>
                                <div className="text-2xl font-black gradient-text">12K+</div>
                                <div className="text-xs text-white/40 font-medium">Active Players</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <div className="text-2xl font-black gradient-text">4,300</div>
                                <div className="text-xs text-white/40 font-medium">Lighters in the Wild</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <div className="text-2xl font-black gradient-text">8</div>
                                <div className="text-xs text-white/40 font-medium">Cities</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Visual */}
                    <motion.div
                        className="flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <LighterVisual />
                    </motion.div>
                </div>
            </div>

            {/* Bottom fade */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                style={{ background: "linear-gradient(transparent, #0F1014)" }}
            />
        </section>
    );
}
