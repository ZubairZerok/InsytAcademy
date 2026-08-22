// app/(dashboard)/academy/assessment/page.tsx
"use client";

import { OrdinanceCalculator } from "@/components/assessment/ordinance-calculator";
import { MockExamView } from "@/components/assessment/mock-exam-view";
import { Calculator, Sparkles, Target, BookOpen } from "lucide-react";

export default function AssessmentLabPage() {
    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                        BAU ORDINANCE INTELLIGENCE // 10/20/70 EXAM LAB
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <Calculator className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                    BAU Assessment & CGPA Exam Lab
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    Evaluate your continuous assessment standing under the official 10/20/70 Academic Ordinance, simulate cumulative GPA targets, and solve syllabus-aware mock exams.
                </p>
            </div>

            {/* Ordinance Calculator & CGPA Simulator */}
            <OrdinanceCalculator />

            {/* Mock Exam Practice Paper */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600 dark:text-neon-green" />
                    <h2 className="text-lg font-bold font-mono tracking-tight text-gray-900 dark:text-white">
                        SYLLABUS-AWARE MOCK EXAM PRACTICE
                    </h2>
                </div>
                <MockExamView />
            </div>
        </div>
    );
}
