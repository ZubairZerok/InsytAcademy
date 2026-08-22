// components/schedule/pdf-routine-dropzone.tsx
"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
    FileUp, Sparkles, Loader2, CheckCircle2
} from "lucide-react";
import { parseBAUScheduleAction } from "@/actions/bau-schedule";
import type { PDFRoutineParseResult } from "@/types/bau";

interface PDFRoutineDropzoneProps {
    onParseComplete: (result: PDFRoutineParseResult) => void;
}

export function PDFRoutineDropzone({ onParseComplete }: PDFRoutineDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgressText, setScanProgressText] = useState("");
    const [lastResult, setLastResult] = useState<PDFRoutineParseResult | null>(null);

    const handleFileProcess = async (file: File) => {
        setIsScanning(true);
        setScanProgressText("Reading document stream...");

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Data = (e.target?.result as string) || "";
                setScanProgressText("Gemini 1.5 Flash analyzing routine typography & table layout...");

                setTimeout(async () => {
                    setScanProgressText("Extracting course codes, rooms, and group allocations...");
                    const result = await parseBAUScheduleAction({
                        fileBase64: base64Data,
                        mimeType: file.type || "application/pdf",
                        text: `BAU Official Routine Document: ${file.name}`
                    });

                    setIsScanning(false);
                    setLastResult(result);
                    onParseComplete(result);
                }, 1200);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error(err);
            setIsScanning(false);
        }
    };

    const handleLoadSampleRoutine = async () => {
        setIsScanning(true);
        setScanProgressText("Loading Official BAU Dean's Committee L2S1 Routine...");

        setTimeout(async () => {
            setScanProgressText("Gemini multimodal reasoning parsing 14 schedule slots...");
            const sampleText = `
BANGLADESH AGRICULTURAL UNIVERSITY, MYMENSINGH
FACULTY OF AGRICULTURAL ECONOMICS & RURAL SOCIOLOGY
CLASS ROUTINE FOR B.SC. AG. ECON. (HONS.) LEVEL 2, SEMESTER 1 (SESSION 2024-2025)

SUNDAY:
10:00 - 11:00 | AAS 2107 Statistical Inference | Gallery 204 | Theory | Teacher: Dr. Mohammad Jahangir Alam
14:00 - 15:00 | AE 2111 Advanced Microeconomics | Lecture Room 102 | Theory | Teacher: Dr. Mohammad Ismail Hossain

MONDAY:
11:00 - 12:00 | AE 2111 Advanced Microeconomics Tutorial | Seminar Room A | Tutorial
14:00 - 17:00 | AAS 2107 Statistical Inference Lab | Computer Lab 3 | Practical (Group A)

TUESDAY:
10:00 - 11:00 | AAS 2107 Statistical Inference | Gallery 204 | Theory
11:15 - 12:00 | AAS 2107 Class Test #1 | Gallery 204 | Class Test (10 Marks)
14:00 - 17:00 | VMH 2101 Veterinary Microbiology Lab | Central Lab | Practical (Group B)

WEDNESDAY:
09:00 - 10:00 | AE 2111 Advanced Microeconomics | Lecture Room 102 | Theory
14:00 - 17:00 | AAS 2107 Statistical Inference Lab | Computer Lab 3 | Practical (Group B)

THURSDAY:
08:00 - 11:00 | AGRON 1101 Agronomy Field Practical | Field Lab Block C | Practical (Group A)
11:00 - 12:00 | AQ 2101 Aquaculture Limnology | Fisheries Aud 2 | Theory
            `;

            const result = await parseBAUScheduleAction({ text: sampleText });
            setIsScanning(false);
            setLastResult(result);
            onParseComplete(result);
        }, 1500);
    };

    return (
        <GlassCard className="p-6 md:p-8 relative overflow-hidden border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-800 dark:text-neon-green">
                        <Sparkles className="h-3.5 w-3.5" />
                        GEMINI MULTIMODAL NOTICE SCANNER
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white">
                        Import Official BAU Routine PDF
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-xl">
                        Drop any official department routine PDF, scanned image, or circular. Gemini multimodal extraction extracts room allocations, time slots, and practical groups into your live calendar.
                    </p>
                </div>

                {/* Instant Preset Button */}
                <div className="shrink-0">
                    <Button
                        onClick={handleLoadSampleRoutine}
                        disabled={isScanning}
                        className="bg-neon-green text-black hover:bg-neon-green/90 font-bold font-mono text-xs h-11 px-5 shadow-[0_0_15px_rgba(0,255,148,0.25)]"
                    >
                        {isScanning ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                SCANNING...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                LOAD SAMPLE BAU L2S1 PDF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Dropzone Container */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileProcess(e.dataTransfer.files[0]);
                    }
                }}
                className={`mt-6 rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                    isDragging
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-black/10 dark:border-white/10 hover:border-emerald-500/40 bg-black/[0.02] dark:bg-black/40"
                }`}
                onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf,image/*,.txt";
                    input.onchange = (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        if (target.files && target.files[0]) {
                            handleFileProcess(target.files[0]);
                        }
                    };
                    input.click();
                }}
            >
                {isScanning ? (
                    <div className="space-y-4 py-4 animate-in fade-in">
                        <div className="relative mx-auto w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-neon-green/20 border-t-neon-green animate-spin" />
                            <Sparkles className="h-8 w-8 text-neon-green absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                AI Document Intelligence In Progress
                            </h3>
                            <p className="font-mono text-xs text-emerald-700 dark:text-neon-green animate-pulse">
                                {scanProgressText}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 py-2">
                        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-700 dark:text-neon-green">
                            <FileUp className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white block">
                                Drop official routine PDF or notice image here
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                Supports .PDF, PNG, JPEG, or OCR text dumps from BAU faculty bulletin boards
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Last Result Extraction Banner */}
            {lastResult && lastResult.success && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4 animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-neon-green shrink-0" />
                        <div className="text-xs font-mono">
                            <span className="font-bold text-gray-900 dark:text-white">
                                {lastResult.extractedEventsCount} Schedule Events Extracted Successfully
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 block">
                                {lastResult.facultyDetected} · {lastResult.levelSemesterDetected} (Confidence: {lastResult.confidenceScore}%)
                            </span>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-neon-green uppercase shrink-0">
                        {lastResult.provenance}
                    </span>
                </div>
            )}
        </GlassCard>
    );
}
