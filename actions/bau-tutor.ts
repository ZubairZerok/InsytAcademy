// actions/bau-tutor.ts
"use server";

import { GeminiService } from "@/lib/ai/gemini-service";
import { checkRateLimit } from "@/lib/rate-limit";

export interface TutorChatMessage {
    role: "user" | "assistant";
    content: string;
}

export async function askBAUCourseTutor(
    courseCode: string,
    prompt: string,
    history: TutorChatMessage[] = []
): Promise<{ text?: string; error?: string }> {
    const cleanPrompt = (prompt || "").trim().slice(0, 3000);
    if (!cleanPrompt) return { error: "Prompt is empty." };

    // Rate limiting per course topic
    const rl = checkRateLimit(`tutor:${courseCode}`, 30, 60_000);
    if (!rl.allowed) {
        return { error: `Request limit reached. Please wait ${rl.retryAfterSeconds}s.` };
    }

    try {
        const sanitizedHistory = (Array.isArray(history) ? history : [])
            .slice(-10)
            .map(h => ({
                role: h.role === "user" ? "user" as const : "assistant" as const,
                content: h.content.slice(0, 3000)
            }));

        const responseText = await GeminiService.generateTutorResponse(courseCode, cleanPrompt, sanitizedHistory);
        return { text: responseText };
    } catch (err: unknown) {
        console.error("[askBAUCourseTutor] Error:", err);
        return { error: "BAU Course Tutor is temporarily unavailable. Please try again." };
    }
}
