import { getUserCourses } from "@/actions/get-user-courses";
import { getCatalogCourses } from "@/actions/get-courses";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";
import { Suspense } from "react";
import {
    Terminal,
    PlayCircle,
    CheckCircle,
    BookOpen,
    ArrowRight,
    Compass,
    Globe2,
    Layers,
    Cpu,
    ChevronRight,
    Binary
} from "lucide-react";

import { AcademyHero } from "@/components/academy/academy-hero";
import { getUserBadges } from "@/actions/badges";
import { BadgeShowcase } from "@/components/gamification/badge-showcase";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const GIS_SLUGS = [
    "gis-spatial-foundations",
    "gis-analysis-remote-sensing",
    "gis-engineering-cloud",
];

const TRACK_COLORS: Record<string, { badge: string; border: string; accent: string; bar: string; category: string }> = {
    "gis-spatial-foundations": {
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        border: "border-emerald-500/30 hover:border-emerald-500/60",
        accent: "text-emerald-400",
        bar: "bg-emerald-400",
        category: "STAGE 01 • FOUNDATIONS",
    },
    "gis-analysis-remote-sensing": {
        badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        border: "border-cyan-500/30 hover:border-cyan-500/60",
        accent: "text-cyan-400",
        bar: "bg-cyan-400",
        category: "STAGE 02 • ANALYST",
    },
    "gis-engineering-cloud": {
        badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        border: "border-purple-500/30 hover:border-purple-500/60",
        accent: "text-purple-400",
        bar: "bg-purple-400",
        category: "STAGE 03 • CLOUD ENGINEER",
    },
    "r-agri-data-bau": {
        badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        border: "border-cyan-500/30 hover:border-cyan-500/60",
        accent: "text-cyan-400",
        bar: "bg-cyan-400",
        category: "STATISTICAL COMPUTING",
    },
    "ml-masterclass": {
        badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        border: "border-purple-500/30 hover:border-purple-500/60",
        accent: "text-purple-400",
        bar: "bg-purple-400",
        category: "PRODUCTION AI",
    },
};

