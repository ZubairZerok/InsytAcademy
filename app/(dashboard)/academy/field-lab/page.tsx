// app/(dashboard)/academy/field-lab/page.tsx
"use client";

import { SpecimenScanner } from "@/components/field-lab/specimen-scanner";
import { Microscope, Sparkles, BookOpen } from "lucide-react";

export default function FieldLabPage() {
    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-neon-green uppercase tracking-wider">
                        BAU PRACTICAL INTELLIGENCE // MULTIMODAL FIELD AI
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    <Microscope className="h-8 w-8 text-emerald-600 dark:text-neon-green" />
                    BAU Field & Specimen Intelligence Lab
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                    Multimodal visual diagnosis for agricultural specimens, crop foliar blights, soil salinity crusts, and veterinary parasitology specimens powered by Google Gemini 1.5 Flash Vision.
                </p>
            </div>

            {/* Specimen Scanner Component */}
            <SpecimenScanner />
        </div>
    );
}
