// app/(dashboard)/academy/skills/page.tsx
"use client";

import { AcademicDependencyGraph } from "@/components/skills/academic-dependency-graph";
import { Network, Sparkles, BookOpen } from "lucide-react";

export default function SkillsGraphPage() {
    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-neon-green uppercase tracking-wider">
                        BAU ACADEMIC PREREQUISITE NETWORK // SKILL DAG
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <Network className="h-8 w-8 text-emerald-600 dark:text-neon-green" />
                    BAU Academic Dependency Graph
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    Interactive Directed Acyclic Graph (DAG) mapping prerequisite course linkages, remedial sprint paths, and downstream career unlocks across all 4 undergraduate years.
                </p>
            </div>

            {/* Visual Prerequisite Graph */}
            <AcademicDependencyGraph />
        </div>
    );
}
