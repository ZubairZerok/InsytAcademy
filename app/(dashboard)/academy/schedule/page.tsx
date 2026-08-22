// app/(dashboard)/academy/schedule/page.tsx
"use client";

import { useState } from "react";
import { PDFRoutineDropzone } from "@/components/schedule/pdf-routine-dropzone";
import { RoutineCalendar } from "@/components/schedule/routine-calendar";
import { BAU_SAMPLE_ROUTINE_ENTRIES } from "@/lib/bau-data/routines";
import type { RoutineEntry, ScheduleConflict, PDFRoutineParseResult } from "@/types/bau";
import { Calendar, Sparkles, AlertCircle, FileText } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function BAUSchedulePage() {
    const [events, setEvents] = useState<RoutineEntry[]>(BAU_SAMPLE_ROUTINE_ENTRIES);
    const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);

    const handleParseComplete = (result: PDFRoutineParseResult) => {
        if (result.events && result.events.length > 0) {
            setEvents(result.events);
            setConflicts(result.conflicts || []);
        }
    };

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-neon-green uppercase tracking-wider">
                        BAU ACADEMIC INTELLIGENCE // SCHEDULE OS
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-emerald-600 dark:text-neon-green" />
                    BAU Schedule Intelligence
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
                    Unified class routines, practical field laboratories, and examination schedules across all 6 BAU faculties with automated clash detection.
                </p>
            </div>

            {/* Multimodal PDF Dropzone */}
            <PDFRoutineDropzone onParseComplete={handleParseComplete} />

            {/* Weekly Interactive Timetable */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold font-mono tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-600 dark:text-neon-green" />
                        ACTIVE WEEKLY TIMETABLE
                    </h2>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        Total {events.length} Synchronized Sessions
                    </span>
                </div>

                <RoutineCalendar events={events} conflicts={conflicts} />
            </div>
        </div>
    );
}
