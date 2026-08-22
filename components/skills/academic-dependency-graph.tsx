// components/skills/academic-dependency-graph.tsx
"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { AcademicSkillNode } from "@/types/bau";
import {
    CheckCircle2, Lock, TrendingUp
} from "lucide-react";
import Link from "next/link";

const BAU_SKILL_NODES: AcademicSkillNode[] = [
    // Level 1 Foundation
    {
        id: "node-stat-1101",
        courseCode: "AAS 1101",
        title: "Descriptive Statistics & Probability",
        facultyCode: "FAERS",
        levelSemester: "L1S1",
        credits: 3,
        category: "Foundation",
        status: "COMPLETED",
        masteryPercent: 92,
        prerequisites: [],
        unlockedCareers: ["Data Analyst Intern"],
        x: 100,
        y: 120
    },
    {
        id: "node-agron-1101",
        courseCode: "AGRON 1101",
        title: "Fundamentals of Agronomy",
        facultyCode: "FOA",
        levelSemester: "L1S1",
        credits: 4,
        category: "Foundation",
        status: "COMPLETED",
        masteryPercent: 88,
        prerequisites: [],
        unlockedCareers: ["Field Agronomist"],
        x: 100,
        y: 280
    },

    // Level 2 Core Statistical Inference & Microeconomics
    {
        id: "node-aas-2107",
        courseCode: "AAS 2107",
        title: "Statistical Inference & RCBD Field Design",
        facultyCode: "FAERS",
        levelSemester: "L2S1",
        credits: 3,
        category: "Core Theory",
        status: "IN_PROGRESS",
        masteryPercent: 68,
        prerequisites: ["node-stat-1101"],
        unlockedCareers: ["Scientific Officer (BARI/BRRI)", "Agri-Data Analyst"],
        x: 350,
        y: 120
    },
    {
        id: "node-ae-2111",
        courseCode: "AE 2111",
        title: "Advanced Microeconomics & Production Functions",
        facultyCode: "FAERS",
        levelSemester: "L2S1",
        credits: 3,
        category: "Core Theory",
        status: "IN_PROGRESS",
        masteryPercent: 74,
        prerequisites: ["node-stat-1101"],
        unlockedCareers: ["Agri-Banking Officer", "Policy Analyst"],
        x: 350,
        y: 280
    },

    // Level 3 Advanced Econometrics & Genetics
    {
        id: "node-econ-3101",
        courseCode: "AE 3101",
        title: "Applied Econometrics & Time-Series (VECM)",
        facultyCode: "FAERS",
        levelSemester: "L3S1",
        credits: 3,
        category: "Advanced Elective",
        status: "LOCKED",
        masteryPercent: 0,
        prerequisites: ["node-aas-2107", "node-ae-2111"],
        unlockedCareers: ["International Research Fellow", "Price Forecaster"],
        x: 600,
        y: 200
    },

    // Level 4 Capstone & Thesis
    {
        id: "node-thesis-4200",
        courseCode: "THESIS 4200",
        title: "Undergraduate Research Thesis / Capstone Defense",
        facultyCode: "FAERS",
        levelSemester: "L4S2",
        credits: 6,
        category: "Capstone / Thesis",
        status: "LOCKED",
        masteryPercent: 0,
        prerequisites: ["node-econ-3101"],
        unlockedCareers: ["BCS Cadre Top Ranks", "PhD Fellowship Abroad"],
        x: 840,
        y: 200
    }
];

