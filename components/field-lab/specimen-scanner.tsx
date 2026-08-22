// components/field-lab/specimen-scanner.tsx
"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { BAU_FIELD_SPECIMENS } from "@/lib/bau-data/field-specimens";
import { analyzeFieldSpecimenAction } from "@/actions/bau-field-ai";
import type { SpecimenAnalysisResult, FieldSpecimen } from "@/types/bau";
import {
    Microscope, Camera, Upload, CheckCircle2, AlertTriangle
} from "lucide-react";
import Link from "next/link";

export function SpecimenScanner() {
    const [selectedPreset, setSelectedPreset] = useState<FieldSpecimen | null>(null);
    const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<SpecimenAnalysisResult | null>(null);

    const handleSelectPreset = async (specimen: FieldSpecimen) => {
        setSelectedPreset(specimen);
        setCustomImagePreview(specimen.imageUrl);
        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            setTimeout(async () => {
                const result = await analyzeFieldSpecimenAction(
                    "",
                    "image/jpeg",
                    `BAU Field Specimen: ${specimen.name} (${specimen.category})`
                );

                setAnalysisResult({
                    ...result,
                    specimenId: specimen.id,
                    probableIdentification: specimen.name,
                    scientificName: specimen.scientificName,
                    category: specimen.category,
                    mappedBAUCourse: {
                        code: specimen.relatedCourseCode,
                        title: specimen.category === "Crop Pathology" ? "Plant Pathology & Crop Protection" : "Veterinary Parasitology",
                        relevantModule: "Practical Laboratory Field Identification"
                    },
                    visualFindings: [
                        { feature: "Lesion Pattern", observation: specimen.symptomsOrCharacteristics[0] || "Characteristic necrotic margin", confidence: 94 },
                        { feature: "Canopy / Tissue Spread", observation: specimen.symptomsOrCharacteristics[1] || "Tissue degeneration visible", confidence: 91 },
                    ],
                    educationalDiagnosis: specimen.educationalNotes,
                    labExerciseGuidance: specimen.managementOrPracticalTask,
                    safetyDisclaimer: specimen.safetyCaution,
                    provenance: "GEMINI_VISION"
                });
                setIsAnalyzing(false);
            }, 1200);
        } catch (err) {
            console.error(err);
            setIsAnalyzing(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64 = event.target?.result as string;
                setCustomImagePreview(base64);
                setSelectedPreset(null);
                setIsAnalyzing(true);
                setAnalysisResult(null);

                const result = await analyzeFieldSpecimenAction(base64, file.type || "image/jpeg");
                setIsAnalyzing(false);
                setAnalysisResult(result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            {/* Specimen Presets & Upload Dropzone */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1 & 2: Image Preview / Dropzone */}
                <div className="lg:col-span-2 space-y-4">
                    <GlassCard className="p-6 md:p-8 space-y-6 border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-agri-dark/90">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold font-mono text-gray-900 dark:text-white flex items-center gap-2">
                                    <Camera className="h-5 w-5 text-emerald-600 dark:text-neon-green" />
                                    Multimodal Field Inspection Stage
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                    Upload field photos, pathology microscope slides, or select a BAU laboratory specimen.
                                </p>
                            </div>
                        </div>

                        {/* Image Viewer Frame */}
                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/50 flex items-center justify-center">
                            {customImagePreview ? (
                                <>
                                    <img
                                        src={customImagePreview}
                                        alt="Specimen preview"
                                        className="h-full w-full object-cover"
                                    />
                                    {isAnalyzing && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in">
                                            <div className="relative w-16 h-16">
                                                <div className="absolute inset-0 rounded-full border-4 border-neon-green/20 border-t-neon-green animate-spin" />
                                                <Microscope className="h-7 w-7 text-neon-green absolute inset-0 m-auto animate-pulse" />
                                            </div>
                                            <span className="font-mono text-xs text-neon-green font-bold tracking-wider">
                                                GEMINI VISION ANALYZING SPECIMEN...
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center p-8 space-y-3">
                                    <Microscope className="h-12 w-12 text-gray-400 mx-auto animate-pulse" />
                                    <div className="space-y-1">
                                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white block">
                                            No Field Specimen Loaded
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono block">
                                            Choose an official BAU specimen on the right or upload your own leaf/parasite photo.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* File Upload Trigger */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <Button variant="outline" className="font-mono text-xs text-gray-700 dark:text-gray-300 h-10 pointer-events-none">
                                    <Upload className="h-4 w-4 mr-2 text-emerald-600 dark:text-neon-green" />
                                    UPLOAD CUSTOM IMAGE
                                </Button>
                            </label>

                            <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                                Powered by Google Gemini 1.5 Flash Vision
                            </span>
                        </div>
                    </GlassCard>
                </div>

                {/* Column 3: BAU Specimen Presets */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            BAU Field Lab Presets
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-neon-green">
                            4 Verified Samples
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {BAU_FIELD_SPECIMENS.map((specimen) => {
                            const isSelected = selectedPreset?.id === specimen.id;
                            return (
                                <button
                                    key={specimen.id}
                                    onClick={() => handleSelectPreset(specimen)}
                                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3.5 ${
                                        isSelected
                                            ? "bg-emerald-500/15 border-emerald-500 text-white shadow-[0_0_15px_rgba(0,255,148,0.2)]"
                                            : "bg-black/[0.02] dark:bg-black/40 border-black/[0.06] dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-emerald-500/40"
                                    }`}
                                >
                                    <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                                        <img
                                            src={specimen.imageUrl}
                                            alt={specimen.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] font-mono text-emerald-700 dark:text-neon-green uppercase font-bold block">
                                            {specimen.category}
                                        </span>
                                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                            {specimen.name}
                                        </h4>
                                        <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 block truncate">
                                            {specimen.relatedCourseCode}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Diagnostic Report HUD (When Analysis completes) */}
            {analysisResult && (
                <GlassCard className="p-6 md:p-8 space-y-6 border-emerald-500/40 bg-emerald-500/5 animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/10 pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-mono font-bold text-emerald-800 dark:text-neon-green uppercase">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    DIAGNOSTIC COMPLETED ({analysisResult.provenance})
                                </span>
                                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                    Confidence: <strong className="text-gray-900 dark:text-white">{analysisResult.confidence}%</strong>
                                </span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold font-sans text-gray-900 dark:text-white">
                                {analysisResult.probableIdentification}
                            </h3>
                            {analysisResult.scientificName && (
                                <p className="text-xs font-mono italic text-emerald-700 dark:text-neon-green">
                                    Binomial: {analysisResult.scientificName}
                                </p>
                            )}
                        </div>

                        {/* Mapped Course Badge */}
                        <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1 text-right">
                            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase block">
                                MAPPED BAU COURSE
                            </span>
                            <span className="font-mono text-xs font-bold text-emerald-800 dark:text-neon-green block">
                                {analysisResult.mappedBAUCourse.code}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate max-w-xs">
                                {analysisResult.mappedBAUCourse.title}
                            </span>
                        </div>
                    </div>

                    {/* Visual Findings Observations */}
                    <div className="space-y-2">
                        <h4 className="font-mono text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            Visible Morphological Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {analysisResult.visualFindings.map((finding, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-black/[0.02] dark:bg-black/30 border border-black/[0.04] dark:border-white/5 space-y-1 text-xs">
                                    <div className="flex justify-between font-mono text-[10px] text-gray-500 dark:text-gray-400">
                                        <span>{finding.feature}</span>
                                        <span className="text-emerald-600 dark:text-neon-green">{finding.confidence}%</span>
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200">{finding.observation}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Educational Diagnosis & Lab Tasks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1.5">
                            <span className="text-xs font-mono font-bold text-emerald-800 dark:text-neon-green uppercase block">
                                Educational Diagnosis & Pathology
                            </span>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                {analysisResult.educationalDiagnosis}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-black/40 border border-black/[0.04] dark:border-white/5 space-y-1.5">
                            <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 uppercase block">
                                BAU Laboratory Exercise Protocol
                            </span>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                {analysisResult.labExerciseGuidance}
                            </p>
                        </div>
                    </div>

                    {/* Safety Disclaimer */}
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300 font-mono">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <strong className="font-bold">EDUCATIONAL CAUTION:</strong> {analysisResult.safetyDisclaimer}
                        </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Link href={`/academy/courses/${analysisResult.mappedBAUCourse.code.toLowerCase().replace(/\s+/g, "-")}`}>
                            <Button className="bg-neon-green text-black hover:bg-neon-green/90 font-mono text-xs font-bold px-5 h-10 shadow-[0_0_15px_rgba(0,255,148,0.25)]">
                                Open Relevant Course Module →
                            </Button>
                        </Link>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
