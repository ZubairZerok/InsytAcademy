// app/(dashboard)/research/page.tsx
"use client";

import { useState } from "react";
import { BAU_RESEARCH_PAPERS } from "@/lib/bau-data/research-papers";
import { BAU_FACULTIES } from "@/lib/bau-data/faculties";
import type { BAUResearchPaper } from "@/types/bau";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
    FileText, Microscope, Sparkles, BookOpen, Search,
    ExternalLink, CheckCircle2, ChevronRight, Award, Database, Tag
} from "lucide-react";

export default function BAUResearchOSPage() {
    const [selectedFaculty, setSelectedFaculty] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedPaper, setSelectedPaper] = useState<BAUResearchPaper | null>(BAU_RESEARCH_PAPERS[0]);

    const filteredPapers = BAU_RESEARCH_PAPERS.filter(p => {
        const matchesFaculty = selectedFaculty === "ALL" || p.facultyCode === selectedFaculty;
        const matchesSearch = searchQuery === "" ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.keyThemes.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFaculty && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-neon-green uppercase tracking-wider">
                        BAU RESEARCH INTELLIGENCE // RESEARCH OS
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <FileText className="h-8 w-8 text-emerald-600 dark:text-neon-green" />
                    BAU Research & Thesis Intelligence OS
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    Explore peer-reviewed publications by Bangladesh Agricultural University faculty, discover empirical research gaps for undergraduate/MS theses, and inspect statistical methodologies.
                </p>
            </div>

            {/* Statistics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "INDEXED BAU PAPERS", value: "480+ Publications", icon: BookOpen, color: "text-emerald-500" },
                    { label: "SCOPUS / WOS VENUES", value: "Q1 & Q2 Journals", icon: Award, color: "text-amber-500" },
                    { label: "THESIS GAP DISCOVERY", value: "Gemini Assisted", icon: Sparkles, color: "text-purple-500" },
                ].map(({ label, value, icon: Icon, color }) => (
                    <GlassCard key={label} className="p-5 flex items-center gap-4 border-black/[0.06] dark:border-white/10">
                        <div className="h-11 w-11 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                            <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div>
                            <div className="text-lg font-bold font-mono text-gray-900 dark:text-white">{value}</div>
                            <div className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase">{label}</div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Main Research Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Papers Feed */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Search & Faculty Filter Bar */}
                    <div className="p-4 rounded-2xl bg-white/95 dark:bg-agri-dark/80 border border-black/[0.08] dark:border-white/10 space-y-3">
                        <div className="relative">
                            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search publications by keyword, author, or methodology..."
                                className="w-full bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pt-1">
                            <button
                                onClick={() => setSelectedFaculty("ALL")}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all shrink-0 ${
                                    selectedFaculty === "ALL"
                                        ? "bg-black/10 dark:bg-white/15 text-gray-900 dark:text-white"
                                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                                All Faculties
                            </button>
                            {BAU_FACULTIES.map(fac => (
                                <button
                                    key={fac.code}
                                    onClick={() => setSelectedFaculty(fac.code)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 ${
                                        selectedFaculty === fac.code
                                            ? "bg-emerald-500/20 text-emerald-800 dark:text-neon-green font-bold"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    {fac.shortName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Paper Cards List */}
                    <div className="space-y-4">
                        {filteredPapers.map((paper) => {
                            const isSelected = selectedPaper?.id === paper.id;
                            return (
                                <GlassCard
                                    key={paper.id}
                                    onClick={() => setSelectedPaper(paper)}
                                    className={`p-6 space-y-3 cursor-pointer transition-all border-black/[0.08] dark:border-white/10 ${
                                        isSelected
                                            ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(0,255,148,0.15)]"
                                            : "hover:border-emerald-500/30"
                                    }`}
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-neon-green border border-emerald-500/20 uppercase">
                                            {paper.facultyCode} · {paper.departmentCode}
                                        </span>
                                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                            {paper.year} · {paper.journalOrVenue}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                                        {paper.title}
                                    </h3>

                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                        Authors: <strong className="text-gray-700 dark:text-gray-300">{paper.authors.map(a => a.name).join(", ")}</strong>
                                    </div>

                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                                        {paper.abstract}
                                    </p>

                                    {/* Themes Tags */}
                                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/[0.04] dark:border-white/5">
                                        {paper.keyThemes.map((theme, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded bg-black/[0.02] dark:bg-white/[0.04] text-[10px] font-mono text-gray-600 dark:text-gray-400">
                                                #{theme}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                </div>

                {/* Paper Deep Detail & Research Gaps Inspector */}
                <div className="space-y-4">
                    {selectedPaper ? (
                        <GlassCard className="p-6 md:p-8 space-y-6 border-emerald-500/30 bg-white/95 dark:bg-agri-dark/90 sticky top-20">
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-neon-green uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                    Thesis Research Gap Matrix
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                                    {selectedPaper.title}
                                </h3>
                                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                    DOI: {selectedPaper.doi || "Indexed in Scopus"} · Citations: {selectedPaper.citationCount}
                                </p>
                            </div>

                            {/* Methodology Stack */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-mono font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <Microscope className="h-3.5 w-3.5 text-blue-500" />
                                    Empirical Methodology Applied
                                </h4>
                                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 font-mono">
                                    {selectedPaper.methodology.map((m, idx) => (
                                        <li key={idx} className="flex items-start gap-2 p-2 rounded bg-black/[0.02] dark:bg-black/30">
                                            <span className="text-blue-500 font-bold">›</span>
                                            <span>{m}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Research Gap Hints */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Identified Research Gaps for BAU Theses
                                </h4>
                                <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {selectedPaper.researchGaps.map((gap, idx) => (
                                        <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                            <span className="text-amber-500 font-bold">💡</span>
                                            <span>{gap}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </GlassCard>
                    ) : (
                        <GlassCard className="p-12 text-center text-xs font-mono text-gray-400">
                            Select a research paper on the left to inspect literature matrix and gaps.
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
}
