import { getCatalogCourses, CatalogCourse } from "@/actions/get-courses";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    PlayCircle,
    CheckCircle,
    BookOpen,
    ArrowRight,
    Sparkles,
    Globe2,
    Compass,
    Layers,
    Cpu,
    Binary
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courses & Learning Protocols",
    description: "Browse all available agri-science, geospatial intelligence, and machine learning courses.",
};

export const dynamic = "force-dynamic";

const GIS_PATHWAY_SLUGS = [
    "gis-spatial-foundations",
    "gis-analysis-remote-sensing",
    "gis-engineering-cloud",
];

const STAGE_META: Record<string, { stage: string; tag: string; level: string; color: string; border: string; accentBg: string; focus: string }> = {
    "gis-spatial-foundations": {
        stage: "STAGE 01",
        tag: "NO PREREQUISITES",
        level: "Foundations & Spatial Literacy",
        color: "text-emerald-400",
        border: "border-emerald-500/30 group-hover:border-emerald-500/60",
        accentBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        focus: "QGIS • CRS/WGS84 • Vector & Raster • Cartography",
    },
    "gis-analysis-remote-sensing": {
        stage: "STAGE 02",
        tag: "ANALYST CAPABILITY",
        level: "Spatial Analysis & Remote Sensing",
        color: "text-cyan-400",
        border: "border-cyan-500/30 group-hover:border-cyan-500/60",
        accentBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        focus: "Geoprocessing • DEM Terrain • NDVI & EVI • Image Classification",
    },
    "gis-engineering-cloud": {
        stage: "STAGE 03",
        tag: "ENTERPRISE MASTERY",
        level: "Geospatial Engineering & Cloud GIS",
        color: "text-purple-400",
        border: "border-purple-500/30 group-hover:border-purple-500/60",
        accentBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        focus: "PostGIS • Spatial SQL • GeoPandas • Google Earth Engine",
    },
};