export default async function AcademyPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login?next=/academy");
    }

    const [enrolledCourses, catalogCourses, badges] = await Promise.all([
        getUserCourses(),
        getCatalogCourses(),
        getUserBadges(),
    ]);

    const enrolledIds = new Set(enrolledCourses.map((c) => c.id));
    const unenrolledCourses = catalogCourses.filter((c) => !enrolledIds.has(c.id));

    // Check GIS pathway progress
    const gisEnrolled = enrolledCourses.filter((c) => GIS_SLUGS.includes(c.slug));
    const hasGisEnrollment = gisEnrolled.length > 0;

    return (
        <div className="space-y-12 pb-20">
            {/* Executive Scholar Portfolio Greeting */}
            <Suspense
                fallback={
                    <div
                        className="h-36 rounded-2xl border border-white/10 bg-agri-dark/60 animate-pulse"
                        aria-label="Loading portfolio stats..."
                    />
                }
            >
                <AcademyHero />
            </Suspense>

            {/* ══════════════════════════════════════════════════════════════════
                3-STAGE GIS SPECIALIZATION PROGRESSION PIPELINE
                Displayed if user is taking the geospatial pathway
               ══════════════════════════════════════════════════════════════════ */}
            {hasGisEnrollment && (
                <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/20 via-black/40 to-black/60 p-6 md:p-8 space-y-5 shadow-[0_0_40px_rgba(0,255,148,0.03)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                                <Compass className="h-4 w-4" />
                                <span>FLAGSHIP GEOSPATIAL PATHWAY PROGRESSION</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                                <Globe2 className="h-5 w-5 text-neon-green" />
                                <span>3-Stage Earth Observation Mastery Track</span>
                            </h2>
                        </div>
                        <div className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl shrink-0">
                            <span>{gisEnrolled.filter((c) => c.progress === 100).length} of 3 Stages Completed</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                slug: "gis-spatial-foundations",
                                stage: "STAGE 01",
                                title: "Spatial Literacy & GIS Foundations",
                                icon: Globe2,
                                color: "emerald",
                            },
                            {
                                slug: "gis-analysis-remote-sensing",
                                stage: "STAGE 02",
                                title: "GIS Analysis & Remote Sensing",
                                icon: Layers,
                                color: "cyan",
                            },
                            {
                                slug: "gis-engineering-cloud",
                                stage: "STAGE 03",
                                title: "Geospatial Engineering & Cloud GIS",
                                icon: Cpu,
                                color: "purple",
                            },
                        ].map((st) => {
                            const enrolled = enrolledCourses.find((c) => c.slug === st.slug);
                            const isDone = enrolled?.progress === 100;
                            const isStarted = (enrolled?.progress || 0) > 0;
                            const Icon = st.icon;

                            return (
                                <Link key={st.slug} href={enrolled?.nextLessonSlug ? `/academy/${st.slug}/${enrolled.nextLessonSlug}` : `/academy/${st.slug}`}>
                                    <div
                                        className={`rounded-xl border p-4 transition-all group relative overflow-hidden ${
                                            isDone
                                                ? "border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500/70"
                                                : isStarted
                                                ? "border-neon-green/40 bg-black/60 hover:border-neon-green"
                                                : enrolled
                                                ? "border-white/15 bg-black/40 hover:border-white/30"
                                                : "border-white/5 bg-white/[0.02] opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                                                <Icon className="h-3.5 w-3.5 text-neon-green" />
                                                <span>{st.stage}</span>
                                            </div>
                                            {isDone ? (
                                                <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    <CheckCircle className="h-3 w-3" /> MASTERED
                                                </span>
                                            ) : isStarted ? (
                                                <span className="text-[10px] font-mono font-bold text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/20">
                                                    {enrolled?.progress}% COMPLETE
                                                </span>
                                            ) : enrolled ? (
                                                <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                                                    ENROLLED
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                                                    AVAILABLE
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-sm font-bold text-white group-hover:text-neon-green transition-colors font-mono leading-snug line-clamp-1 mb-3">
                                            {st.title}
                                        </h3>

                                        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className={`h-full transition-all duration-500 ${
                                                    isDone ? "bg-emerald-400" : "bg-neon-green"
                                                }`}
                                                style={{ width: `${enrolled?.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                PRIMARY FEATURE: MY ENROLLED COURSES (PROGRESS COCKPIT)
               ══════════════════════════════════════════════════════════════════ */}
            {enrolledCourses.length > 0 ? (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
                        <div>
                            <SectionHeading
                                title="My Enrolled Protocols"
                                subtitle="GRANULAR PROGRESS ACROSS ACTIVE CURRICULA"
                            />
                        </div>
                        <div className="text-xs font-mono text-gray-400">
                            <span className="text-neon-green font-bold">{enrolledCourses.length}</span> ACTIVE PROTOCOLS
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {enrolledCourses.map((course) => {
                            const track = TRACK_COLORS[course.slug] || {
                                badge: "bg-neon-green/10 text-neon-green border-neon-green/30",
                                border: "border-neon-green/30 hover:border-neon-green/60",
                                accent: "text-neon-green",
                                bar: "bg-neon-green",
                                category: "LEARNING PROTOCOL",
                            };

                            const isCompleted = course.progress === 100;
                            const resumeUrl = course.nextLessonSlug
                                ? `/academy/${course.slug}/${course.nextLessonSlug}`
                                : `/academy/${course.slug}`;

                            return (
                                <GlassCard
                                    key={course.id}
                                    className={`relative flex flex-col justify-between p-6 md:p-7 transition-all duration-300 group border ${track.border} bg-black/50 hover:bg-black/70 shadow-2xl`}
                                >
                                    <div className="space-y-5">
                                        {/* Cover Photo Header with Status Overlay */}
                                        {course.thumbnail_url && (
                                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                                <img
                                                    src={course.thumbnail_url}
                                                    alt={course.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                                {/* Top floating badges */}
                                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider backdrop-blur-md ${track.badge}`}>
                                                        {track.category}
                                                    </span>
                                                    {isCompleted ? (
                                                        <span className="flex items-center gap-1.5 bg-emerald-500/90 text-black px-2.5 py-1 rounded-md font-mono text-[10px] font-bold shadow-lg">
                                                            <CheckCircle className="h-3.5 w-3.5" /> MASTERED
                                                        </span>
                                                    ) : (
                                                        <span className="bg-black/80 backdrop-blur-md text-neon-green border border-neon-green/30 px-2.5 py-1 rounded-md font-mono text-[10px] font-bold">
                                                            {course.progress}% PROGRESS
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Bottom bar inside image */}
                                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-gray-300">
                                                    <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                                                        <Layers className="h-3.5 w-3.5 text-neon-green" />
                                                        {course.completedModulesCount || 0} / {course.totalModules || 0} Modules
                                                    </span>
                                                    <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                                                        {course.completedLessons} / {course.totalLessons} Lessons
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Course Title & Description */}
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className={`text-xl font-bold text-white transition-colors font-mono leading-snug group-hover:${track.accent}`}>
                                                    {course.title}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
                                                {course.description || "Specialized academic and research training protocol."}
                                            </p>
                                        </div>

                                        {/* Resume Milestone Box */}
                                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                                            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                                                <span className="uppercase tracking-wider font-semibold text-gray-400">
                                                    {isCompleted ? "CURRICULUM STATUS" : `CURRENT MODULE ${course.currentModuleIndex || 1} OF ${course.totalModules || 1}`}
                                                </span>
                                                <span className={`font-bold ${track.accent}`}>
                                                    {course.progress}%
                                                </span>
                                            </div>

                                            {isCompleted ? (
                                                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                                                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                                                    <span>All {course.totalLessons} lessons verified. Protocol complete.</span>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <div className="text-xs font-mono font-bold text-white flex items-center gap-2 truncate">
                                                        <PlayCircle className="h-3.5 w-3.5 text-neon-green shrink-0" />
                                                        <span className="truncate">{course.nextLessonTitle || "Resume Next Lesson"}</span>
                                                    </div>
                                                    {course.currentModuleTitle && (
                                                        <div className="text-[11px] font-mono text-gray-400 truncate">
                                                            Module: {course.currentModuleTitle}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Progress Bar */}
                                            <div className="pt-1">
                                                <div
                                                    className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5"
                                                    role="progressbar"
                                                    aria-valuenow={course.progress}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-label={`${course.title} progress: ${course.progress}%`}
                                                >
                                                    <div
                                                        className={`h-full ${track.bar} transition-all duration-500`}
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Module-by-Module Progress Visualizer Segments */}
                                        {course.modulesProgress && course.modulesProgress.length > 0 && (
                                            <div className="space-y-1.5 pt-1">
                                                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase">
                                                    <span>Module Milestones</span>
                                                    <span>{course.completedModulesCount} Completed</span>
                                                </div>
                                                <div className="flex gap-1 w-full">
                                                    {course.modulesProgress.map((m) => (
                                                        <div
                                                            key={m.id}
                                                            title={`Module ${m.order_index}: ${m.title} (${m.completedLessons}/${m.totalLessons} lessons)`}
                                                            className={`h-2 flex-1 rounded-sm transition-all duration-300 ${
                                                                m.isCompleted
                                                                    ? `${track.bar} shadow-[0_0_6px_rgba(0,255,148,0.4)]`
                                                                    : m.isCurrent
                                                                    ? "bg-white/40 animate-pulse border border-neon-green"
                                                                    : "bg-white/10"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-6 border-t border-white/5 mt-6 flex flex-col sm:flex-row items-center gap-3">
                                        <Link href={resumeUrl} className="w-full sm:flex-1">
                                            <Button className="w-full justify-between bg-neon-green text-agri-black hover:bg-neon-green/90 font-mono text-xs font-bold h-11 rounded-xl">
                                                <span className="truncate">
                                                    {isCompleted ? "REVIEW PROTOCOL" : "CONTINUE LESSON"}
                                                </span>
                                                <PlayCircle className="h-4 w-4 shrink-0" />
                                            </Button>
                                        </Link>

                                        <Link href={`/academy/${course.slug}`} className="w-full sm:w-auto">
                                            <Button
                                                variant="outline"
                                                className="w-full border-white/10 hover:border-white/30 text-white font-mono text-xs font-semibold h-11 px-4 rounded-xl"
                                            >
                                                <BookOpen className="h-4 w-4 mr-1.5 text-gray-400" />
                                                Syllabus
                                            </Button>
                                        </Link>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Empty state directing user to initialize their first protocol */
                <GlassCard className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto border-white/10">
                    <div className="h-16 w-16 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mb-6 text-neon-green shadow-[0_0_30px_rgba(0,255,148,0.15)]">
                        <Terminal className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-mono">No Active Learning Protocols</h3>
                    <p className="max-w-md text-gray-400 text-sm leading-relaxed mb-8">
                        You have not initialized any learning protocols yet. Select an academic curriculum below to begin your spatial data science or machine learning training.
                    </p>
                    <Link href="/academy/courses">
                        <Button className="bg-neon-green hover:bg-neon-green/90 text-black font-mono font-bold h-12 px-8 rounded-xl text-sm shadow-[0_0_20px_rgba(0,255,148,0.3)]">
                            EXPLORE ALL PROTOCOLS
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </GlassCard>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                DISCOVER OTHER PROTOCOLS (UNENROLLED COURSES)
               ══════════════════════════════════════════════════════════════════ */}
            {unenrolledCourses.length > 0 && (
                <div className="space-y-6 pt-4">
                    <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                                <Binary className="h-3.5 w-3.5" />
                                <span>AVAILABLE CURRICULA</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white font-mono">
                                Expand Your Research Protocols
                            </h2>
                        </div>
                        <Link href="/academy/courses">
                            <Button variant="ghost" className="text-xs font-mono text-gray-400 hover:text-neon-green">
                                View Catalog <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {unenrolledCourses.map((course) => (
                            <GlassCard
                                key={course.id}
                                className="flex flex-col justify-between p-5 hover:border-cyan-500/40 transition-all group"
                            >
                                <div className="space-y-4">
                                    {course.thumbnail_url && (
                                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                            <img
                                                src={course.thumbnail_url}
                                                alt={course.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors font-mono leading-snug">
                                            {course.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                                            {course.description || "Comprehensive academic research protocol."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between text-xs font-mono text-gray-400 pt-2 border-t border-white/5">
                                        <span>{course.total_lessons} LESSONS</span>
                                        <span className="text-neon-green font-bold">OPEN ACCESS</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto">
                                    <Link href={`/academy/${course.slug}`}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between group-hover:bg-cyan-500 group-hover:text-black font-mono text-xs font-bold transition-all h-10"
                                        >
                                            <span>INITIALIZE PROTOCOL</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}

            {/* Insignia & Badge Competencies */}
            <BadgeShowcase badges={badges} />
        </div>
    );
}
