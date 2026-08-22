// components/viva/viva-scorecard.tsx
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { VivaSessionSummary } from "@/types/bau";
import {
    Award, CheckCircle2, AlertTriangle, PlayCircle, RotateCcw,
    Sparkles, Target, Activity, Zap
} from "lucide-react";
import Link from "next/link";

interface VivaScorecardProps {
    summary: VivaSessionSummary;
    onRestart: () => void;
}

export function VivaScorecard({ summary, onRestart }: VivaScorecardProps) {
    const isPassing = summary.overallReadinessScore >= 70;

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            {/* Header Result Card */}
            <GlassCard className="p-6 md:p-8 text-center space-y-6 relative overflow-hidden border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                <div className="absolute top-0 right-0 w-80 h-80 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-800 dark:text-neon-green uppercase">
                        <Award className="h-3.5 w-3.5" />
                        OFFICIAL BAU VIVA VOCE EXAMINATION REPORT
                    </div>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-sans">
                        {summary.courseCode} Oral Examination
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {summary.courseTitle} · Evaluated by Gemini 1.5 Flash & ElevenLabs Speech Intelligence
                    </p>
                </div>

                {/* Big Circular Readiness Score */}
                <div className="py-4">
                    <div className="relative mx-auto w-40 h-40 flex flex-col items-center justify-center rounded-full border-4 border-emerald-500/30 bg-black/[0.03] dark:bg-black/50 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
                        <span className="text-4xl font-extrabold font-mono text-emerald-700 dark:text-neon-green">
                            {summary.overallReadinessScore}%
                        </span>
                        <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                            {isPassing ? "VIVA READY" : "REVISION REQUIRED"}
                        </span>
                    </div>
                </div>

                {/* 4 Metric Sub-Scores HUD */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {[
                        { label: "TECHNICAL ACCURACY", score: summary.subMetrics.accuracy, icon: Target, color: "text-emerald-400" },
                        { label: "CONCEPTUAL DEPTH", score: summary.subMetrics.depth, icon: Activity, color: "text-blue-400" },
                        { label: "LOGICAL REASONING", score: summary.subMetrics.reasoning, icon: Zap, color: "text-amber-400" },
                        { label: "SPOKEN FLUENCY", score: summary.subMetrics.fluency, icon: Sparkles, color: "text-purple-400" },
                    ].map(({ label, score, icon: Icon, color }) => (
                        <div key={label} className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1 text-left">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase">{label}</span>
                                <Icon className={`h-3.5 w-3.5 ${color}`} />
                            </div>
                            <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">{score}%</div>
                            <div className="h-1 w-full bg-black/10 dark:bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-600 dark:bg-neon-green" style={{ width: `${score}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Qualitative Feedback & Critical Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <GlassCard className="p-6 space-y-4 border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-neon-green font-mono text-xs font-bold uppercase">
                        <CheckCircle2 className="h-4 w-4" />
                        Demonstrated Strengths
                    </div>
                    <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {summary.strengthAreas.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-600 dark:text-neon-green font-bold">✓</span>
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </GlassCard>

                {/* Weaknesses */}
                <GlassCard className="p-6 space-y-4 border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold uppercase">
                        <AlertTriangle className="h-4 w-4" />
                        Identified Conceptual Gaps
                    </div>
                    <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {summary.criticalWeaknesses.map((w, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-amber-500 font-bold">!</span>
                                <span>{w}</span>
                            </li>
                        ))}
                    </ul>
                </GlassCard>
            </div>

            {/* Remedial Recommendation Action Card */}
            <GlassCard className="p-6 md:p-8 space-y-4 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-neon-green uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            Recommended Remedial Action
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {summary.remedialRecommendation.topic}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Estimated time: {summary.remedialRecommendation.estimatedMinutes} minutes · Focus: {summary.remedialRecommendation.prerequisiteCourse || "Core Syllabus"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={onRestart}
                            className="font-mono text-xs text-gray-700 dark:text-gray-300 h-11 px-4"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            RE-TAKE VIVA
                        </Button>

                        <Link href={summary.remedialRecommendation.actionUrl}>
                            <Button className="bg-neon-green text-black hover:bg-neon-green/90 font-bold font-mono text-xs h-11 px-5 shadow-[0_0_15px_rgba(0,255,148,0.25)]">
                                <PlayCircle className="h-4 w-4 mr-2" />
                                START SPRINT
                            </Button>
                        </Link>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
