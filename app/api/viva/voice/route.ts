// app/api/viva/voice/route.ts
// Streams synthesized speech audio from ElevenLabs for the AI Viva Room examiner.

import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsService } from "@/lib/ai/elevenlabs-service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const text = (body.text || "").toString().slice(0, 1000).trim();
        const voiceId = body.voiceId;

        if (!text) {
            return NextResponse.json({ error: "Text is required." }, { status: 400 });
        }

        const result = await ElevenLabsService.synthesizeSpeechStream(text, { voiceId });

        if (result.audioBuffer) {
            const buffer = Buffer.from(result.audioBuffer);
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    "Content-Type": "audio/mpeg",
                    "Content-Length": String(buffer.byteLength),
                    "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
                }
            });
        }

        return NextResponse.json({
            fallback: true,
            message: "ElevenLabs fallback active",
            text
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("[api/viva/voice] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
