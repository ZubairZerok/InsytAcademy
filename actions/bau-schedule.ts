// actions/bau-schedule.ts
"use server";

import { GeminiService } from "@/lib/ai/gemini-service";
import type { PDFRoutineParseResult, RoutineEntry } from "@/types/bau";
import { BAU_SAMPLE_ROUTINE_ENTRIES } from "@/lib/bau-data/routines";

export async function parseBAUScheduleAction(input: {
    text?: string;
    fileBase64?: string;
    mimeType?: string;
}): Promise<PDFRoutineParseResult> {
    try {
        return await GeminiService.parseRoutine(input);
    } catch (err: unknown) {
        console.error("[parseBAUScheduleAction] Error:", err);
        return {
            success: false,
            extractedEventsCount: 0,
            events: [],
            conflicts: [],
            confidenceScore: 0,
            provenance: "DEMO_FALLBACK"
        };
    }
}

export async function getBAURoutineScheduleAction(
    level: number = 2,
    semester: number = 1,
    facultyCode: string = "FAERS"
): Promise<RoutineEntry[]> {
    return BAU_SAMPLE_ROUTINE_ENTRIES.filter(
        e => e.level === level && e.semester === semester && e.facultyCode.toUpperCase() === facultyCode.toUpperCase()
    );
}
