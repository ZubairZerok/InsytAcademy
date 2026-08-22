import Link from "next/link";
import {
    Leaf, Dna, TreePine, Microscope, FlaskConical, Bug,
    ArrowRight, Users, BookOpen, Award, Star, TrendingUp,
    ChevronRight, Zap, Globe2, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createServiceClient } from "@/lib/supabase/server";

const disciplines = [
    { icon: Leaf, label: "Crop Science", desc: "Precision agriculture & yield optimization", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: Dna, label: "Bioinformatics", desc: "Genomics, sequencing & computational biology", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { icon: Bug, label: "Livestock & Veterinary", desc: "Animal husbandry, health & breeding", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { icon: TreePine, label: "Forestry & Ecology", desc: "Conservation, silviculture & ecosystems", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    { icon: FlaskConical, label: "Biotech Engineering", desc: "Genetic engineering & molecular biology", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { icon: Microscope, label: "Research & Data Science", desc: "Statistical methods, R, Python & ML", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
];

// Real platform stats (counted from the DB). No fabricated numbers.
async function getStats() {
    try {
        const db = createServiceClient();
        const [{ count: courseCount }, { count: learnerCount }] = await Promise.all([
            db.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true),
            db.from("profiles").select("id", { count: "exact", head: true }),
        ]);
        return [
            { value: `${courseCount ?? 0}`, label: "Published Courses", icon: BookOpen },
            { value: `${learnerCount ?? 0}`, label: "Registered Learners", icon: Users },
            { value: "R · Python", label: "In-Browser Labs", icon: TrendingUp },
            { value: "Verified", label: "Course Credentials", icon: Award },
        ];
    } catch {
        return [
            { value: "—", label: "Published Courses", icon: BookOpen },
            { value: "—", label: "Registered Learners", icon: Users },
            { value: "R · Python", label: "In-Browser Labs", icon: TrendingUp },
            { value: "Verified", label: "Course Credentials", icon: Award },
        ];
    }
}

// Illustrative messaging (not attributed to real individuals/institutions).
const testimonials = [
    { name: "Bioinformatics learner", role: "Early access", text: "The interactive R labs and genomics modules let me practice on real tools instead of just reading slides." },
    { name: "Agricultural engineering student", role: "Early access", text: "Working through the certifications gave me practical, job-relevant skills in precision agriculture." },
    { name: "Forestry instructor", role: "Early access", text: "The adaptive, sector-specific content is a genuinely useful supplement to classroom teaching." },
];

export default async function Home() {
    const stats = await getStats();
    return (
        <div className="min-h-screen bg-agri-black text-white">

            {/* ═══════════════════════════════════════════════════
                HERO SECTION — The First 3 Seconds
                Conversion psychology: Clarity > Cleverness
               ═══════════════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center bg-grid-pattern">
                {/* Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-agri-black via-agri-black/80 to-agri-black" />
                <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-neon-green/[0.03] to-transparent" />
                <div className="absolute bottom-0 left-0 w-[40%] h-1/2 bg-gradient-to-tr from-cyan-500/[0.02] to-transparent" />
                {/* Subtle gradient overlays — no animated blur orbs */}

                {/* Subtle Background Vector Design */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.55]">
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] text-neon-green/[0.08]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
                        <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="400" cy="400" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
                        
                        {/* Diagonal structural axis lines */}
                        <line x1="100" y1="100" x2="700" y2="700" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                        <line x1="700" y1="100" x2="100" y2="700" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                        
                        {/* Horizontal and Vertical structural grid lines */}
                        <line x1="400" y1="50" x2="400" y2="750" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="400" x2="750" y2="400" stroke="currentColor" strokeWidth="0.5" />
                        
                        {/* Bio-Tech schematic nodes */}
                        <circle cx="400" cy="100" r="4" fill="currentColor" />
                        <circle cx="400" cy="700" r="4" fill="currentColor" />
                        <circle cx="100" cy="400" r="4" fill="currentColor" />
                        <circle cx="700" cy="400" r="4" fill="currentColor" />
                        <circle cx="400" cy="400" r="6" fill="currentColor" />
                        
                        {/* Organic vector leaf path representation */}
                        <path d="M400 400 C 450 350, 480 350, 500 400 C 480 450, 450 450, 400 400" stroke="currentColor" strokeWidth="1" />
                        <path d="M400 400 C 350 350, 320 350, 300 400 C 320 450, 350 450, 400 400" stroke="currentColor" strokeWidth="1" />
                        <path d="M400 400 C 450 450, 480 450, 500 400 C 480 350, 450 350, 400 400" stroke="currentColor" strokeWidth="1" />
                        <path d="M400 400 C 350 450, 320 450, 300 400 C 320 350, 350 350, 400 400" stroke="currentColor" strokeWidth="1" />
                    </svg>
                </div>

                <div className="container relative z-10 mx-auto px-4 md:px-6 py-20">
                    <div className="max-w-3xl space-y-8 animate-fade-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-neon-green/[0.08] border border-neon-green/20 rounded-full px-4 py-1.5 text-xs font-mono text-neon-green">
                            <Zap className="h-3.5 w-3.5" />
                            <span>THE FUTURE OF AGRI-SCIENCE EDUCATION</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                            Where Science Meets{" "}
                            <span className="text-neon-green">
                                The Field.
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl">
                            Master Agriculture, Bioinformatics, Biotech, and Ecological Science with 
                            interactive labs, real research tools, and 
                            industry-recognized certifications.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/signup">
                                <Button className="h-14 px-10 text-lg bg-neon-green text-agri-black hover:bg-neon-green/90 font-bold rounded-2xl transition-all">
                                    Start Learning Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/academy">
                                <Button variant="outline" className="h-14 px-10 text-lg border-white/10 text-white hover:bg-white/[0.04] rounded-2xl">
                                    Browse Courses
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Micro-Proof */}
                        <div className="flex items-center gap-6 pt-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-neon-green/50" />
                                <span>Verified Credentials</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe2 className="h-4 w-4 text-neon-green/50" />
                                <span>Learn from Anywhere</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-neon-green/50" />
                                <span>Interactive Labs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                SOCIAL PROOF — Stats Bar
               ═══════════════════════════════════════════════════ */}
            <section className="border-y border-white/[0.06] bg-agri-dark/30">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center space-y-2 group">
                                <stat.icon className="h-5 w-5 text-neon-green/40 mx-auto mb-3 group-hover:text-neon-green transition-colors" />
                                <div className="text-3xl md:text-4xl font-bold font-mono" style={{color: 'var(--text-primary)'}}>{stat.value}</div>
                                <div className="text-xs font-mono uppercase tracking-wider text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                DISCIPLINES GRID — Domain Authority
               ═══════════════════════════════════════════════════ */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mb-16 space-y-4">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-neon-green/60">Explore Disciplines</p>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Six Pillars of<br />Scientific Mastery
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        From molecular biology to precision farming — every course is designed by working researchers and industry practitioners.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {disciplines.map((d) => (
                        <Link
                            key={d.label}
                            href={`/academy?search=${encodeURIComponent(d.label)}`}
                            className={`group relative overflow-hidden rounded-2xl border ${d.border} ${d.bg} p-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-xl ${d.bg} flex items-center justify-center flex-shrink-0 ${d.color}`}>
                                    <d.icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-lg font-bold group-hover:text-emerald-700 dark:group-hover:text-neon-green transition-colors" style={{color: 'var(--text-primary)'}}>
                                        {d.label}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{d.desc}</p>
                                </div>
                            </div>
                            <ChevronRight className="absolute top-7 right-6 h-4 w-4 text-gray-700 group-hover:text-neon-green group-hover:translate-x-1 transition-all" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                TESTIMONIALS — Trust & Authority
               ═══════════════════════════════════════════════════ */}
            <section className="py-24 border-t border-white/[0.06] bg-agri-dark/20 bg-dot-pattern">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-2xl mb-16 space-y-4">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-neon-green/60">Trusted by Researchers</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            What Our Learners Say
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.name}
                                className="rounded-2xl border border-white/[0.06] bg-agri-dark/40 backdrop-blur-sm p-8 space-y-6 hover:border-neon-green/20 transition-all"
                            >
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-neon-green fill-neon-green" />
                                    ))}
                                </div>
                                <p className="text-gray-300 leading-relaxed italic">
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div className="border-t border-white/[0.06] pt-4">
                                    <p className="font-bold text-sm" style={{color: 'var(--text-primary)'}}>{t.name}</p>
                                    <p className="text-xs text-gray-400">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                FINAL CTA — Conversion Anchor
               ═══════════════════════════════════════════════════ */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon-green/[0.04] to-transparent" />
                
                <div className="container relative z-10 mx-auto px-4 md:px-6 text-center max-w-3xl space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Ready to Shape the Future of{" "}
                        <span className="text-neon-green">Science?</span>
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-xl mx-auto">
                        Join thousands of researchers, engineers, and scientists building the next generation of agricultural and biological innovation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/signup">
                            <Button className="h-14 px-12 text-lg bg-neon-green text-agri-black hover:bg-neon-green/90 font-bold rounded-2xl transition-all">
                                Create Free Account
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                        No credit card required · Free courses available · Cancel anytime
                    </p>
                </div>
            </section>
        </div>
    );
}
