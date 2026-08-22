"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { PlayCircle, CheckCircle } from "lucide-react";
import type { CourseContent } from "@/actions/get-course-content";

interface CourseSidebarProps {
    course: CourseContent;
    currentLessonSlug?: string;
}

export function CourseSidebar({ course, currentLessonSlug }: CourseSidebarProps) {
    // Pre-compute lesson indices to avoid side-effects in JSX
    const lessonIndexMap = new Map<string, number>();
    let idx = 0;
    course.modules?.forEach(m => m.lessons.forEach(l => lessonIndexMap.set(l.id, ++idx)));

    return (
        <div className="rounded-xl border border-cyber-gray/30 bg-agri-dark/40 backdrop-blur-md p-4">
            <div className="mb-6 border-b border-cyber-gray/30 pb-4">
                <h2 className="font-mono text-sm font-bold text-neon-green">
                    COURSE SEQUENCE
                </h2>
                <p className="mt-1 text-xs text-gray-400 line-clamp-1">
                    {course.title}
                </p>
            </div>

            <nav className="flex flex-col space-y-6">
                {course.modules?.map((module, modIndex) => (
                    <div key={module.id} className="space-y-2">
                        <div className="flex items-center gap-2 px-2 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <span className="font-mono text-neon-green/50">{String(modIndex + 1).padStart(2, '0')}</span>
                            {module.title}
                        </div>

                        <div className="flex flex-col space-y-1">
                            {module.lessons.map((lesson) => {
                                const lessonNum = lessonIndexMap.get(lesson.id) ?? 0;
                                const isActive = lesson.slug === currentLessonSlug;
                                const isCompleted = course.completedLessonIds?.includes(lesson.id);

                                return (
                                    <Link
                                        key={lesson.id}
                                        href={`/academy/${course.slug}/${lesson.slug}`}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all relative overflow-hidden",
                                            isActive
                                                ? "bg-neon-green/10 text-neon-green"
                                                : isCompleted
                                                    ? "text-gray-300 hover:bg-white/5"
                                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {/* Active Indicator Line */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon-green" />
                                        )}

                                        <div
                                            className={cn(
                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10px] transition-colors",
                                                isActive
                                                    ? "bg-neon-green text-black"
                                                    : isCompleted
                                                        ? "bg-neon-green/20 text-neon-green"
                                                        : "bg-cyber-gray/50 text-gray-500"
                                            )}
                                        >
                                            {isCompleted ? <CheckCircle className="h-3 w-3" /> : lessonNum}
                                        </div>

                                        <span className={cn("flex-1 line-clamp-2 leading-tight", isCompleted && !isActive && "text-gray-500 line-through decoration-neon-green/30 decoration-1")}>
                                            {lesson.title}
                                        </span>

                                        {isActive && <PlayCircle className="h-3.5 w-3.5 opacity-50 shrink-0" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
}
