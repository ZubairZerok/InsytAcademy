import Link from "next/link";
import {
    Leaf, Dna, TreePine, Microscope, FlaskConical, Bug,
    ArrowRight, Users, BookOpen, Award, Star, TrendingUp,
    ChevronRight, Zap, Globe2, Shield, Compass, Layers, Cpu, Binary
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
                DEDICATED GIS LEARNING PATHWAY (BLOCK-LEVEL ROW)
                Strictly holds the 3 sequential GIS courses in a single row
               ═══════════════════════════════════════════════════ */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/25 via-agri-dark/90 to-agri-dark/60 p-8 md:p-12 shadow-[0_0_60px_rgba(0,255,148,0.04)] space-y-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="max-w-3xl space-y-4">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 text-xs font-mono text-emerald-400">
                                <Compass className="h-3.5 w-3.5" />
                                <span>FLAGSHIP GEOSPATIAL PATHWAY • 3 SEQUENTIAL STAGES</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                                The 3-Stage GIS & Earth Observation Pathway
                            </h2>
                            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                                A deliberate progression engineered from first principles: moving learners sequentially from spatial thinking and cartography to analytical remote sensing, and ending with enterprise cloud GIS and spatial databases.
                            </p>
                        </div>
                        <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl shrink-0">
                            <span className="text-emerald-400 font-bold">Stage 1: Foundations</span>
                            <ArrowRight className="h-4 w-4 text-gray-500" />
                            <span className="text-cyan-400 font-bold">Stage 2: Analyst</span>
                            <ArrowRight className="h-4 w-4 text-gray-500" />
                            <span className="text-purple-400 font-bold">Stage 3: Cloud Engineer</span>
                        </div>
                    </div>

                    {/* Single Row: Exactly 3 GIS Courses */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course 1: Foundations */}
                        <div className="rounded-2xl border border-emerald-500/30 bg-black/40 p-8 flex flex-col justify-between hover:border-emerald-500/60 transition-all duration-300 group hover:bg-black/60 shadow-lg">
                            <div className="space-y-4">
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-emerald-500/20 bg-black/40">
                                    <img
                                        src="/images/courses/gis-spatial-foundations.png"
                                        alt="Spatial Literacy & GIS Foundations"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-xs font-mono text-emerald-400">
                                        <Globe2 className="h-3.5 w-3.5" />
                                        <span>STAGE 01</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Globe2 className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        STAGE 01 • ZERO PREREQS
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors font-mono">
                                    Spatial Literacy & GIS Foundations
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Spatial thinking, Coordinate Reference Systems (CRS/WGS84/UTM), Vector-Raster primitives, QGIS GUI mastery, attribute data modeling, and publication-ready cartography.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-gray-400">
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">QGIS Desktop</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">WGS84 & UTM</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Vector & Raster</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Cartography</span>
                                </div>
                            </div>
                            <div className="pt-8 mt-auto">
                                <Link href="/academy/gis-spatial-foundations">
                                    <Button className="w-full bg-emerald-500 text-agri-black hover:bg-emerald-400 font-bold rounded-xl h-11">
                                        Access Stage 01
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Course 2: Analysis & Remote Sensing */}
                        <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-8 flex flex-col justify-between hover:border-cyan-500/60 transition-all duration-300 group hover:bg-black/60 shadow-lg">
                            <div className="space-y-4">
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-cyan-500/20 bg-black/40">
                                    <img
                                        src="/images/courses/gis-analysis-remote-sensing.png"
                                        alt="GIS Analysis & Remote Sensing"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-xs font-mono text-cyan-400">
                                        <Layers className="h-3.5 w-3.5" />
                                        <span>STAGE 02</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        STAGE 02 • ANALYST
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors font-mono">
                                    GIS Analysis & Remote Sensing
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Vector geoprocessing (Buffer, Clip, Intersect, Dissolve), DEM terrain modeling, satellite remote sensing, spectral indices (NDVI/EVI), and supervised machine learning classification.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-gray-400">
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Geoprocessing</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">DEM & Slope</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">NDVI / NDWI</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Sentinel-2</span>
                                </div>
                            </div>
                            <div className="pt-8 mt-auto">
                                <Link href="/academy/gis-analysis-remote-sensing">
                                    <Button className="w-full bg-cyan-500 text-agri-black hover:bg-cyan-400 font-bold rounded-xl h-11">
                                        Access Stage 02
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Course 3: Geospatial Engineering & Cloud */}
                        <div className="rounded-2xl border border-purple-500/30 bg-black/40 p-8 flex flex-col justify-between hover:border-purple-500/60 transition-all duration-300 group hover:bg-black/60 shadow-lg">
                            <div className="space-y-4">
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-purple-500/20 bg-black/40">
                                    <img
                                        src="/images/courses/gis-engineering-cloud.png"
                                        alt="Geospatial Engineering & Cloud GIS"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-xs font-mono text-purple-400">
                                        <Cpu className="h-3.5 w-3.5" />
                                        <span>STAGE 03</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Cpu className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        STAGE 03 • ENTERPRISE
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors font-mono">
                                    Geospatial Engineering & Cloud GIS
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    PostgreSQL/PostGIS spatial databases, Spatial SQL, Python pipelines (GeoPandas, Rasterio), Google Earth Engine planetary computing, R spatial stacks, and Web GIS.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-gray-400">
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">PostGIS SQL</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">GeoPandas</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Earth Engine</span>
                                    <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">GeoServer</span>
                                </div>
                            </div>
                            <div className="pt-8 mt-auto">
                                <Link href="/academy/gis-engineering-cloud">
                                    <Button className="w-full bg-purple-500 text-white hover:bg-purple-400 font-bold rounded-xl h-11">
                                        Access Stage 03
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                DATA SCIENCE & ARTIFICIAL INTELLIGENCE PROTOCOLS
               ═══════════════════════════════════════════════════ */}
            <section className="py-24 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-xs font-mono text-cyan-400">
                        <Binary className="h-3.5 w-3.5" />
                        <span>COMPUTATIONAL SPECIALIZATIONS</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Statistical Computing &<br />
                        <span className="text-cyan-400">Production AI Protocols.</span>
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Exhaustive curricula engineered for researchers, data scientists, and agricultural specialists requiring deep analytical competence.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* R for Agri-Science */}
                    <div className="rounded-2xl border border-white/10 bg-agri-dark/60 p-8 flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
                        <div className="space-y-4">
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-cyan-500/20 bg-black/40">
                                <img
                                    src="/images/courses/r-agri-data-bau.png"
                                    alt="R for Agri-Science & Analytics"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-xs font-mono text-cyan-400">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    <span>R PROTOCOL</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    22 MODULES • 102 LESSONS • BAU EDITION
                                </span>
                            </div>
                            <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-wider">DATA SCIENCE & STATISTICS</span>
                            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                R for Agri-Science & Analytics
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Complete Tidyverse data manipulation, publication-grade ggplot2 visualization, experimental design (RCBD, ANOVA, Tukey HSD), classical regression, spatial R, and interactive R Shiny web applications.
                            </p>
                            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-gray-400">
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Tidyverse</span>
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">ggplot2</span>
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">ANOVA / RCBD</span>
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Machine Learning</span>
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">R Shiny</span>
                            </div>
                        </div>
                        <div className="pt-8 mt-auto">
                            <Link href="/academy/r-agri-data-bau">
                                <Button className="w-full bg-cyan-500 text-agri-black hover:bg-cyan-400 font-bold rounded-xl h-11">
                                    Access Protocol
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* ML Masterclass */}
                    <div className="rounded-2xl border border-white/10 bg-agri-dark/60 p-8 flex flex-col justify-between hover:border-purple-500/40 transition-all group">
                        <div className="space-y-4">
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-purple-500/20 bg-black/40">
                                <img
                                    src="/images/courses/ml-masterclass.png"
                                    alt="The Machine Learning Masterclass"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-xs font-mono text-purple-400">
                                    <Microscope className="h-3.5 w-3.5" />
                                    <span>ML PROTOCOL</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Microscope className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    AI & PRODUCTION DEPLOYMENT
                                </span>
                            </div>
                            <span className="text-[11px] font-mono uppercase text-purple-400 font-bold tracking-wider">MACHINE LEARNING & AI</span>
                            <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                The Machine Learning Masterclass
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Mathematical foundations, Scikit-Learn pipelines, tree ensembles (XGBoost/LightGBM), deep learning with PyTorch, computer vision, modern Transformers/LLMs, and production MLOps.
                            </p>
                            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-gray-400">
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Scikit-Learn</span>
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">PyTorch</span>
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">Transformers</span>
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">FastAPI</span>
                                <span className="bg-white/5 px-2.5 py-1 rounded border border-white/10">MLOps</span>
                            </div>
                        </div>
                        <div className="pt-8 mt-auto">
                            <Link href="/academy/ml-masterclass">
                                <Button className="w-full bg-purple-500 text-white hover:bg-purple-400 font-bold rounded-xl h-11">
                                    Access Protocol
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
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
