// app/(dashboard)/academy/courses/[slug]/page.tsx
"use client";

import { notFound, useParams } from "next/navigation";
import { getCourseBySlug, getCourseByCode, BAU_COURSES } from "@/lib/bau-data/courses";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SyllabusTutorDrawer } from "@/components/tutor/syllabus-tutor-drawer";
import {
    BookOpen, Layers, Clock, Award, CheckCircle2,
    AlertCircle, Sparkles, Mic, ChevronLeft, FileText, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function BAUCourseWorkspacePage() {
    const params = useParams();
    const slug = (params?.slug as string) || "";

    const course = getCourseBySlug(slug) || getCourseByCode(slug) || BAU_COURSES[0];

    return (
        <div className="space-y-8 pb-24 max-w-5xl mx-auto">
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between">
                <Link href="/academy/courses">
                    <Button variant="ghost" size="sm" className="font-mono text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white p-0">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Course Catalog
                    </Button>
                </Link>
                <span className="font-mono text-xs text-emerald-700 dark:text-neon-green">
                    Provenance: {course.provenance} ({course.sourceReference || "BAU Ordinance"})
                </span>
            </div>

            {/* Course Hero Header */}
            <GlassCard className="p-6 md:p-8 space-y-6 relative overflow-hidden border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                <div className="absolute top-0 right-0 w-80 h-80 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-emerald-500/10 text-emerald-800 dark:text-neon-green border border-emerald-500/20">
                            {course.code}
                        </span>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            Faculty of {course.facultyCode} · Level {course.level}, Semester {course.semester}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
                        {course.title}
                    </h1>

                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                        {course.description}
                    </p>
                </div>

                {/* Course Metadata HUD */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-black/[0.06] dark:border-white/10 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase block">TOTAL CREDITS</span>
                        <strong className="text-base text-gray-900 dark:text-white">{course.credits.totalCredits}.0 Credits</strong>
                        <span className="text-[10px] text-gray-500 block">{course.credits.theoryCredits} Theory + {course.credits.practicalCredits} Practical</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase block">HOURS / WEEK</span>
                        <strong className="text-base text-gray-900 dark:text-white">{course.credits.theoryHoursPerWeek + course.credits.practicalHoursPerWeek} Hours</strong>
                        <span className="text-[10px] text-gray-500 block">Lecture & Field Lab</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase block">ENROLLED COHORT</span>
                        <strong className="text-base text-emerald-700 dark:text-neon-green">{course.enrolledCount || 140} Students</strong>
                        <span className="text-[10px] text-gray-500 block">Avg Grade: {course.averageGrade || "3.50"}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase block">AI TUTOR STATUS</span>
                        <strong className="text-base text-purple-600 dark:text-purple-400">Gemini Ready</strong>
                        <span className="text-[10px] text-gray-500 block">LaTeX Grounded</span>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href={`/academy/viva?course=${encodeURIComponent(course.code)}`}>
                        <Button className="bg-neon-green text-black hover:bg-neon-green/90 font-bold font-mono text-xs h-11 px-5 shadow-[0_0_15px_rgba(0,255,148,0.25)]">
                            <Mic className="h-4 w-4 mr-2" />
                            LAUNCH AI VIVA ROOM
                        </Button>
                    </Link>

                    <Link href="/academy/assessment">
                        <Button variant="outline" className="font-mono text-xs text-gray-700 dark:text-gray-300 h-11 px-5">
                            <Award className="h-4 w-4 mr-2 text-cyan-500" />
                            10/20/70 EXAM LAB PREP
                        </Button>
                    </Link>
                </div>
            </GlassCard>

            {/* Prerequisites Alert (If present) */}
            {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300 font-mono">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <strong className="font-bold uppercase">Official Prerequisite Notice:</strong>{" "}
                        {course.prerequisites[0].courseCode} ({course.prerequisites[0].courseTitle}) with minimum grade {course.prerequisites[0].requiredGrade}.{" "}
                        <span className="text-gray-600 dark:text-gray-300">{course.prerequisites[0].reason}</span>
                    </div>
                </div>
            )}

            {/* Learning Objectives */}
            <GlassCard className="p-6 md:p-8 space-y-4 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                <h3 className="font-mono text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-neon-green" />
                    Course Learning Objectives (CLO)
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {course.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 p-3 rounded-lg bg-black/[0.02] dark:bg-black/30 border border-black/[0.04] dark:border-white/5">
                            <span className="text-emerald-600 dark:text-neon-green font-bold shrink-0">{i + 1}.</span>
                            <span>{obj}</span>
                        </li>
                    ))}
                </ul>
            </GlassCard>

            {/* Syllabus Modules Breakdown */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-mono text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Layers className="h-4 w-4 text-emerald-600 dark:text-neon-green" />
                        Verified Syllabus Modules ({course.modules.length} Modules)
                    </h3>
                </div>

                <div className="space-y-4">
                    {course.modules.map((module) => (
                        <GlassCard key={module.id} className="p-6 space-y-4 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-mono text-emerald-800 dark:text-neon-green font-bold uppercase">
                                        MODULE {module.moduleNumber}
                                    </span>
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                                        {module.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {module.description}
                                    </p>
                                </div>
                            </div>

                            {/* Topics List */}
                            <div className="space-y-2.5 pt-2 border-t border-black/[0.04] dark:border-white/5">
                                {module.topics.map((topic) => (
                                    <div
                                        key={topic.id}
                                        className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <strong className="text-gray-900 dark:text-white font-mono">{topic.title}</strong>
                                                {topic.isKeyExamTopic && (
                                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold uppercase">
                                                        Exam Focus
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
                                                {topic.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] font-mono text-gray-400">
                                                {topic.estimatedMinutes} Mins
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Practical Modules (If available) */}
            {course.practicalModules && course.practicalModules.length > 0 && (
                <GlassCard className="p-6 md:p-8 space-y-4 border-blue-500/30 bg-blue-500/5">
                    <h3 className="font-mono text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Practical Laboratory Exercises (1 Credit / 3 Hours Lab)
                    </h3>
                    <div className="space-y-2">
                        {course.practicalModules[0].topics.map((pTopic) => (
                            <div key={pTopic.id} className="p-3 rounded-lg bg-black/[0.02] dark:bg-black/30 border border-black/[0.04] dark:border-white/5 text-xs">
                                <strong className="text-gray-900 dark:text-white block font-mono">{pTopic.title}</strong>
                                <span className="text-gray-600 dark:text-gray-300">{pTopic.description}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            )}

            {/* Recommended References */}
            <GlassCard className="p-6 space-y-3 border-black/[0.06] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                <h4 className="font-mono text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Recommended Textbooks & Ordinance References
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {course.recommendedBooks.map((book, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-700 dark:text-neon-green">📖</span>
                            <span>{book}</span>
                        </li>
                    ))}
                </ul>
            </GlassCard>

            {/* Embedded Gemini Syllabus Tutor Drawer */}
            <SyllabusTutorDrawer
                courseCode={course.code}
                courseTitle={course.title}
            />
        </div>
    );
}
