// lib/ai/elevenlabs-service.ts
// ElevenLabs Conversational Spoken Voice service for BAU AI Viva Voce examinations.

export interface ElevenLabsVoiceOptions {
    voiceId?: string;
    modelId?: string;
    stability?: number;
    similarityBoost?: number;
}

export class ElevenLabsService {
    private static apiKey: string | null = process.env.ELEVENLABS_API_KEY || null;
    // Default academic faculty examiner voice: "Brian" or "George" (authoritative, clear)
    private static defaultVoiceId: string = "nPczCjzI2devNBz1zQrb"; 

    /**
     * Synthesizes audio stream from text using ElevenLabs REST TTS API.
     */
    public static async synthesizeSpeechStream(
        text: string,
        options?: ElevenLabsVoiceOptions
    ): Promise<{ audioBuffer?: ArrayBuffer; error?: string }> {
        const apiKey = this.apiKey || process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return { error: "ELEVENLABS_API_KEY is not configured." };
        }

        const voiceId = options?.voiceId || this.defaultVoiceId;
        const modelId = options?.modelId || "eleven_multilingual_v2";

        try {
            const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": apiKey,
                },
                body: JSON.stringify({
                    text,
                    model_id: modelId,
                    voice_settings: {
                        stability: options?.stability ?? 0.5,
                        similarity_boost: options?.similarityBoost ?? 0.75,
                    },
                }),
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => "");
                console.warn("[ElevenLabsService] API returned status", res.status, errText.slice(0, 200));
                return { error: `ElevenLabs API error: ${res.status}` };
            }

            const buffer = await res.arrayBuffer();
            return { audioBuffer: buffer };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Synthesis failed";
            console.warn("[ElevenLabsService] Synthesis error:", message);
            return { error: message };
        }
    }
}
