// components/viva/viva-room.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { VivaQuestion, VivaTurnEvaluation, VivaSessionSummary } from "@/types/bau";
import { submitVivaTurnAnswer, generateVivaSessionSummary } from "@/actions/bau-viva";
import { VivaScorecard } from "./viva-scorecard";
import {
    Mic, MicOff, Volume2, Sparkles,
    Loader2, CheckCircle2, ChevronRight, UserCheck
} from "lucide-react";

interface VivaRoomProps {
    courseCode: string;
    topic?: string;
    questions: VivaQuestion[];
}

export function VivaRoom({ courseCode, questions }: VivaRoomProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [evaluations, setEvaluations] = useState<VivaTurnEvaluation[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [summary, setSummary] = useState<VivaSessionSummary | null>(null);

    // Audio & Speech Recognition State
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [spokenTranscript, setSpokenTranscript] = useState("");
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [lastTurnFeedback, setLastTurnFeedback] = useState<VivaTurnEvaluation | null>(null);

    const recognitionRef = useRef<unknown>(null);
    const currentQuestion = questions[currentIndex] || questions[0];

    // Fallback Web Speech
    const fallbackBrowserSpeech = useCallback((text: string) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            setIsSpeaking(false);
        }
    }, []);

    // Speak question out loud via ElevenLabs API or Web Speech API fallback
    const speakText = useCallback(async (text: string) => {
        setIsSpeaking(true);

        try {
            const res = await fetch("/api/viva/voice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            if (res.ok) {
                const contentType = res.headers.get("Content-Type") || "";
                if (contentType.includes("audio/mpeg")) {
                    const blob = await res.blob();
                    const audioUrl = URL.createObjectURL(blob);
                    const audio = new Audio(audioUrl);
                    audio.onended = () => setIsSpeaking(false);
                    audio.onerror = () => fallbackBrowserSpeech(text);
                    await audio.play();
                    return;
                }
            }
            fallbackBrowserSpeech(text);
        } catch {
            fallbackBrowserSpeech(text);
        }
    }, [fallbackBrowserSpeech]);

    // Initialize Web Speech Recognition if available in browser
    useEffect(() => {
        if (typeof window !== "undefined") {
            const win = window as unknown as Record<string, unknown>;
            const SpeechRecognitionClass = (win.SpeechRecognition || win.webkitSpeechRecognition) as { new(): {
                continuous: boolean;
                interimResults: boolean;
                lang: string;
                onresult: (e: { results: Array<{ 0: { transcript: string } }> }) => void;
                onerror: (e: unknown) => void;
                onend: () => void;
                start: () => void;
                stop: () => void;
            } } | undefined;

            if (SpeechRecognitionClass) {
                const rec = new SpeechRecognitionClass();
                rec.continuous = true;
                rec.interimResults = true;
                rec.lang = "en-US";

                rec.onresult = (event) => {
                    let fullText = "";
                    for (let i = 0; i < event.results.length; i++) {
                        fullText += event.results[i][0].transcript + " ";
                    }
                    setSpokenTranscript(fullText.trim());
                };

                rec.onerror = (e) => {
                    console.warn("[SpeechRecognition] Error:", e);
                    setIsListening(false);
                };

                rec.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = rec;
            }
        }
    }, []);

    // Automatically speak question when question changes
    useEffect(() => {
        if (currentQuestion && !isCompleted) {
            setSpokenTranscript("");
            setLastTurnFeedback(null);
            speakText(currentQuestion.questionText);
        }
    }, [currentIndex, currentQuestion, isCompleted, speakText]);

    const toggleListening = () => {
        const rec = recognitionRef.current as { start: () => void; stop: () => void } | null;
        if (!rec) {
            alert("Speech recognition is not supported in this browser. You can also type or use demo responses.");
            return;
        }

        if (isListening) {
            rec.stop();
            setIsListening(false);
        } else {
            setSpokenTranscript("");
            try {
                rec.start();
                setIsListening(true);
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const handleAnswerSubmit = async () => {
        const rec = recognitionRef.current as { stop: () => void } | null;
        if (isListening && rec) {
            rec.stop();
            setIsListening(false);
        }

        const answerText = spokenTranscript.trim() || currentQuestion.idealAnswerSummary;
        setIsEvaluating(true);

        const evaluation = await submitVivaTurnAnswer(currentQuestion, answerText, courseCode);
        setIsEvaluating(false);
        setLastTurnFeedback(evaluation);

        const updatedEvals = [...evaluations, evaluation];
        setEvaluations(updatedEvals);

        // Speak oral feedback remark
        speakText(evaluation.spokenFeedbackAudioText);
    };

    const handleNextQuestion = async () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const finalSummary = await generateVivaSessionSummary(
                `viva-session-${Date.now()}`,
                courseCode,
                evaluations
            );
            setSummary(finalSummary);
            setIsCompleted(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setEvaluations([]);
        setSummary(null);
        setIsCompleted(false);
        setLastTurnFeedback(null);
        setSpokenTranscript("");
    };

    if (isCompleted && summary) {
        return <VivaScorecard summary={summary} onRestart={handleRestart} />;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Viva HUD Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-black/[0.02] dark:bg-agri-dark/60 border border-black/[0.06] dark:border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="font-bold text-gray-900 dark:text-white">BAU ORAL DEFENSE BOARD</span>
                    <span className="text-gray-400">· {courseCode}</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-emerald-700 dark:text-neon-green font-bold">
                        QUESTION {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-neon-green border border-emerald-500/20 uppercase font-bold">
                        {currentQuestion.difficulty}
                    </span>
                </div>
            </div>

            {/* Examiner Live Voice Stage */}
            <GlassCard className="p-6 md:p-10 text-center space-y-6 relative overflow-hidden border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Examiner Avatar with Dynamic Speech Waveform Animation */}
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                    {isSpeaking && (
                        <>
                            <div className="absolute inset-0 rounded-full border-2 border-purple-500/40 animate-ping" />
                            <div className="absolute -inset-2 rounded-full border border-purple-500/20 animate-pulse" />
                        </>
                    )}
                    <div className="h-20 w-20 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.2)]">
                        {isSpeaking ? <Volume2 className="h-9 w-9 animate-bounce" /> : <UserCheck className="h-9 w-9" />}
                    </div>
                </div>

                {/* Examiner Identity */}
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-700 dark:text-purple-300 uppercase font-bold">
                        <Sparkles className="h-3 w-3" />
                        ElevenLabs Faculty Examiner Voice
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white font-mono">
                        External Board Member · Topic: {currentQuestion.topic}
                    </h3>
                </div>

                {/* Spoken Question Text */}
                <div className="max-w-2xl mx-auto p-4 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5">
                    <p className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 leading-relaxed font-sans">
                        &ldquo;{currentQuestion.questionText}&rdquo;
                    </p>
                </div>

                {/* Voice Re-play Button */}
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(currentQuestion.questionText)}
                        disabled={isSpeaking}
                        className="text-xs font-mono text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Volume2 className="h-3.5 w-3.5 mr-1.5" />
                        {isSpeaking ? "Speaking Question..." : "Replay Audio Question"}
                    </Button>
                </div>
            </GlassCard>

            {/* Student Oral Response & Microphone Stage */}
            <GlassCard className="p-6 md:p-8 space-y-5 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-gray-900 dark:text-white uppercase">
                        <Mic className="h-4 w-4 text-emerald-600 dark:text-neon-green" />
                        Your Spoken Answer
                    </div>
                    {isListening && (
                        <span className="flex items-center gap-1.5 text-xs font-mono text-red-500 font-bold animate-pulse">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            RECORDING MICROPHONE...
                        </span>
                    )}
                </div>

                {/* Live Spoken Transcription Display */}
                <div className="relative">
                    <textarea
                        value={spokenTranscript}
                        onChange={(e) => setSpokenTranscript(e.target.value)}
                        placeholder="Click 'START SPEAKING' and answer verbally, or click 'USE IDEAL DEMO ANSWER'..."
                        rows={4}
                        className="w-full rounded-xl bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 p-4 text-sm font-sans text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
                    />
                </div>

                {/* Control Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={toggleListening}
                            className={`font-mono text-xs font-bold h-11 px-5 transition-all ${
                                isListening
                                    ? "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                    : "bg-emerald-600 dark:bg-neon-green text-white dark:text-black hover:bg-emerald-700 dark:hover:bg-neon-green/90 shadow-[0_0_15px_rgba(0,255,148,0.25)]"
                            }`}
                        >
                            {isListening ? (
                                <>
                                    <MicOff className="h-4 w-4 mr-2" />
                                    STOP RECORDING
                                </>
                            ) : (
                                <>
                                    <Mic className="h-4 w-4 mr-2" />
                                    START SPEAKING
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setSpokenTranscript(currentQuestion.idealAnswerSummary)}
                            className="font-mono text-xs text-gray-700 dark:text-gray-300 h-11"
                        >
                            Use Ideal Answer
                        </Button>
                    </div>

                    <Button
                        onClick={handleAnswerSubmit}
                        disabled={isEvaluating || isSpeaking}
                        className="bg-emerald-800 dark:bg-white text-white dark:text-black hover:bg-emerald-900 dark:hover:bg-gray-100 font-mono text-xs font-bold h-11 px-6"
                    >
                        {isEvaluating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                GEMINI EVALUATING...
                            </>
                        ) : (
                            <>
                                SUBMIT ORAL RESPONSE
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </>
                        )}
                    </Button>
                </div>
            </GlassCard>

            {/* Turn Evaluation HUD (if evaluated) */}
            {lastTurnFeedback && (
                <GlassCard className="p-6 space-y-5 border-emerald-500/40 bg-emerald-500/5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-neon-green font-mono text-xs font-bold uppercase">
                            <CheckCircle2 className="h-4 w-4" />
                            Gemini 1.5 Oral Assessment Completed
                        </div>
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            Accuracy: <strong className="text-gray-900 dark:text-white">{lastTurnFeedback.technicalAccuracy}%</strong>
                        </span>
                    </div>

                    {/* 4 Score Metrics Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                        <div className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-black/40 border border-black/[0.04] dark:border-white/5">
                            <span className="text-gray-500 dark:text-gray-400 block text-[10px]">TECHNICAL ACCURACY</span>
                            <span className="text-emerald-700 dark:text-neon-green font-bold text-base">{lastTurnFeedback.technicalAccuracy}%</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-black/40 border border-black/[0.04] dark:border-white/5">
                            <span className="text-gray-500 dark:text-gray-400 block text-[10px]">CONCEPTUAL DEPTH</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-base">{lastTurnFeedback.conceptualDepth}%</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-black/40 border border-black/[0.04] dark:border-white/5">
                            <span className="text-amber-600 dark:text-amber-400 font-bold text-base">{lastTurnFeedback.reasoningScore}%</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-black/40 border border-black/[0.04] dark:border-white/5">
                            <span className="text-gray-500 dark:text-gray-400 block text-[10px]">SPOKEN FLUENCY</span>
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-base">{lastTurnFeedback.fluencyScore}%</span>
                        </div>
                    </div>

                    {/* Qualitative Feedback */}
                    <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-black/[0.02] dark:bg-black/30 p-3.5 rounded-lg border border-black/[0.04] dark:border-white/5">
                        <strong className="text-gray-900 dark:text-white font-mono block mb-1">Examiner Written Feedback:</strong>
                        {lastTurnFeedback.examinerFeedback}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleNextQuestion}
                            className="bg-neon-green text-black hover:bg-neon-green/90 font-bold font-mono text-xs h-11 px-6 shadow-[0_0_15px_rgba(0,255,148,0.25)]"
                        >
                            {currentIndex + 1 < questions.length ? "NEXT QUESTION →" : "FINALIZE VIVA REPORT →"}
                        </Button>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
