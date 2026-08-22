import { getCatalogCourses } from "@/actions/get-courses";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayCircle, CheckCircle, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courses & Learning Protocols",
    description: "Browse all available agri-science, bioinformatics, and biotechnology courses.",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
    const courses = await getCatalogCourses();

    return (
        <div className="space-y-8 pb-20">
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                        const targetHref = course.is_enrolled
                            ? (course.next_lesson_slug ? `/academy/${course.slug}/${course.next_lesson_slug}` : `/academy/${course.slug}`)
                            : `/academy/${course.slug}`;

                        return (
                            <GlassCard key={course.id} className="flex flex-col gap-4 p-5 hover:border-neon-green/30 transition-all group justify-between">
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
                                        <h3 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors font-mono leading-snug">
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
                                        {course.description || "Comprehensive multi-lesson specialized training protocol."}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                                    {/* Progress or Meta Info */}
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
                                                    className="h-full bg-neon-green transition-all duration-500"
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
                                            className="w-full justify-between group-hover:bg-neon-green group-hover:text-black font-mono text-xs font-bold transition-all"
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
            )}
        </div>
    );
}
