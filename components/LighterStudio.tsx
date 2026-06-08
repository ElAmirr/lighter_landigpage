"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import {
    Camera,
    ChevronRight,
    Zap,
    Truck,
    Sparkles,
    Upload,
    Check,
    Loader2,
    AlertCircle,
    Image as ImageIcon,
    Download,
    Mail,
} from "lucide-react";

// Style configurations — IDs match backend STYLE_PROMPTS keys

const AI_MODELS = [
    {
        id: "graffiti",
        name: "Urban Graffiti Edition",
        number: "01",
        description: "Bold urban graffiti illustration. Spray paint, yellow & orange palette, high contrast street art.",
        vibe: "STREET",
        colors: ["#FFD60A", "#FF7A00", "#FFFFFF"],
        preview: {
            bg: "linear-gradient(135deg, #1a1000 0%, #2a1800 50%, #0f0f0f 100%)",
            accent: "#FF7A00",
        },
    },
    {
        id: "cyberpunk",
        name: "Cyberpunk Anime Edition",
        number: "02",
        description: "Premium cyberpunk anime character. Neon glow, cel shading, electric energy effects.",
        vibe: "NEON",
        colors: ["#FFD60A", "#00FFFF", "#FF6B9D"],
        preview: {
            bg: "linear-gradient(135deg, #0a0a1a 0%, #001a2e 50%, #1a0a2e 100%)",
            accent: "#00FFFF",
        },
    },
    {
        id: "luxury",
        name: "Luxury Gold Collector Edition",
        number: "03",
        description: "Black & gold luxury editorial art. Metallic reflections, minimalistic premium composition.",
        vibe: "PREMIUM",
        colors: ["#FFD700", "#FFA500", "#111111"],
        preview: {
            bg: "linear-gradient(135deg, #1a1500 0%, #2a2000 50%, #111111 100%)",
            accent: "#FFD700",
        },
    },
];

const STEPS = ["Upload Photo", "Choose AI Style", "Generate & Checkout"];

// ──────────────────────────────────────────────
// Step 1: Upload
// ──────────────────────────────────────────────
function UploadStep({ file, onFile }: { file: File | null; onFile: (f: File) => void }) {
    const [dragging, setDragging] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped && dropped.type.startsWith("image/")) onFile(dropped);
        },
        [onFile]
    );

    return (
        <motion.div
            key="upload"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
        >
            <h3 className="text-2xl font-black text-white mb-1">Upload Your Photo</h3>
            <p className="text-white/50 text-sm mb-6">
                Portrait, artwork, or any image — our AI will style it and wrap it around your lighter.
                <br />
                <span className="text-white/30 text-xs">Skip to generate a pure AI design without a photo.</span>
            </p>

            <label
                className="relative flex flex-col items-center justify-center w-full rounded-2xl cursor-pointer transition-all duration-300"
                style={{
                    minHeight: 220,
                    border: dragging ? "2px dashed #FFD60A" : file ? "2px solid rgba(255,214,10,0.5)" : "2px dashed rgba(255,255,255,0.12)",
                    background: dragging ? "rgba(255,214,10,0.06)" : file ? "rgba(255,214,10,0.04)" : "rgba(255,255,255,0.02)",
                    boxShadow: dragging ? "0 0 30px rgba(255,214,10,0.2)" : "none",
                }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
                {file ? (
                    <div className="flex flex-col items-center gap-3 p-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="Uploaded" className="w-24 h-24 rounded-2xl object-cover" style={{ border: "2px solid rgba(255,214,10,0.5)" }} />
                        <div className="flex items-center gap-2">
                            <Check size={14} color="#FFD60A" />
                            <span className="text-sm font-bold" style={{ color: "#FFD60A" }}>{file.name}</span>
                        </div>
                        <span className="text-xs text-white/30">Click to change</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 p-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,214,10,0.1)", border: "1px solid rgba(255,214,10,0.2)" }}>
                            {dragging ? <Upload size={28} color="#FFD60A" /> : <Camera size={28} color="#FFD60A" />}
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-white text-sm mb-1">{dragging ? "Drop it here!" : "Upload your portrait or any photo"}</p>
                            <p className="text-xs text-white/40">Drag & drop or click to browse • JPG, PNG, WEBP</p>
                        </div>
                    </div>
                )}
            </label>

            {/* Optional skip notice */}
            <p className="text-center text-xs text-white/25 mt-4">No photo? That's fine — skip to next step for a pure AI-generated design.</p>
        </motion.div>
    );
}