export default async function CoursesPage() {
    const courses = await getCatalogCourses();

    // Separate GIS courses (strictly ordered 1 -> 2 -> 3) from other courses
    const gisCourses = GIS_PATHWAY_SLUGS
        .map((slug) => courses.find((c) => c.slug === slug))
        .filter((c): c is CatalogCourse => Boolean(c));

    const otherCourses = courses.filter((c) => !GIS_PATHWAY_SLUGS.includes(c.slug));

    return (
        <div className="space-y-12 pb-20">
            <SectionHeading title="Course Catalog" subtitle="ALL ACADEMIC & RESEARCH PROTOCOLS" />

            {courses.length === 0 ? (
                <GlassCard className="text-center py-20 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-400">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-mono">No Courses Published Yet</h3>
                    <p className="text-gray-400 max-w-md text-sm font-mono">
                        Courses are currently being updated by the instruction team. Check back shortly.
                    </p>
                </GlassCard>
            ) : (
                <>
                    {/* ══════════════════════════════════════════════════════════
                        DEDICATED GIS PATHWAY ROW (BLOCK-LEVEL ELEMENT)
                        Holds strictly the 3 sequential GIS courses and nothing else
                       ══════════════════════════════════════════════════════════ */}
                    {gisCourses.length > 0 && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 via-black/40 to-black/60 p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(0,255,148,0.03)]">
                            {/* Pathway Header Banner */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3.5 py-1 text-xs font-mono text-emerald-400">
                                        <Compass className="h-3.5 w-3.5" />
                                        <span>CORE LEARNING PATHWAY • 3 SEQUENTIAL STAGES</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white font-mono flex items-center gap-3">
                                        <Globe2 className="h-7 w-7 text-neon-green shrink-0" />
                                        <span>Geospatial Intelligence & Earth Observation</span>
                                    </h2>
                                    <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
                                        A deliberate 3-course progression from foundational spatial literacy to production-grade geospatial engineering and cloud computing.
                                    </p>
                                </div>
                                <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-xl shrink-0">
                                    <span className="text-emerald-400 font-bold">1. Foundations</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
                                    <span className="text-cyan-400 font-bold">2. Analysis</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
                                    <span className="text-purple-400 font-bold">3. Engineering</span>
                                </div>
                            </div>

                            {/* The 3-Course Dedicated Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {gisCourses.map((course, idx) => {
                                    const meta = STAGE_META[course.slug] || {
                                        stage: `STAGE 0${idx + 1}`,
                                        tag: "PATHWAY COURSE",
                                        level: "GIS Protocol",
                                        color: "text-neon-green",
                                        border: "border-neon-green/30 group-hover:border-neon-green/60",
                                        accentBg: "bg-neon-green/10 text-neon-green border-neon-green/20",
                                        focus: "Geospatial Analysis",
                                    };

                                    const targetHref = course.is_enrolled
                                        ? course.next_lesson_slug
                                            ? `/academy/${course.slug}/${course.next_lesson_slug}`
                                            : `/academy/${course.slug}`
                                        : `/academy/${course.slug}`;

                                    return (
                                        <GlassCard
                                            key={course.id}
                                            className={`relative flex flex-col justify-between p-6 transition-all duration-300 group border ${meta.border} bg-black/40 hover:bg-black/60 shadow-lg`}
                                        >
                                            {/* Stage Ribbon Header */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-mono font-black ${meta.color} tracking-wider`}>
                                                            {meta.stage}
                                                        </span>
                                                        <span className="text-gray-600 font-mono text-xs">•</span>
                                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${meta.accentBg} uppercase tracking-wider font-bold`}>
                                                            {meta.tag}
                                                        </span>
                                                    </div>
                                                    {course.progress === 100 ? (
                                                        <CheckCircle className="text-neon-green h-5 w-5 shrink-0" />
                                                    ) : course.is_enrolled ? (
                                                        <span className="text-[10px] font-mono font-bold text-neon-green bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 rounded-full uppercase shrink-0">
                                                            ENROLLED
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {/* Course Thumbnail */}
                                                {course.thumbnail_url && (
                                                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                                        <img
                                                            src={course.thumbnail_url}
                                                            alt={course.title}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-gray-300">
                                                            <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                                                                <Layers className="h-3 w-3 text-neon-green" />
                                                                {course.total_lessons} Lessons
                                                            </span>
                                                            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 font-bold text-white">
                                                                STAGE 0{idx + 1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors font-mono leading-snug">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 line-clamp-3 mt-2 leading-relaxed">
                                                        {course.description || "Comprehensive progressive spatial intelligence training protocol."}
                                                    </p>
                                                </div>

                                                {/* Tech Focus Highlights */}
                                                <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-[11px] font-mono text-gray-400">
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Core Focus:</div>
                                                    <div className="text-gray-300 font-medium leading-tight">{meta.focus}</div>
                                                </div>
                                            </div>

                                            {/* Progress / Actions */}
                                            <div className="space-y-4 pt-5 border-t border-white/5 mt-5">
                                                {course.is_enrolled ? (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs font-mono text-gray-400">
                                                            <span>STAGE PROGRESS</span>
                                                            <span className="text-neon-green font-bold">{course.progress}%</span>
                                                        </div>
                                                        <div
                                                            className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5"
                                                            role="progressbar"
                                                            aria-valuenow={course.progress}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                            aria-label={`${course.title} progress: ${course.progress}%`}
                                                        >
                                                            <div
                                                                className="h-full bg-neon-green transition-all duration-500"
                                                                style={{ width: `${course.progress}%` }}
                                                            />
                                                        </div>
                                                        <div className="text-[11px] font-mono text-gray-400 text-right">
                                                            {course.completed_lessons} / {course.total_lessons} LESSONS COMPLETED
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                                                        <span className="flex items-center gap-1.5">
                                                            <BookOpen className="h-3.5 w-3.5 text-neon-green" />
                                                            {course.total_lessons} LESSONS
                                                        </span>
                                                        <span className="flex items-center gap-1 text-neon-green font-bold">
                                                            <Sparkles className="h-3 w-3" />
                                                            FULL ACCESS
                                                        </span>
                                                    </div>
                                                )}

                                                <Link href={targetHref} className="block w-full">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between group-hover:bg-neon-green group-hover:text-black font-mono text-xs font-bold transition-all h-10"
                                                    >
                                                        <span>
                                                            {course.progress === 100
                                                                ? "REVIEW STAGE"
                                                                : course.is_enrolled
                                                                ? "CONTINUE STAGE"
                                                                : `ENTER STAGE 0${idx + 1}`}
                                                        </span>
                                                        {course.is_enrolled ? (
                                                            <PlayCircle className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════════════
                        OTHER SPECIALIZATIONS (R, ML, ETC.)
                       ══════════════════════════════════════════════════════════ */}
                    {otherCourses.length > 0 && (
                        <div className="space-y-6 pt-2">
                            <div className="border-b border-white/10 pb-4">
                                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3.5 py-1 text-xs font-mono text-cyan-400 mb-2">
                                    <Cpu className="h-3.5 w-3.5" />
                                    <span>DATA SCIENCE & ARTIFICIAL INTELLIGENCE</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
                                    <Binary className="h-6 w-6 text-cyan-400" />
                                    Statistical Computing & Production AI Protocols
                                </h2>
                                <p className="text-sm text-gray-400 max-w-2xl mt-1">
                                    Advanced computing toolchains for agricultural experimental analysis, statistical modeling, and modern machine learning deployment.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {otherCourses.map((course) => {
                                    const targetHref = course.is_enrolled
                                        ? course.next_lesson_slug
                                            ? `/academy/${course.slug}/${course.next_lesson_slug}`
                                            : `/academy/${course.slug}`
                                        : `/academy/${course.slug}`;

                                    return (
                                        <GlassCard
                                            key={course.id}
                                            className="flex flex-col gap-4 p-5 hover:border-cyan-500/40 transition-all group justify-between"
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

                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors font-mono leading-snug">
                                                        {course.title}
                                                    </h3>
                                                    {course.progress === 100 ? (
                                                        <CheckCircle className="text-neon-green h-5 w-5 shrink-0" />
                                                    ) : course.is_enrolled ? (
                                                        <span className="text-[10px] font-mono font-bold text-neon-green bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 rounded-full uppercase shrink-0">
                                                            ENROLLED
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase shrink-0">
                                                            AVAILABLE
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                                                    {course.description || "Comprehensive specialized academic and research protocol."}
                                                </p>
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                                                {course.is_enrolled ? (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs font-mono text-gray-400">
                                                            <span>PROGRESS</span>
                                                            <span>{course.progress}%</span>
                                                        </div>
                                                        <div
                                                            className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5"
                                                            role="progressbar"
                                                            aria-valuenow={course.progress}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                            aria-label={`${course.title} progress: ${course.progress}%`}
                                                        >
                                                            <div
                                                                className="h-full bg-cyan-400 transition-all duration-500"
                                                                style={{ width: `${course.progress}%` }}
                                                            />
                                                        </div>
                                                        <div className="text-[11px] font-mono text-gray-400 text-right">
                                                            {course.completed_lessons} / {course.total_lessons} LESSONS
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                                                        <span className="flex items-center gap-1.5">
                                                            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                                                            {course.total_lessons} LESSONS
                                                        </span>
                                                        <span className="flex items-center gap-1 text-cyan-400 font-bold">
                                                            <Sparkles className="h-3 w-3" />
                                                            FULL ACCESS
                                                        </span>
                                                    </div>
                                                )}

                                                <Link href={targetHref} className="block w-full">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between group-hover:bg-cyan-500 group-hover:text-black font-mono text-xs font-bold transition-all"
                                                    >
                                                        <span>
                                                            {course.progress === 100
                                                                ? "REVIEW COURSE"
                                                                : course.is_enrolled
                                                                ? "CONTINUE LESSON"
                                                                : "START COURSE"}
                                                        </span>
                                                        {course.is_enrolled ? (
                                                            <PlayCircle className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
