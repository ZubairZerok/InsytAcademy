// components/assessment/mock-exam-view.tsx
"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
    FileCheck2, Clock, PlayCircle, CheckCircle2, RotateCcw,
    Sparkles, AlertCircle, HelpCircle, Loader2
} from "lucide-react";

interface MockQuestion {
    id: string;
    number: string;
    marks: number;
    question: string;
    modelSolutionSummary: string;
}

const SAMPLE_EXAM_QUESTIONS: MockQuestion[] = [
    {
        id: "q1",
        number: "Question 1 (a)",
        marks: 5,
        question: "Differentiate between Point Estimation and Interval Estimation. Under what mathematical conditions is a sample estimator said to be Best Linear Unbiased Estimator (BLUE)?",
        modelSolutionSummary: "Point estimation yields a single numerical value, whereas interval estimation provides a range with specified confidence (1 - alpha). An estimator is BLUE if it is linear in observations, unbiased (E[estimator] = parameter), and possesses the minimum variance among all linear unbiased estimators (Gauss-Markov Theorem)."
    },
    {
        id: "q2",
        number: "Question 1 (b)",
        marks: 10,
        question: "In a Boro rice fertilizer trial at the BAU Agronomy Farm, 10 plots treated with NPK+Zinc yielded a mean of 6.2 t/ha with standard deviation s1 = 0.6 t/ha, while 10 control plots yielded a mean of 4.8 t/ha with s2 = 0.8 t/ha. Assuming normality and equal variances, test whether the treatment significantly increased yield at alpha = 0.05. [Given: t(0.05, 18) = 2.101]",
        modelSolutionSummary: "Calculate pooled variance: Sp^2 = ((9*0.36) + (9*0.64)) / 18 = 0.50 -> Sp = 0.707. Test statistic: t = (6.2 - 4.8) / (0.707 * sqrt(2/10)) = 1.4 / 0.3162 = 4.428. Since calculated t (4.428) > critical t (2.101), reject H0. The NPK+Zinc treatment significantly increases rice yield."
    },
    {
        id: "q3",
        number: "Question 2 (a)",
        marks: 10,
        question: "Explain the purpose of local control (blocking) in a Randomized Complete Block Design (RCBD). Show how total sum of squares is partitioned in a standard two-way ANOVA table.",
        modelSolutionSummary: "Local control reduces experimental error by grouping homogeneous experimental units into blocks perpendicular to known soil fertility gradients. Total SS is partitioned into: SS Total = SS Treatments + SS Blocks + SS Error."
    }
];

export function MockExamView() {
    const [selectedExamType, setSelectedExamType] = useState<string>("Class Test (10 Marks)");
    const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [isGrading, setIsGrading] = useState(false);

    const handleAnswerChange = (qId: string, val: string) => {
        setStudentAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleGradeSubmission = () => {
        setIsGrading(true);
        setTimeout(() => {
            setIsGrading(false);
            setSubmitted(true);
        }, 1200);
    };

    const handleFillDemoAnswers = () => {
        const demo: Record<string, string> = {};
        SAMPLE_EXAM_QUESTIONS.forEach(q => {
            demo[q.id] = q.modelSolutionSummary;
        });
        setStudentAnswers(demo);
    };

    return (
        <GlassCard className="p-6 md:p-8 space-y-6 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
            {/* Exam Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/10 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-neon-green uppercase border border-emerald-500/20">
                            AAS 2107 · Level 2, Semester 1
                        </span>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            Time: 45 Mins · Full Marks: 25
                        </span>
                    </div>
                    <h2 className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                        BAU Mock Examination Paper
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFillDemoAnswers}
                        className="text-xs font-mono text-gray-700 dark:text-gray-300"
                    >
                        Auto-Fill Model Solution
                    </Button>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
                {SAMPLE_EXAM_QUESTIONS.map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                                <span className="font-mono text-emerald-700 dark:text-neon-green mr-2">{q.number}</span>
                                {q.question}
                            </h3>
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 shrink-0 font-bold">
                                [{q.marks} Marks]
                            </span>
                        </div>

                        {/* Answer Input */}
                        <div>
                            <textarea
                                value={studentAnswers[q.id] || ""}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                placeholder="Type your mathematical derivation or explanation here..."
                                rows={3}
                                className="w-full bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl p-3.5 text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                        </div>

                        {/* Model Solution (Visible after grading) */}
                        {submitted && (
                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-gray-800 dark:text-gray-200 space-y-1 animate-in fade-in">
                                <span className="text-emerald-700 dark:text-neon-green font-bold block text-[10px] uppercase">
                                    BAU Examiner Model Solution & Rubric:
                                </span>
                                <p className="leading-relaxed">{q.modelSolutionSummary}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Submit & Evaluation Actions */}
            <div className="flex justify-end gap-3 pt-2">
                {submitted ? (
                    <Button
                        onClick={() => { setSubmitted(false); setStudentAnswers({}); }}
                        variant="outline"
                        className="font-mono text-xs text-gray-700 dark:text-gray-300"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Mock Paper
                    </Button>
                ) : (
                    <Button
                        onClick={handleGradeSubmission}
                        disabled={isGrading}
                        className="bg-neon-green text-black hover:bg-neon-green/90 font-bold font-mono text-xs h-11 px-6 shadow-[0_0_15px_rgba(0,255,148,0.25)]"
                    >
                        {isGrading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                GEMINI GRADING SUBMISSION...
                            </>
                        ) : (
                            <>
                                <FileCheck2 className="h-4 w-4 mr-2" />
                                SUBMIT FOR GEMINI RUBRIC SCORING
                            </>
                        )}
                    </Button>
                )}
            </div>
        </GlassCard>
    );
}