export function AcademicDependencyGraph() {
    const [selectedNode, setSelectedNode] = useState<AcademicSkillNode | null>(BAU_SKILL_NODES[2]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* SVG Visual Graph Container */}
                <GlassCard className="lg:col-span-3 h-[480px] relative overflow-hidden bg-black/[0.04] dark:bg-black/60 p-0 select-none border-black/[0.08] dark:border-white/10">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,148,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,148,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                    {/* Legend */}
                    <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-3 font-mono text-[10px] p-2 rounded-xl bg-white/80 dark:bg-black/60 border border-black/10 dark:border-white/10 backdrop-blur-md">
                        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-neon-green">
                            <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-neon-green" /> COMPLETED
                        </span>
                        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                            <span className="h-2 w-2 rounded-full bg-blue-500" /> IN PROGRESS
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                            <span className="h-2 w-2 rounded-full bg-gray-600" /> LOCKED
                        </span>
                    </div>

                    {/* SVG Connector Lines */}
                    <svg className="absolute inset-0 h-full w-full pointer-events-none">
                        {/* L1 -> L2 */}
                        <line x1="220" y1="140" x2="350" y2="140" stroke="rgba(0, 255, 148, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1="220" y1="140" x2="350" y2="300" stroke="rgba(0, 255, 148, 0.2)" strokeWidth="1.5" />
                        <line x1="220" y1="300" x2="350" y2="300" stroke="rgba(0, 255, 148, 0.4)" strokeWidth="2" strokeDasharray="4 4" />

                        {/* L2 -> L3 */}
                        <line x1="470" y1="140" x2="600" y2="220" stroke="rgba(0, 255, 148, 0.3)" strokeWidth="2" />
                        <line x1="470" y1="300" x2="600" y2="220" stroke="rgba(0, 255, 148, 0.3)" strokeWidth="2" />

                        {/* L3 -> L4 */}
                        <line x1="720" y1="220" x2="840" y2="220" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" strokeDasharray="5 5" />
                    </svg>

                    {/* Nodes Overlay */}
                    <div className="absolute inset-0 overflow-auto scrollbar-thin p-4">
                        <div className="relative w-[1000px] h-[440px]">
                            {BAU_SKILL_NODES.map((node) => {
                                const isSelected = selectedNode?.id === node.id;
                                const isCompleted = node.status === "COMPLETED";
                                const isInProgress = node.status === "IN_PROGRESS";

                                return (
                                    <button
                                        key={node.id}
                                        onClick={() => setSelectedNode(node)}
                                        style={{ left: `${node.x}px`, top: `${node.y}px` }}
                                        className={`absolute w-32 p-3 rounded-2xl border text-left transition-all transform hover:scale-105 backdrop-blur-md ${
                                            isSelected
                                                ? "bg-neon-green text-black border-neon-green font-bold shadow-[0_0_25px_rgba(0,255,148,0.4)] z-20"
                                                : isCompleted
                                                ? "bg-emerald-500/10 border-emerald-500/30 text-gray-900 dark:text-white"
                                                : isInProgress
                                                ? "bg-blue-500/10 border-blue-500/30 text-gray-900 dark:text-white"
                                                : "bg-black/30 border-white/10 text-gray-500 opacity-60"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                                            <span className="font-bold uppercase">{node.levelSemester}</span>
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-black" />
                                            ) : isInProgress ? (
                                                <span className="text-[9px] px-1 rounded bg-blue-500/20 text-blue-400">
                                                    {node.masteryPercent}%
                                                </span>
                                            ) : (
                                                <Lock className="h-3 w-3 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="font-mono text-xs font-bold truncate">{node.courseCode}</div>
                                        <div className="text-[10px] line-clamp-1 opacity-80">{node.title}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </GlassCard>

                {/* Node Detail Pane */}
                <GlassCard className="p-6 space-y-5 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90 flex flex-col justify-between">
                    {selectedNode ? (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-neon-green bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                        {selectedNode.courseCode}
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase">
                                        {selectedNode.levelSemester} · {selectedNode.credits} Credits
                                    </span>
                                </div>
                                <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug pt-1">
                                    {selectedNode.title}
                                </h3>
                            </div>

                            {/* Status & Mastery Bar */}
                            <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-2">
                                <div className="flex justify-between font-mono text-xs text-gray-500 dark:text-gray-400">
                                    <span>MASTERY LEVEL</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{selectedNode.masteryPercent}%</span>
                                </div>
                                <div className="h-2 w-full bg-black/10 dark:bg-black/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-600 dark:bg-neon-green transition-all"
                                        style={{ width: `${selectedNode.masteryPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Unlocked Careers */}
                            <div className="space-y-1.5 font-mono text-xs">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold block">
                                    Career Pathways Unlocked:
                                </span>
                                {selectedNode.unlockedCareers.map((c, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-neon-green font-medium">
                                        <TrendingUp className="h-3 w-3 shrink-0" />
                                        <span>{c}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={`/academy/courses/${selectedNode.courseCode.toLowerCase().replace(/\s+/g, "-")}`} className="block pt-2">
                                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-bold font-mono text-xs h-10">
                                    Explore Syllabus Module →
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 text-xs font-mono">
                            Click any node in the graph to inspect prerequisites.
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
