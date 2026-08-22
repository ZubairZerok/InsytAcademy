// components/assessment/ordinance-calculator.tsx
"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { simulateCGPATarget } from "@/actions/bau-assessment";
import { convertScoreToGrade } from "@/lib/bau-data/assessment";
import type { CGPATargetSimulation } from "@/types/bau";
import { Calculator, Target, TrendingUp } from "lucide-react";

export function OrdinanceCalculator() {
    // Course 10/20/70 inputs
    const [attendance, setAttendance] = useState<number>(9);
    const [continuous, setContinuous] = useState<number>(17);
    const [finalExam, setFinalExam] = useState<number>(56);

    // CGPA Simulator inputs
    const [completedCredits, setCompletedCredits] = useState<number>(38);
    const [currentCGPA, setCurrentCGPA] = useState<number>(3.52);
    const [targetCGPA, setTargetCGPA] = useState<number>(3.75);
    const [semesterCredits, setSemesterCredits] = useState<number>(19);
    const [simulation, setSimulation] = useState<CGPATargetSimulation | null>(null);

    const totalScore = attendance + continuous + finalExam;
    const { letterGrade, gradePoint } = convertScoreToGrade(totalScore);

    const handleRunSimulation = async () => {
        const result = await simulateCGPATarget({
            currentCompletedCredits: completedCredits,
            currentCGPA,
            targetCGPA,
            currentSemesterCredits: semesterCredits
        });
        setSimulation(result);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 10/20/70 Course Assessment Calculator */}
                <GlassCard className="p-6 md:p-8 space-y-6 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-mono font-bold text-emerald-800 dark:text-neon-green uppercase">
                            <Calculator className="h-3.5 w-3.5" />
                            Official BAU 10/20/70 Ordinance
                        </div>
                        <h2 className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                            Course Grade Calculator
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            Adjust components to project your official letter grade and grade point.
                        </p>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-5">
                        {/* Attendance Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-mono text-xs text-gray-700 dark:text-gray-300">
                                <span>ATTENDANCE (MAX 10)</span>
                                <span className="font-bold text-emerald-700 dark:text-neon-green">{attendance} / 10 Marks</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={10}
                                value={attendance}
                                onChange={(e) => setAttendance(Number(e.target.value))}
                                className="w-full accent-emerald-600 dark:accent-neon-green cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-gray-500 dark:text-gray-500">
                                <span>0 (0%)</span>
                                <span>7.5 (75% Threshold)</span>
                                <span>10 (100%)</span>
                            </div>
                        </div>

                        {/* Continuous Assessment Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-mono text-xs text-gray-700 dark:text-gray-300">
                                <span>CONTINUOUS ASSESSMENT / CLASS TESTS (MAX 20)</span>
                                <span className="font-bold text-emerald-700 dark:text-neon-green">{continuous} / 20 Marks</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={20}
                                value={continuous}
                                onChange={(e) => setContinuous(Number(e.target.value))}
                                className="w-full accent-emerald-600 dark:accent-neon-green cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-gray-500 dark:text-gray-500">
                                <span>0</span>
                                <span>12 (Average)</span>
                                <span>20 (Top)</span>
                            </div>
                        </div>

                        {/* Semester Final Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-mono text-xs text-gray-700 dark:text-gray-300">
                                <span>SEMESTER FINAL EXAM (MAX 70)</span>
                                <span className="font-bold text-emerald-700 dark:text-neon-green">{finalExam} / 70 Marks</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={70}
                                value={finalExam}
                                onChange={(e) => setFinalExam(Number(e.target.value))}
                                className="w-full accent-emerald-600 dark:accent-neon-green cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-gray-500 dark:text-gray-500">
                                <span>0 (0%)</span>
                                <span>28 (40% Pass)</span>
                                <span>56 (80% A+)</span>
                                <span>70</span>
                            </div>
                        </div>
                    </div>

                    {/* Result Output HUD */}
                    <div className="p-5 rounded-2xl bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">
                                TOTAL PROJECTED SCORE
                            </span>
                            <div className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
                                {totalScore} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/ 100</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">
                                    GRADE POINT
                                </span>
                                <span className="text-xl font-bold font-mono text-emerald-700 dark:text-neon-green">
                                    {gradePoint.toFixed(2)}
                                </span>
                            </div>

                            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-mono font-extrabold text-2xl text-emerald-800 dark:text-neon-green shadow-[0_0_15px_rgba(0,255,148,0.2)]">
                                {letterGrade}
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* CGPA Target & Multi-Semester Projection Simulator */}
                <GlassCard className="p-6 md:p-8 space-y-6 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase">
                            <Target className="h-3.5 w-3.5" />
                            Academic Projection Simulator
                        </div>
                        <h2 className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                            CGPA Target Simulator
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            Calculate the required Semester GPA and average final exam score to hit your target.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                            <label className="text-gray-500 dark:text-gray-400 block mb-1">COMPLETED CREDITS</label>
                            <input
                                type="number"
                                value={completedCredits}
                                onChange={(e) => setCompletedCredits(Number(e.target.value))}
                                className="w-full bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-2.5 font-bold text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 dark:text-gray-400 block mb-1">CURRENT CGPA</label>
                            <input
                                type="number"
                                step="0.01"
                                value={currentCGPA}
                                onChange={(e) => setCurrentCGPA(Number(e.target.value))}
                                className="w-full bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-2.5 font-bold text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="text-cyan-700 dark:text-cyan-400 block mb-1 font-bold">TARGET CGPA</label>
                            <input
                                type="number"
                                step="0.01"
                                value={targetCGPA}
                                onChange={(e) => setTargetCGPA(Number(e.target.value))}
                                className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2.5 font-bold text-cyan-800 dark:text-cyan-300"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 dark:text-gray-400 block mb-1">CURRENT SEMESTER CREDITS</label>
                            <input
                                type="number"
                                value={semesterCredits}
                                onChange={(e) => setSemesterCredits(Number(e.target.value))}
                                className="w-full bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-2.5 font-bold text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleRunSimulation}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold h-11 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        CALCULATE REQUIRED TARGET GPA
                    </Button>

                    {simulation && (
                        <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-black/40 border border-cyan-500/30 space-y-3 font-mono text-xs animate-in fade-in">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">REQUIRED SEMESTER GPA:</span>
                                <span className={`text-lg font-bold ${simulation.isFeasible ? "text-cyan-600 dark:text-cyan-300" : "text-red-500"}`}>
                                    {simulation.requiredSemesterGPA.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">ESTIMATED FINAL EXAM SCORE:</span>
                                <span className="text-gray-900 dark:text-white font-bold">
                                    ~{simulation.requiredAverageFinalExamScore} / 70 Marks avg
                                </span>
                            </div>

                            <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed pt-2 border-t border-black/[0.06] dark:border-white/5">
                                {simulation.strategyNotes[0]}
                            </div>
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
