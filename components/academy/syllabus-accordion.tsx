"use client";

import { useState } from "react";
import { PlayCircle, Lock, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Lesson {
    id: string;
    title: string;
    slug: string;
    order_index: number;
}

interface Module {
    id: string;
    title: string;
    description: string | null;
    order_index: number;
    lessons: Lesson[];
}

interface SyllabusAccordionProps {
    modules: Module[];
    isEnrolled: boolean;
    courseSlug: string;
}

export function SyllabusAccordion({ modules, isEnrolled, courseSlug }: SyllabusAccordionProps) {
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
        // Automatically expand the first module by default
        if (modules.length > 0) {
            return { [modules[0].id]: true };
        }
        return {};
    });

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    let globalLessonIndex = 0;

    return (
        <div className="space-y-4">
            {modules.map((module) => {
                const isExpanded = expandedModules[module.id];
                const moduleLessons = module.lessons || [];

                return (
                    <div 
                        key={module.id} 
                        className="rounded-xl border border-white/5 bg-agri-dark/30 overflow-hidden transition-all duration-300"
                    >
                        {/* Module Header (Toggle button) */}
                        <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] text-left transition-colors focus:outline-none"
                        >
                            <div className="space-y-1 pr-4">
                                <span className="text-[10px] font-mono text-neon-green tracking-widest uppercase">
                                    MODULE {String(module.order_index).padStart(2, '0')}
                                </span>
                                <h3 className="text-lg font-bold text-white font-mono tracking-wide leading-snug">
                                    {module.title.toUpperCase()}
                                </h3>
                                {module.description && (
                                    <p className="text-xs text-gray-400 max-w-2xl line-clamp-1">
                                        {module.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-gray-400 shrink-0">
                                <span className="text-xs font-mono hidden sm:inline-block">
                                    {moduleLessons.length} LESSONS
                                </span>
                                {isExpanded ? (
                                    <ChevronUp className="h-5 w-5 text-neon-green" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 hover:text-white" />
                                )}
                            </div>
                        </button>

                        {/* Collapsible Lessons list */}
                        {isExpanded && (
                            <div className="border-t border-white/5 bg-black/20 p-4 space-y-3 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                                {moduleLessons.length === 0 ? (
                                    <p className="text-xs text-gray-400 font-mono italic p-2">
                                        No protocol lessons compiled for this module yet.
                                    </p>
                                ) : (
                                    moduleLessons.map((lesson) => {
                                        globalLessonIndex++;
                                        const isLocked = !isEnrolled && globalLessonIndex > 1;

                                        const lessonContent = (
                                            <div
                                                key={lesson.id}
                                                className={cn(
                                                    "group relative flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/5",
                                                    isLocked && "opacity-60 grayscale",
                                                    !isLocked && "cursor-pointer"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/40 font-mono text-neon-green text-sm font-bold border border-neon-green/10">
                                                        {String(globalLessonIndex).padStart(2, '0')}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white group-hover:text-neon-green transition-colors text-sm">
                                                            {lesson.title}
                                                        </h4>
                                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                            PROTOCOL: {lesson.slug.toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="ml-4 shrink-0">
                                                    {!isLocked ? (
                                                        <Button variant="ghost" size="sm" className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-neon-green/15 hover:text-neon-green transition-opacity">
                                                            INITIATE <PlayCircle className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        );

                                        return !isLocked ? (
                                            <Link key={lesson.id} href={`/academy/${courseSlug}/${lesson.slug}`} className="block">
                                                {lessonContent}
                                            </Link>
                                        ) : (
                                            <div key={lesson.id}>{lessonContent}</div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