// ──────────────────────────────────────────────
// Step 2: AI Model selector
// ──────────────────────────────────────────────
function ModelStep({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
    return (
        <motion.div
            key="model"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
        >
            <h3 className="text-2xl font-black text-white mb-1">Choose Your AI Style</h3>
            <p className="text-white/50 text-sm mb-6">Select the aesthetic that defines your piece.</p>
            <div className="grid gap-4">
                {AI_MODELS.map((model) => {
                    const isSelected = selected === model.id;
                    return (
                        <button
                            key={model.id}
                            onClick={() => onSelect(model.id)}
                            className="w-full text-left rounded-2xl p-5 transition-all duration-300 active:scale-[0.98]"
                            style={{
                                background: isSelected ? `${model.preview.accent}12` : "rgba(255,255,255,0.03)",
                                border: isSelected ? `1.5px solid ${model.preview.accent}` : "1.5px solid rgba(255,255,255,0.08)",
                                boxShadow: isSelected ? `0 0 25px ${model.preview.accent}30` : "none",
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: model.preview.bg, border: "1px solid rgba(255,255,255,0.08)" }}>
                                    {isSelected
                                        ? <Check size={18} color={model.preview.accent} />
                                        : <div className="flex gap-0.5">{model.colors.map((c, i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />)}</div>
                                    }
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-white/30">{model.number}</span>
                                        <h4 className="font-black text-white text-base">{model.name}</h4>
                                        <span className="text-xs font-black px-2 py-0.5 rounded-full ml-auto" style={{ background: `${model.preview.accent}20`, color: model.preview.accent }}>{model.vibe}</span>
                                    </div>
                                    <p className="text-xs text-white/50 leading-relaxed">{model.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ──────────────────────────────────────────────
// Step 3: Generate & Checkout (Puter.js integration)
// ──────────────────────────────────────────────
function CheckoutStep({
    file,
    modelId,
}: {
    file: File | null;
    modelId: string | null;
}) {
    const model = AI_MODELS.find((m) => m.id === modelId) ?? AI_MODELS[0];
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSendEmail = async () => {
        if (!email) return;
        setEmailLoading(true);
        // Simulate sending email backend request
        await new Promise(resolve => setTimeout(resolve, 1500));
        setEmailLoading(false);
        setEmailSent(true);
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setGeneratedUrl(null);
        try {
            const formData = new FormData();
            formData.append("style", model.id);
            if (file) {
                formData.append("image", file);
            }

            const response = await fetch("/api/generate-lighter", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate image.");
            }

            if (data.imageUrl) {
                setGeneratedUrl(data.imageUrl);
            } else {
                throw new Error("No image generated by Cloudflare AI.");
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Generation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="checkout"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
        >
            <h3 className="text-2xl font-black text-white mb-1">Generate Your Lighter</h3>
            <p className="text-white/50 text-sm mb-6">
                AI will generate the artwork for your custom lighter wrap.
            </p>

            {/* Preview area */}
            <div
                className="relative rounded-3xl overflow-hidden mb-5 flex items-center justify-center"
                style={{
                    background: model.preview.bg,
                    border: `1px solid ${model.preview.accent}30`,
                    minHeight: 200,
                    boxShadow: `0 0 40px ${model.preview.accent}15`,
                }}
            >
                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-12">
                        <Loader2 size={36} color={model.preview.accent} className="animate-spin" />
                        <div className="text-center">
                            <p className="font-bold text-white text-sm">Generating your lighter art…</p>
                            <p className="text-xs text-white/40 mt-1">AI generation in progress</p>
                        </div>
                    </div>
                ) : generatedUrl ? (
                    <div className="relative w-full">
                        {/* Generated image displayed as the lighter wrap */}
                        <div className="flex items-center justify-center gap-6 p-6">
                            <div className="relative flex-shrink-0">
                                <svg width="90" height="160" viewBox="0 0 120 200" fill="none">
                                    <defs>
                                        <clipPath id="lighterClip">
                                            <rect x="10" y="60" width="100" height="130" rx="12" />
                                        </clipPath>
                                    </defs>
                                    <rect x="10" y="60" width="100" height="130" rx="12" fill="#1a1a1e" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <image href={generatedUrl} x="10" y="60" width="100" height="130" clipPath="url(#lighterClip)" preserveAspectRatio="xMidYMid slice" />
                                    <rect x="10" y="60" width="100" height="130" rx="12" fill="url(#edgeFade)" />
                                    <rect x="22" y="35" width="76" height="35" rx="8" fill="#2A2A2E" />
                                    <path d="M60 5 C55 10 50 18 54 22 C56 16 58 18 60 12 C62 18 64 16 66 22 C70 18 65 10 60 5Z" fill={model.preview.accent} opacity="0.95" />
                                    <rect x="10" y="60" width="100" height="130" rx="12" fill="none" stroke={model.preview.accent} strokeWidth="1.5" strokeOpacity="0.5" />
                                    <defs>
                                        <linearGradient id="edgeFade" x1="10" y1="60" x2="110" y2="190" gradientUnits="userSpaceOnUse">
                                            <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
                                            <stop offset="50%" stopColor="#000" stopOpacity="0" />
                                            <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 rounded-xl blur-2xl opacity-25" style={{ background: model.preview.accent }} />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold mb-1" style={{ color: model.preview.accent }}>AI GENERATED ✓</div>
                                <div className="text-white font-black text-base mb-1">{model.name} Style</div>
                                <div className="text-white/50 text-xs mb-3">Your custom wrap is ready</div>
                                <div className="flex flex-wrap gap-1">
                                    {model.colors.map((c, i) => (
                                        <div key={i} className="w-4 h-4 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="px-4 pb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={generatedUrl}
                                alt="AI Generated lighter art"
                                className="w-full rounded-2xl object-cover"
                                style={{ maxHeight: 200, border: `1px solid ${model.preview.accent}40` }}
                            />
                            <p className="text-xs text-center text-white/30 mt-2">Full generated art — printed on your lighter wrap</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-6 p-8">
                        <svg width="80" height="140" viewBox="0 0 120 200" fill="none">
                            <rect x="10" y="60" width="100" height="130" rx="12" fill="rgba(255,255,255,0.06)" stroke={model.preview.accent} strokeWidth="1.5" strokeOpacity="0.4" />
                            <rect x="25" y="100" width="70" height="70" rx="6" fill={`${model.preview.accent}12`} stroke={model.preview.accent} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 3" />
                            <ImageIcon x="47" y="122" width="26" height="26" color={model.preview.accent} opacity={0.4} />
                            <rect x="22" y="35" width="76" height="35" rx="8" fill="rgba(255,255,255,0.05)" />
                            <path d="M60 5 C55 10 50 18 54 22 C56 16 58 18 60 12 C62 18 64 16 66 22 C70 18 65 10 60 5Z" fill={model.preview.accent} opacity="0.6" />
                        </svg>
                        <div>
                            <div className="text-xs font-bold mb-1 opacity-60" style={{ color: model.preview.accent }}>STYLE: {model.name.toUpperCase()}</div>
                            <p className="text-white/40 text-sm leading-relaxed">Your AI-generated art<br />will appear here after generation.</p>
                        </div>
                    </div>
                )}
                <div className="absolute top-3 right-3"><Sparkles size={14} color={model.preview.accent} /></div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-4" style={{ background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.2)" }}>
                    <AlertCircle size={16} color="#ff6060" className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {/* Generate button */}
            {!generatedUrl ? (
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full py-4 rounded-full font-black text-sm flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] mb-3"
                    style={{
                        background: loading ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg, ${model.preview.accent} 0%, #FF9500 100%)`,
                        color: loading ? "rgba(255,255,255,0.3)" : "#000",
                        boxShadow: loading ? "none" : `0 0 25px ${model.preview.accent}40`,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? (
                        <><Loader2 size={18} className="animate-spin" /> Generating AI Art via Cloudflare…</>
                    ) : (
                        <><Sparkles size={18} /> Generate For Free</>
                    )}
                </button>
            ) : (
                <div className="flex flex-col gap-3 mb-3">
                    <a
                        href={generatedUrl}
                        download={`DAVAY_${model.name.replace(" ", "_")}_Lighter.png`}
                        className="w-full py-4 rounded-full font-black text-black text-lg flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] hover:brightness-110 glow-yellow"
                        style={{ background: "linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)" }}
                    >
                        <Download size={22} />
                        Download Lighter Art
                    </a>

                    {emailSent ? (
                        <div className="w-full py-4 rounded-full font-bold text-sm text-[#00FF66] flex items-center justify-center gap-2" style={{ background: "rgba(0,255,102,0.1)", border: "1px solid rgba(0,255,102,0.2)" }}>
                            <Check size={18} /> Sent! Check your inbox.
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Send to email..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#FFD60A] transition-colors"
                            />
                            <button
                                onClick={handleSendEmail}
                                disabled={emailLoading || !email}
                                className="px-6 py-4 rounded-full font-bold text-sm text-black flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: "#FFD60A" }}
                            >
                                {emailLoading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                                Send
                            </button>
                        </div>
                    )}
                </div>
            )}

            {generatedUrl && (
                <button
                    onClick={() => { setGeneratedUrl(null); setError(null); }}
                    className="w-full py-3 rounded-full font-bold text-sm text-white/40 hover:text-white transition-colors active:scale-95 mb-3"
                >
                    ↺ Re-generate
                </button>
            )}

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                    { icon: Zap, label: "AI Generated", sub: "Powered by Puter.js" },
                    { icon: Truck, label: "Ships in 5 Days", sub: "Free shipping" },
                    { icon: Sparkles, label: "QR Activated", sub: "Play-ready" },
                ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <Icon size={16} color="#FFD60A" className="mx-auto mb-1" />
                        <div className="text-xs font-bold text-white">{label}</div>
                        <div className="text-xs text-white/40">{sub}</div>
                    </div>
                ))}
            </div>
            <p className="text-center text-xs text-white/25 mt-3">Secure checkout · No subscription · Ships worldwide</p>
        </motion.div>
    );
}

// ──────────────────────────────────────────────
// Main Studio Component
// ──────────────────────────────────────────────
export default function LighterStudio() {
    const [step, setStep] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [model, setModel] = useState<string | null>(null);

    const canAdvance =
        step === 0 || // step 0: always can skip (photo is optional)
        (step === 1 && model !== null) ||
        step === 2;

    return (
        <section
            id="studio"
            className="relative py-24 lg:py-32 overflow-hidden"
            style={{ background: "linear-gradient(180deg, #0F1014 0%, #111116 50%, #0F1014 100%)" }}
        >
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #FF7A00 0%, transparent 70%)" }} />
            <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #FFD60A 0%, transparent 70%)" }} />

            <div className="relative z-10 container mx-auto px-6">
                <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                        <Sparkles size={14} color="#FFD60A" />
                        <span className="text-sm font-bold gradient-text">AI LIGHTER STUDIO</span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                        Create Your<br /><span className="gradient-text">Own Piece.</span>
                    </h2>
                    <p className="text-white/50 text-lg mt-4 max-w-md mx-auto">
                        Design a custom AI-generated lighter right in your browser. Powered by Puter.js — completely free!
                    </p>
                </motion.div>

                <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                    <div className="flex items-center justify-between mb-8">
                        {STEPS.map((label, idx) => (
                            <button
                                key={label}
                                onClick={() => (idx < step ? setStep(idx) : undefined)}
                                className="flex-1 flex flex-col items-center gap-2 transition-all duration-200"
                            >
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300"
                                    style={{
                                        background: idx === step ? "linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)" : idx < step ? "rgba(255,214,10,0.2)" : "rgba(255,255,255,0.06)",
                                        color: idx === step ? "#000" : idx < step ? "#FFD60A" : "rgba(255,255,255,0.3)",
                                        boxShadow: idx === step ? "0 0 15px rgba(255,214,10,0.4)" : "none",
                                    }}
                                >
                                    {idx < step ? <Check size={16} /> : idx + 1}
                                </div>
                                <span className="text-xs font-bold hidden sm:block" style={{ color: idx === step ? "#FFD60A" : idx < step ? "rgba(255,214,10,0.6)" : "rgba(255,255,255,0.25)" }}>
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="w-full h-0.5 mb-8 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #FFD60A, #FF7A00)" }}
                            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="rounded-3xl p-8 lg:p-10" style={{ background: "rgba(27,27,31,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
                        <AnimatePresence mode="wait">
                            {step === 0 && <UploadStep file={file} onFile={setFile} />}
                            {step === 1 && <ModelStep selected={model} onSelect={setModel} />}
                            {step === 2 && <CheckoutStep file={file} modelId={model} />}
                        </AnimatePresence>

                        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <button
                                onClick={() => setStep((s) => Math.max(0, s - 1))}
                                className="px-5 py-3 rounded-full text-sm font-bold text-white/50 hover:text-white transition-colors active:scale-95"
                                style={{ visibility: step === 0 ? "hidden" : "visible" }}
                            >
                                ← Back
                            </button>
                            {step < 2 && (
                                <button
                                    onClick={() => canAdvance && setStep((s) => s + 1)}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all duration-200 active:scale-95"
                                    style={{
                                        background: canAdvance ? "linear-gradient(135deg, #FFD60A 0%, #FF9500 100%)" : "rgba(255,255,255,0.06)",
                                        color: canAdvance ? "#000" : "rgba(255,255,255,0.2)",
                                        cursor: canAdvance ? "pointer" : "not-allowed",
                                        boxShadow: canAdvance ? "0 0 20px rgba(255,214,10,0.3)" : "none",
                                    }}
                                >
                                    {step === 0 ? (file ? "Next →" : "Skip →") : "Continue"} <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
