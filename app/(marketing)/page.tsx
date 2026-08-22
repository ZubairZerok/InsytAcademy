// app/(marketing)/page.tsx
import Link from "next/link";
import {
    Sparkles, Mic, Calendar, Microscope, Calculator,
    BookOpen, Network, Briefcase, Award, ArrowRight,
    Leaf, Stethoscope, ShieldAlert, TrendingUp, Cpu, Anchor,
    CheckCircle2, PlayCircle, Layers, ShieldCheck, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { BAU_FACULTIES } from "@/lib/bau-data/faculties";

const FACULTY_ICONS: Record<string, any> = {
    FOA: Leaf,
    FVS: Stethoscope,
    FAH: ShieldAlert,
    FAERS: TrendingUp,
    FAET: Cpu,
    FOF: Anchor,
};

const CAPABILITIES = [
    {
        icon: Calendar,
        title: "Multimodal Schedule Intelligence",
        tech: "Google Gemini 1.5 Flash",
        desc: "Ingests complex faculty routine PDFs, scanned noticeboard images, and timetable circulars. Automatically resolves group allocations, practical room clashes, and continuous assessment dates.",
        href: "/academy/schedule",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
        icon: Mic,
        title: "Spoken AI Viva Voce Board",
        tech: "ElevenLabs + Gemini 1.5",
        desc: "Simulates high-stakes departmental oral exams. Natural conversational voice examiners ask syllabus questions, listen to student microphone answers, and score technical accuracy, depth, and fluency in real-time.",
        href: "/academy/viva",
        badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
        icon: Microscope,
        title: "Multimodal Field & Specimen AI",
        tech: "Gemini Vision Multimodal",
        desc: "Visual diagnostic AI for agricultural pathology (Rice Blast, Leaf Blight), soil salinity crusts, and veterinary parasitology slides, mapped directly to BAU practical laboratory protocols.",
        href: "/academy/field-lab",
        badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
        icon: Calculator,
        title: "10/20/70 Ordinance & Exam Lab",
        tech: "Academic Ordinance Engine",
        desc: "Calibrated to the official BAU academic grading policy: 10% Attendance + 20% Continuous Assessment + 70% Final Exam. Features real-time grade point projection and CGPA target simulation.",
        href: "/academy/assessment",
        badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    },
    {
        icon: BookOpen,
        title: "Syllabus-Grounded AI Tutor",
        tech: "Gemini RAG + LaTeX",
        desc: "Mathematical and scientific tutoring grounded strictly in verified BAU course curricula. Renders LaTeX statistical proofs (RCBD, ANOVA, OLS) and agricultural biometric derivations without hallucinations.",
        href: "/academy/courses",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
        icon: Network,
        title: "Prerequisite DAG & Career Bridge",
        tech: "Directed Acyclic Graph",
        desc: "Maps Level 1–4 course dependency graph to real recruitment outcomes: BCS Agriculture Cadre, NARS Scientific Officer (BARI/BRRI), AgTech roles, and international research fellowships.",
        href: "/academy/skills",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    }
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-agri-black text-white selection:bg-neon-green selection:text-black">
            {/* ═══════════════════════════════════════════════════════
                1. HERO SECTION: BAU ACADEMIC OPERATING SYSTEM
               ═══════════════════════════════════════════════════════ */}
            <section className="relative min-h-[92vh] w-full overflow-hidden flex items-center justify-center bg-grid-pattern px-4 py-20">
                {/* Ambient Radial Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neon-green/10 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                    {/* MLH / AI Tech Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-neon-green">
                            <span className="h-2 w-2 rounded-full bg-neon-green animate-ping" />
                            BANGLADESH AGRICULTURAL UNIVERSITY
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-400">
                            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                            Google Gemini API
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono font-bold text-purple-400">
                            <Mic className="h-3.5 w-3.5 text-purple-400" />
                            ElevenLabs Voice
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans leading-[1.1]">
                            The AI-Native <span className="text-neon-green text-glow">Academic OS</span> for Bangladesh Agricultural University
                        </h1>
                        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed">
                            A hyper-specialized learning operating system uniting multimodal routine PDF ingestion, spoken AI viva voce defense, field specimen vision, and official 10/20/70 Ordinance intelligence.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link href="/onboarding">
                            <Button className="bg-neon-green text-black hover:bg-neon-green/90 font-extrabold font-mono text-sm h-13 px-8 rounded-xl shadow-[0_0_30px_rgba(0,255,148,0.35)] transition-all transform hover:scale-105">
                                ENTER BAU ACADEMIC OS
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/academy/viva">
                            <Button variant="outline" className="border-white/15 hover:border-purple-500 hover:bg-purple-500/10 font-bold font-mono text-sm h-13 px-6 rounded-xl text-gray-300 hover:text-white">
                                <Mic className="mr-2 h-4 w-4 text-purple-400" />
                                TRY LIVE SPOKEN VIVA
                            </Button>
                        </Link>
                    </div>

                    {/* Interactive Telemetry Mockup Preview */}
                    <div className="pt-8 max-w-4xl mx-auto">
                        <div className="p-4 md:p-6 rounded-2xl bg-agri-dark/80 border border-white/10 shadow-2xl backdrop-blur-2xl text-left space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs text-gray-400">
                                <span className="flex items-center gap-2 text-neon-green font-bold">
                                    <span className="h-2 w-2 rounded-full bg-neon-green" />
                                    INSYT.BAU LIVE TELEMETRY
                                </span>
                                <span>FAERS · DEPT OF AG. ECONOMICS · L2S1</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                    <span className="text-[10px] text-gray-500 uppercase block">TODAY&apos;S SCHEDULE</span>
                                    <span className="font-bold text-white block">10:00 — AAS 2107 (Gallery 204)</span>
                                    <span className="text-[11px] text-neon-green">Statistical Inference · Dr. Jahangir</span>
                                </div>
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                                    <span className="text-[10px] text-purple-400 uppercase block">ELEVENLABS ORAL VIVA</span>
                                    <span className="font-bold text-white block">Oral Exam Ready (84%)</span>
                                    <span className="text-[11px] text-purple-300">Hypothesis Testing Defense</span>
                                </div>
                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                                    <span className="text-[10px] text-cyan-400 uppercase block">10/20/70 STANDING</span>
                                    <span className="font-bold text-white block">CGPA 3.52 → Target 3.75</span>
                                    <span className="text-[11px] text-cyan-300">Final Exam Target: 54/70</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                2. SIX CORE AI CAPABILITIES SHOWCASE
               ═══════════════════════════════════════════════════════ */}
            <section className="py-24 px-4 max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-xs font-mono font-bold text-neon-green uppercase">
                        <Sparkles className="h-3.5 w-3.5" />
                        ENGINEERED FOR THE MLH GEMINI CHALLENGE
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans">
                        Six Pillar Intelligence Architecture
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                        Not a decorative chatbot. Gemini and ElevenLabs form the foundational reasoning, visual diagnostic, and spoken examination engines.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CAPABILITIES.map((cap) => {
                        const Icon = cap.icon;
                        return (
                            <GlassCard
                                key={cap.title}
                                className="p-6 md:p-8 space-y-5 hover:border-neon-green/40 transition-all flex flex-col justify-between group"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-green group-hover:scale-110 transition-transform">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${cap.badgeColor}`}>
                                            {cap.tech}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold font-sans text-white group-hover:text-neon-green transition-colors">
                                        {cap.title}
                                    </h3>

                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                                        {cap.desc}
                                    </p>
                                </div>

                                <Link href={cap.href} className="pt-2">
                                    <Button variant="ghost" className="text-xs font-mono text-neon-green hover:underline p-0 h-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Launch Module <ChevronRight className="h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            </GlassCard>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                3. ALL 6 BAU DEGREE-AWARDING FACULTIES
               ═══════════════════════════════════════════════════════ */}
            <section className="py-24 px-4 bg-black/40 border-y border-white/5">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-gray-300 uppercase">
                            <Layers className="h-3.5 w-3.5 text-neon-green" />
                            CAMPUS CURRICULUM FOOTPRINT
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans">
                            All 6 BAU Faculties Supported
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                            Comprehensive syllabus coverage across 44 academic departments in Mymensingh.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BAU_FACULTIES.map((fac) => {
                            const Icon = FACULTY_ICONS[fac.code] || Leaf;
                            return (
                                <GlassCard key={fac.code} className="p-6 space-y-4 hover:border-white/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2.5 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/20">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="font-mono text-xs font-bold text-gray-400 uppercase">{fac.code}</span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-white leading-snug">{fac.name}</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{fac.description}</p>
                                    </div>

                                    <div className="pt-2 border-t border-white/5 font-mono text-[11px] text-gray-400">
                                        {fac.departments.length} Academic Departments · BAU Campus Mymensingh
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                4. PROVENANCE & TECHNICAL ARCHITECTURE FOOTER
               ═══════════════════════════════════════════════════════ */}
            <footer className="py-16 px-4 border-t border-white/10 bg-agri-dark text-gray-400 font-mono text-xs">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <div className="font-bold text-white text-sm">INSYT.BAU Academic Operating System</div>
                        <div className="text-gray-500">Bangladesh Agricultural University, Mymensingh-2202</div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
                        <span>Google Gemini 1.5 Flash</span>
                        <span>ElevenLabs Voice</span>
                        <span>Next.js 14 App Router</span>
                        <span>Supabase SSR</span>
                    </div>

                    <div className="text-center md:text-right text-gray-500">
                        Built for MLH Gemini Challenge · 2026
                    </div>
                </div>
            </footer>
        </div>
    );
}
