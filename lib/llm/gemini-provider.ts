// lib/llm/gemini-provider.ts
// Live Google Gemini LLM Provider implementation for INSYT BAU.

import type { LLMProvider, LLMChatParams } from "./types";
import { GeminiService } from "@/lib/ai/gemini-service";

export class GeminiLLMProvider implements LLMProvider {
    readonly mode = "live" as const;
    readonly name = "gemini";

    async chat(params: LLMChatParams): Promise<string> {
        const conversationText = params.messages
            .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
            .join("\n\n");

        return await GeminiService.generateContent({
            prompt: conversationText || "Hello",
            systemInstruction: params.system,
            temperature: params.temperature ?? 0.7,
            maxTokens: params.maxTokens ?? 1500
        });
    }
}
