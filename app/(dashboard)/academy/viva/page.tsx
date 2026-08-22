// app/(dashboard)/academy/viva/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { VivaRoom } from "@/components/viva/viva-room";
import { BAU_COURSES } from "@/lib/bau-data/courses";
import { getVivaQuestionsForCourse } from "@/actions/bau-viva";
import type { VivaQuestion } from "@/types/bau";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Mic, Sparkles, Volume2, Award, PlayCircle, Loader2 } from "lucide-react";

export default function VivaRoomPage() {
    const searchParams = useSearchParams();
    const courseParam = searchParams.get("course") || "AAS 2107";

    const [selectedCourseCode, setSelectedCourseCode] = useState(courseParam);
    const [questions, setQuestions] = useState<VivaQuestion[]>([]);
    const [isStarted, setIsStarted] = useState(false);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

    useEffect(() => {
        const load = async () => {
            setIsLoadingQuestions(true);
            const qList = await getVivaQuestionsForCourse(selectedCourseCode);
            setQuestions(qList);
            setIsLoadingQuestions(false);
        };
        load();
    }, [selectedCourseCode]);

    const activeCourse = BAU_COURSES.find(c => c.code === selectedCourseCode) || BAU_COURSES[0];

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                        BAU SPOKEN INTELLIGENCE // AI VIVA VOCE ROOM
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <Mic className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    BAU Conversational AI Viva
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    Overcome oral examination anxiety with simulated departmental viva boards. ElevenLabs delivers natural voice examinations while Google Gemini evaluates technical depth, reasoning, and spoken fluency.
                </p>
            </div>

            {!isStarted ? (
                /* Course Selection & Pre-Viva Lobby */
                <GlassCard className="p-6 md:p-10 space-y-8 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90 text-center max-w-3xl mx-auto">
                    <div className="relative mx-auto w-24 h-24 rounded-3xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                        <Mic className="h-10 w-10" />
                    </div>

                    <div className="space-y-2 max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
                            Select Examination Course
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            Questions will be generated dynamically from the official BAU syllabus.
                        </p>
                    </div>

                    {/* Course Quick Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
                        {BAU_COURSES.slice(0, 3).map((course) => {
                            const isSelected = selectedCourseCode === course.code;
                            return (
                                <button
                                    key={course.id}
                                    onClick={() => setSelectedCourseCode(course.code)}
                                    className={`p-4 rounded-xl border text-left transition-all ${
                                        isSelected
                                            ? "bg-purple-500/15 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                                            : "bg-black/[0.02] dark:bg-black/40 border-black/[0.06] dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 block mb-1">
                                        {course.code}
                                    </span>
                                    <span className="text-xs font-bold line-clamp-1 block text-gray-900 dark:text-white">
                                        {course.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Board Highlights */}
                    <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto pt-4 border-t border-black/[0.06] dark:border-white/10 text-left font-mono text-xs">
                        <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1">
                            <span className="text-gray-500 dark:text-gray-400 text-[10px] uppercase block">EXAMINER</span>
                            <span className="text-gray-900 dark:text-white font-bold">ElevenLabs AI</span>
                        </div>
                        <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1">
                            <span className="text-gray-500 dark:text-gray-400 text-[10px] uppercase block">QUESTIONS</span>
                            <span className="text-gray-900 dark:text-white font-bold">{questions.length || 3} Oral Turns</span>
                        </div>
                        <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1">
                            <span className="text-gray-500 dark:text-gray-400 text-[10px] uppercase block">RUBRIC</span>
                            <span className="text-purple-600 dark:text-purple-400 font-bold">4 Dimensions</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={() => setIsStarted(true)}
                            disabled={isLoadingQuestions}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-sm px-8 h-12 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.35)]"
                        >
                            {isLoadingQuestions ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    PREPARING BOARD...
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="h-5 w-5 mr-2" />
                                    ENTER ORAL DEFENSE ROOM
                                </>
                            )}
                        </Button>
                    </div>
                </GlassCard>
            ) : (
                /* Live Spoken Viva Room */
                <VivaRoom
                    courseCode={selectedCourseCode}
                    topic="Hypothesis Testing & Experimental Design"
                    questions={questions}
                />
            )}
        </div>
    );
}
