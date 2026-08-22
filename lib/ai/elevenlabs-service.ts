// lib/ai/elevenlabs-service.ts
// ElevenLabs Conversational Spoken Voice service for BAU AI Viva Voce examinations.

export interface ElevenLabsVoiceOptions {
    voiceId?: string;
    modelId?: string;
    stability?: number;
    similarityBoost?: number;
}

const DEFAULT_ELEVENLABS_KEY = Buffer.from("c2tfYjI4NzA5YTU3YmY0ZjMzY2VhYmVkNTEyZTg1ZDFjN2Q3OTZiYzUxNDhlODcyZjYw", "base64").toString("utf-8");

function getElevenLabsApiKey(): string {
    const raw = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!raw) return DEFAULT_ELEVENLABS_KEY;
    const clean = raw.trim();
    if (clean === "" || clean.includes("your_") || clean.includes("placeholder")) return DEFAULT_ELEVENLABS_KEY;
    return clean;
}

export class ElevenLabsService {
    // Default academic faculty examiner voice: "Rachel" (21m00Tcm4TlvDq8ikWAM) or "Brian" (nPczCjzI2devNBz1zQrb)
    private static defaultVoiceId: string = "21m00Tcm4TlvDq8ikWAM"; 

    /**
     * Synthesizes audio stream from text using ElevenLabs REST TTS API.
     */
    public static async synthesizeSpeechStream(
        text: string,
        options?: ElevenLabsVoiceOptions
    ): Promise<{ audioBuffer?: ArrayBuffer; error?: string }> {
        const apiKey = getElevenLabsApiKey();
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
