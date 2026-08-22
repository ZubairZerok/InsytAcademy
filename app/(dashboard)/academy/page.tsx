// app/(dashboard)/academy/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
    Sparkles, Calendar, Clock, AlertTriangle, PlayCircle, Mic,
    Calculator, BookOpen, Flame,
    FileText, GraduationCap, Microscope, ChevronRight, Zap, Target
} from "lucide-react";
import { BAU_COURSES, getCoursesByLevelSemester } from "@/lib/bau-data/courses";
import { BAU_SAMPLE_ROUTINE_ENTRIES, BAU_OFFICIAL_NOTICES } from "@/lib/bau-data/routines";

export default function BAUAcademicDashboardPage() {
    const [profile, setProfile] = useState({
        fullName: "Hasan Zubair",
        studentId: "2108102",
        facultyCode: "FAERS",
        facultyName: "Faculty of Agricultural Economics & Rural Sociology",
        departmentCode: "AE",
        departmentName: "Agricultural Economics",
        degreeName: "B.Sc. Agricultural Economics (Hons.)",
        level: 2,
        semester: 1,
        targetCGPA: 3.75,
        currentCGPA: 3.52,
        academicGoal: "BCS Agriculture / Technical Cadre",
    });

    const [todaySchedule] = useState(
        BAU_SAMPLE_ROUTINE_ENTRIES.filter(e => e.dayOfWeek === "Sunday" && e.level === 2 && e.facultyCode === "FAERS")
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("insyt_bau_profile");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setProfile(prev => ({ ...prev, ...parsed }));
                } catch {
                    // ignore
                }
            }
        }
    }, []);

    const enrolledCourses = getCoursesByLevelSemester(profile.level, profile.semester, profile.facultyCode);
    const activeCourses = enrolledCourses.length > 0 ? enrolledCourses : BAU_COURSES.slice(0, 3);

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* ═══════════════════════════════════════════════════════
                1. COMMAND CENTER HERO TELEMETRY BAR
               ═══════════════════════════════════════════════════════ */}
            <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/70 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-800 dark:text-neon-green">
                                <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-neon-green animate-ping" />
                                BAU ACADEMIC OPERATING SYSTEM
                            </span>
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                {profile.facultyCode} &bull; {profile.departmentCode} &bull; LEVEL {profile.level} &middot; SEMESTER {profile.semester}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-sans text-gray-900 dark:text-white">
                            Welcome back, <span className="text-emerald-700 dark:text-neon-green">{profile.fullName}</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-2xl">
                            {profile.degreeName} · Target CGPA: <strong className="text-gray-900 dark:text-white font-mono">{profile.targetCGPA}</strong> (Current: <span className="text-emerald-700 dark:text-neon-green font-mono">{profile.currentCGPA}</span>) · Goal: <span className="text-gray-700 dark:text-gray-300 font-medium">{profile.academicGoal}</span>
                        </p>
                    </div>

                    {/* Quick Profile Modifier Button */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link href="/onboarding">
                            <Button variant="outline" className="border-black/10 dark:border-white/10 hover:border-emerald-500 text-xs font-mono text-gray-700 dark:text-gray-300 h-10 px-4">
                                <GraduationCap className="h-4 w-4 mr-2 text-emerald-600 dark:text-neon-green" />
                                CHANGE COHORT
                            </Button>
                        </Link>
                        <Link href="/academy/viva">
                            <Button className="bg-neon-green text-black hover:bg-neon-green/90 font-bold text-xs font-mono h-10 px-5 shadow-[0_0_15px_rgba(0,255,148,0.3)]">
                                <Mic className="h-4 w-4 mr-2" />
                                START AI VIVA
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Telemetry Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-black/[0.06] dark:border-white/10">
                    {[
                        { label: "ACADEMIC XP", value: "3,450 XP", sub: "Level 6 Sprout", icon: Zap, color: "text-amber-400" },
                        { label: "DAILY VIVA STREAK", value: "7 DAYS", sub: "Freeze Shield Active", icon: Flame, color: "text-orange-500" },
                        { label: "ACTIVE CREDITS", value: "19.0 CREDITS", sub: "6 Theory · 3 Practical", icon: BookOpen, color: "text-emerald-400" },
                        { label: "VIVA READINESS", value: "84%", sub: "Above Class Average", icon: Target, color: "text-cyan-400" },
                    ].map(({ label, value, sub, icon: Icon, color }) => (
                        <div key={label} className="bg-black/[0.02] dark:bg-black/40 rounded-xl p-3.5 border border-black/[0.04] dark:border-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
                                <Icon className={`h-4 w-4 ${color}`} />
                            </div>
                            <div className="text-lg md:text-xl font-bold font-mono text-gray-900 dark:text-white">{value}</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono truncate">{sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                2. PRIMARY ACTIONS HUD: TODAY'S SCHEDULE & AI SPRINT
               ═══════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1 & 2: Today's Academic Schedule */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-emerald-600 dark:text-neon-green" />
                            <h2 className="text-lg font-bold font-mono tracking-tight text-gray-900 dark:text-white">
                                TODAY&apos;S SCHEDULE (SUNDAY)
                            </h2>
                        </div>
                        <Link href="/academy/schedule" className="text-xs font-mono text-emerald-700 dark:text-neon-green hover:underline flex items-center gap-1">
                            Full Timetable <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {todaySchedule.map((entry) => (
                            <GlassCard key={entry.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-all">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-emerald-800 dark:text-neon-green bg-emerald-500/10 dark:bg-neon-green/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                            {entry.courseCode}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                            {entry.type} · {entry.group}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{entry.courseTitle}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-mono">
                                        <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-bold">
                                            <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-neon-green" />
                                            {entry.startTime} – {entry.endTime}
                                        </span>
                                        <span>📍 {entry.room}</span>
                                        {entry.teacherName && <span>👨‍🏫 {entry.teacherName}</span>}
                                    </div>
                                </div>

                                <Link href={`/academy/courses/${entry.courseCode.toLowerCase().replace(/\s+/g, "-")}`}>
                                    <Button variant="outline" size="sm" className="font-mono text-xs text-emerald-800 dark:text-neon-green border-emerald-500/30 hover:bg-emerald-500/10">
                                        Open Syllabus
                                    </Button>
                                </Link>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Urgent Exam Alert Banner */}
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                                    Upcoming Continuous Assessment
                                </span>
                                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                                    In 2 Days
                                </span>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                <strong>AAS 2107 Class Test #1 (10 Marks)</strong> is scheduled for Tuesday at 11:15 AM in Gallery 204. Topics: Probability Distributions & Hypothesis Testing.
                            </p>
                        </div>
                        <Link href="/academy/assessment">
                            <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-400 font-bold text-xs font-mono shrink-0">
                                Prepare
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Column 3: Gemini Remedial Sprint & AI Viva Launcher */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-600 dark:text-neon-green" />
                        <h2 className="text-lg font-bold font-mono tracking-tight text-gray-900 dark:text-white">
                            GEMINI REMEDIAL SPRINT
                        </h2>
                    </div>

                    {/* AI Prerequisite Diagnosis Card */}
                    <GlassCard className="p-5 space-y-4 border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent">
                        <div className="space-y-2">
                            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-neon-green bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                                Prerequisite Weakness Detected
                            </span>
                            <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug">
                                Hypothesis Testing & Degrees of Freedom
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Gemini identified a conceptual gap in calculating pooled variance degrees of freedom from your recent viva session.
                            </p>
                        </div>

                        <div className="rounded-lg bg-black/[0.03] dark:bg-black/40 p-3 border border-black/[0.04] dark:border-white/5 space-y-1.5 font-mono text-xs">
                            <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                <span>REMEDIAL DURATION</span>
                                <span className="text-gray-900 dark:text-white font-bold">12 Minutes</span>
                            </div>
                            <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                <span>PREREQUISITE COURSE</span>
                                <span className="text-emerald-700 dark:text-neon-green">AAS 1101 (Probability)</span>
                            </div>
                            <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                <span>POTENTIAL XP GAIN</span>
                                <span className="text-amber-600 dark:text-amber-400 font-bold">+120 Academic XP</span>
                            </div>
                        </div>

                        <Link href="/academy/courses/aas-2107-statistical-inference" className="block">
                            <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-bold font-mono text-xs h-10 shadow-[0_0_15px_rgba(0,255,148,0.25)]">
                                <PlayCircle className="h-4 w-4 mr-2" />
                                START 12-MIN SPRINT
                            </Button>
                        </Link>
                    </GlassCard>

                    {/* Quick AI Modules Navigation Card */}
                    <GlassCard className="p-5 space-y-3">
                        <h3 className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Specialized AI Laboratories
                        </h3>

                        <div className="grid grid-cols-1 gap-2">
                            <Link href="/academy/viva" className="flex items-center justify-between p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/5 hover:border-purple-500/40 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <Mic className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300">Live AI Viva Voce</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">ElevenLabs Oral Exam</div>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </Link>

                            <Link href="/academy/field-lab" className="flex items-center justify-between p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/5 hover:border-emerald-500/40 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-neon-green">
                                        <Microscope className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-neon-green">Field & Specimen AI</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">Gemini Multimodal Vision</div>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </Link>

                            <Link href="/academy/assessment" className="flex items-center justify-between p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/5 hover:border-cyan-500/40 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                        <Calculator className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300">10/20/70 Exam Lab</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">CGPA Target Simulator</div>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </Link>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                3. ACTIVE BAU ENROLLED COURSES & MASTERY
               ═══════════════════════════════════════════════════════ */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-neon-green" />
                        <h2 className="text-lg font-bold font-mono tracking-tight text-gray-900 dark:text-white">
                            ACTIVE ENROLLED COURSES (LEVEL {profile.level} · SEMESTER {profile.semester})
                        </h2>
                    </div>
                    <Link href="/academy/courses" className="text-xs font-mono text-emerald-700 dark:text-neon-green hover:underline">
                        View All Courses →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCourses.map((course) => (
                        <GlassCard key={course.id} className="p-6 flex flex-col justify-between gap-5 hover:border-emerald-500/40 transition-all group">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-neon-green bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                                        {course.code}
                                    </span>
                                    <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                                        {course.credits.totalCredits} Credits ({course.credits.theoryCredits}T + {course.credits.practicalCredits}P)
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-neon-green transition-colors leading-snug">
                                    {course.title}
                                </h3>

                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                    {course.description}
                                </p>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-3 pt-3 border-t border-black/[0.04] dark:border-white/5">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-mono text-gray-500 dark:text-gray-400">
                                        <span>MASTERY PROGRESS</span>
                                        <span className="font-bold text-gray-900 dark:text-white">68%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/10 dark:bg-black/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-600 dark:bg-neon-green rounded-full" style={{ width: "68%" }} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/academy/courses/${course.slug || course.code.toLowerCase().replace(/\s+/g, "-")}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full text-xs font-mono text-gray-700 dark:text-gray-300 group-hover:border-emerald-500 group-hover:text-emerald-700 dark:group-hover:text-neon-green">
                                            Syllabus & Modules
                                        </Button>
                                    </Link>
                                    <Link href={`/academy/viva?course=${encodeURIComponent(course.code)}`}>
                                        <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/90 font-mono text-xs px-3" title="Start AI Viva for this course">
                                            <Mic className="h-3.5 w-3.5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                4. BAU CAMPUS NOTICES & CIRCULARS FEED
               ═══════════════════════════════════════════════════════ */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-600 dark:text-neon-green" />
                        <h2 className="text-lg font-bold font-mono tracking-tight text-gray-900 dark:text-white">
                            OFFICIAL BAU CIRCULARS & NOTICES
                        </h2>
                    </div>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        Synchronized with Registrar & Dean&apos;s Office
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BAU_OFFICIAL_NOTICES.slice(0, 4).map((notice) => (
                        <GlassCard key={notice.id} className="p-5 space-y-2 border-black/[0.06] dark:border-white/5 hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center justify-between gap-2">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                                    notice.isUrgent
                                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                        : "bg-emerald-500/10 text-emerald-800 dark:text-neon-green border border-emerald-500/20"
                                }`}>
                                    {notice.category.replace(/_/g, " ")}
                                </span>
                                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                    {notice.date}
                                </span>
                            </div>

                            <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                                {notice.title}
                            </h3>

                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                                {notice.summary}
                            </p>

                            <div className="pt-2 text-[10px] font-mono text-gray-500 dark:text-gray-500">
                                Ref: {notice.officialRefNumber}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
