// app/(dashboard)/opportunities/page.tsx
"use client";

import { useState } from "react";
import { BAU_CAREER_PATHWAYS } from "@/lib/bau-data/careers";
import type { CareerPathway } from "@/types/bau";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
    Briefcase, Sparkles, TrendingUp, CheckCircle2,
    BookOpen, Award, ArrowRight, Building2, ChevronRight, GraduationCap
} from "lucide-react";
import Link from "next/link";

export default function CareerBridgePage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const [selectedCareer, setSelectedCareer] = useState<CareerPathway | null>(BAU_CAREER_PATHWAYS[0]);

    const categories = [
        "ALL",
        "Government Cadre (BCS)",
        "Research Institutes (BARI/BRRI/BLRI)",
        "AgTech & Corporate",
        "International Fellowship & Higher Studies"
    ];

    const filteredCareers = BAU_CAREER_PATHWAYS.filter(c => {
        return selectedCategory === "ALL" || c.category === selectedCategory;
    });

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-neon-green uppercase tracking-wider">
                        BAU ACADEMIC-CAREER ALIGNMENT // CAREER BRIDGE
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-emerald-600 dark:text-neon-green" />
                    BAU Career Bridge & Pathway Intelligence
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    Connect your BAU course syllabi, laboratory biometrics, and viva competencies to real recruitment roadmaps: BCS Agriculture, NARS Research Scientist positions, AgTech leadership, and International Fellowships.
                </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none p-2 rounded-2xl bg-white/95 dark:bg-agri-dark/80 border border-black/[0.08] dark:border-white/10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                            selectedCategory === cat
                                ? "bg-neon-green text-black shadow-[0_0_15px_rgba(0,255,148,0.25)]"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        {cat === "ALL" ? "All Career Pathways" : cat}
                    </button>
                ))}
            </div>

            {/* Career Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Career Cards */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredCareers.map((career) => {
                        const isSelected = selectedCareer?.id === career.id;
                        return (
                            <GlassCard
                                key={career.id}
                                onClick={() => setSelectedCareer(career)}
                                className={`p-6 space-y-4 cursor-pointer transition-all border-black/[0.08] dark:border-white/10 ${
                                    isSelected
                                        ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(0,255,148,0.15)]"
                                        : "hover:border-emerald-500/30"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-neon-green border border-emerald-500/20 uppercase">
                                            {career.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug pt-1">
                                            {career.roleTitle}
                                        </h3>
                                    </div>
                                    <span className="font-mono text-xs font-bold text-emerald-700 dark:text-neon-green shrink-0">
                                        {career.salaryRangeBDT.split("(")[0]}
                                    </span>
                                </div>

                                {/* Target Degree & Organization Examples */}
                                <div className="text-xs font-mono text-gray-500 dark:text-gray-400 space-y-1">
                                    <div>Degree: <strong className="text-gray-800 dark:text-gray-200">{career.requiredDegree}</strong></div>
                                    <div>Organizations: <span className="text-gray-700 dark:text-gray-300">{career.organizationExamples.join(" · ")}</span></div>
                                </div>

                                {/* Required BAU Courses Chips */}
                                <div className="space-y-1.5 pt-2 border-t border-black/[0.04] dark:border-white/5 font-mono text-xs">
                                    <span className="text-[10px] text-gray-500 uppercase block">Critical BAU Courses:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {career.keyRequiredCourses.map((code, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-[11px] text-emerald-700 dark:text-neon-green font-bold">
                                                {code}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>

                {/* Right Column: Step-by-Step Roadmap Inspector */}
                <div className="space-y-4">
                    {selectedCareer ? (
                        <GlassCard className="p-6 md:p-8 space-y-6 border-emerald-500/30 bg-white/95 dark:bg-agri-dark/90 sticky top-20">
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-neon-green uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                    Strategic Preparation Roadmap
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                                    {selectedCareer.roleTitle}
                                </h3>
                                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                    {selectedCareer.salaryRangeBDT}
                                </p>
                            </div>

                            {/* Core Competencies */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-mono font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    Required Core Competencies
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedCareer.coreSkills.map((skill, i) => (
                                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-neon-green font-mono text-[11px] border border-emerald-500/20">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Step by Step Timeline */}
                            <div className="space-y-3 pt-2 border-t border-black/[0.06] dark:border-white/10">
                                <h4 className="text-xs font-mono font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    Undergraduate Preparation Steps
                                </h4>
                                <div className="space-y-3">
                                    {selectedCareer.roadmapSteps.map((step) => (
                                        <div key={step.step} className="p-3 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1">
                                            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 dark:text-neon-green">
                                                <span className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                                                    {step.step}
                                                </span>
                                                <span>{step.title}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed pl-7">
                                                {step.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link href="/academy/courses" className="block pt-2">
                                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-bold font-mono text-xs h-11">
                                    Enroll in Prerequisites →
                                </Button>
                            </Link>
                        </GlassCard>
                    ) : (
                        <GlassCard className="p-12 text-center text-xs font-mono text-gray-400">
                            Select a career pathway on the left to view requirements.
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
}
