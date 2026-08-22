// app/(dashboard)/academy/courses/page.tsx
"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { BAU_COURSES } from "@/lib/bau-data/courses";
import { BAU_FACULTIES } from "@/lib/bau-data/faculties";
import type { BAUCourse, BAUFacultyCode } from "@/types/bau";
import {
    BookOpen, Mic, Sparkles, Filter, Search,
    CheckCircle2, ArrowRight, Layers, GraduationCap
} from "lucide-react";
import Link from "next/link";

export default function BAUCourseCatalogPage() {
    const [selectedFaculty, setSelectedFaculty] = useState<string>("ALL");
    const [selectedLevel, setSelectedLevel] = useState<number | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredCourses = BAU_COURSES.filter((course) => {
        const matchesFaculty = selectedFaculty === "ALL" || course.facultyCode === selectedFaculty;
        const matchesLevel = selectedLevel === "ALL" || course.level === selectedLevel;
        const matchesSearch = searchQuery === "" ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFaculty && matchesLevel && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-neon-green uppercase tracking-wider">
                        BAU ACADEMIC CURRICULUM // COURSE OS
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-emerald-600 dark:text-neon-green" />
                    BAU Course & Syllabus Catalog
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    Explore verified curricula across all 6 faculties. Every course features structured syllabus modules, LaTeX mathematical derivations, and Gemini AI course tutors.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-white/95 dark:bg-agri-dark/80 border border-black/[0.08] dark:border-white/10 space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search course code, title, or topic..."
                            className="w-full bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* Level Selector */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                        <button
                            onClick={() => setSelectedLevel("ALL")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                                selectedLevel === "ALL"
                                    ? "bg-emerald-600 dark:bg-neon-green text-white dark:text-black"
                                    : "bg-black/[0.03] dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            ALL LEVELS
                        </button>
                        {([1, 2, 3, 4] as const).map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setSelectedLevel(lvl)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                                    selectedLevel === lvl
                                        ? "bg-emerald-600 dark:bg-neon-green text-white dark:text-black font-bold"
                                        : "bg-black/[0.03] dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                                Level {lvl}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Faculty Tabs */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-black/[0.04] dark:border-white/5">
                    <button
                        onClick={() => setSelectedFaculty("ALL")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 transition-all ${
                            selectedFaculty === "ALL"
                                ? "bg-black/10 dark:bg-white/15 text-gray-900 dark:text-white"
                                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        ALL 6 FACULTIES
                    </button>
                    {BAU_FACULTIES.map((fac) => (
                        <button
                            key={fac.code}
                            onClick={() => setSelectedFaculty(fac.code)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-all ${
                                selectedFaculty === fac.code
                                    ? "bg-emerald-500/20 text-emerald-800 dark:text-neon-green font-bold border border-emerald-500/30"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            {fac.shortName} ({fac.code})
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <GlassCard
                        key={course.id}
                        className="p-6 flex flex-col justify-between gap-6 hover:border-emerald-500/40 transition-all group border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-emerald-800 dark:text-neon-green bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                                    {course.code}
                                </span>
                                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                                    Level {course.level} · Sem {course.semester}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-neon-green transition-colors leading-snug">
                                    {course.title}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                    {course.description}
                                </p>
                            </div>

                            {/* Credit & Module Breakdown */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.04] dark:border-white/5 font-mono text-xs text-gray-500 dark:text-gray-400">
                                <div>
                                    <span className="text-[10px] block">TOTAL CREDITS</span>
                                    <strong className="text-gray-900 dark:text-white">
                                        {course.credits.totalCredits}.0 ({course.credits.theoryCredits}T + {course.credits.practicalCredits}P)
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-[10px] block">SYLLABUS MODULES</span>
                                    <strong className="text-gray-900 dark:text-white">
                                        {course.modules.length} Core Modules
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2">
                            <Link href={`/academy/courses/${course.slug || course.code.toLowerCase().replace(/\s+/g, "-")}`} className="flex-1">
                                <Button className="w-full bg-emerald-700 dark:bg-white text-white dark:text-black hover:bg-emerald-800 dark:hover:bg-gray-100 font-mono text-xs font-bold h-10">
                                    Open Syllabus →
                                </Button>
                            </Link>
                            <Link href={`/academy/viva?course=${encodeURIComponent(course.code)}`}>
                                <Button variant="outline" className="font-mono text-xs h-10 px-3 hover:border-purple-500 hover:text-purple-600" title="Start Spoken AI Viva for this course">
                                    <Mic className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
