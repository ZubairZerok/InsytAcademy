// app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BAU_FACULTIES, getFacultyByCode } from "@/lib/bau-data/faculties";
import type { BAUFacultyCode } from "@/types/bau";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
    GraduationCap, BookOpen, Sparkles, CheckCircle2, ArrowRight,
    Leaf, Stethoscope, ShieldAlert, TrendingUp, Cpu, Anchor, ChevronLeft
} from "lucide-react";
import Link from "next/link";

const FACULTY_ICONS: Record<string, any> = {
    FOA: Leaf,
    FVS: Stethoscope,
    FAH: ShieldAlert,
    FAERS: TrendingUp,
    FAET: Cpu,
    FOF: Anchor,
};

const GOALS = [
    { id: "bcs", title: "BCS Agriculture / Technical Cadre", desc: "Focus on DAE/DLS syllabus, agronomy practicals, and government recruitment." },
    { id: "research", title: "Scientific Officer / NARS Research", desc: "Focus on statistical design (RCBD), laboratory biometrics, and peer-reviewed publishing." },
    { id: "abroad", title: "Higher Studies & Fellowships (MS/PhD)", desc: "Target 3.60+ CGPA, oral viva fluency, and international proposal writing." },
    { id: "honors", title: "Academic Excellence (Dean's Award)", desc: "10/20/70 continuous assessment optimization and high-grade semester finals." },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form State
    const [selectedFacultyCode, setSelectedFacultyCode] = useState<BAUFacultyCode>("FAERS");
    const [selectedDeptCode, setSelectedDeptCode] = useState<string>("AE");
    const [selectedDegreeName, setSelectedDegreeName] = useState<string>("B.Sc. Agricultural Economics (Hons.)");
    const [level, setLevel] = useState<1 | 2 | 3 | 4>(2);
    const [semester, setSemester] = useState<1 | 2>(1);
    const [selectedGoal, setSelectedGoal] = useState<string>("BCS Agriculture / Technical Cadre");
    const [fullName, setFullName] = useState<string>("BAU Scholar");
    const [studentId, setStudentId] = useState<string>("2108102");

    const currentFaculty = getFacultyByCode(selectedFacultyCode) || BAU_FACULTIES[3];

    const handleSelectFaculty = (code: BAUFacultyCode) => {
        setSelectedFacultyCode(code);
        const fac = getFacultyByCode(code);
        if (fac && fac.departments.length > 0) {
            const firstDept = fac.departments[0];
            setSelectedDeptCode(firstDept.code);
            if (firstDept.degrees.length > 0) {
                setSelectedDegreeName(firstDept.degrees[0].name);
            }
        }
    };

    const handleComplete = () => {
        const profile = {
            fullName,
            studentId,
            facultyCode: selectedFacultyCode,
            facultyName: currentFaculty.name,
            departmentCode: selectedDeptCode,
            departmentName: currentFaculty.departments.find(d => d.code === selectedDeptCode)?.name || "Department",
            degreeName: selectedDegreeName,
            level,
            semester,
            targetCGPA: 3.75,
            currentCGPA: 3.52,
            academicGoal: selectedGoal,
            isProfileComplete: true,
        };

        if (typeof window !== "undefined") {
            localStorage.setItem("insyt_bau_profile", JSON.stringify(profile));
        }

        router.push("/academy");
    };

    return (
        <div className="min-h-screen bg-agri-black text-white flex flex-col items-center justify-center p-4 md:p-8 bg-grid-pattern relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-green/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-3xl w-full space-y-8 relative z-10">
                {/* Header Branding */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-xs font-mono text-neon-green">
                        <Sparkles className="h-3.5 w-3.5" />
                        ACADEMIC PROFILE INITIALIZATION
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans">
                        Welcome to <span className="text-neon-green">INSYT BAU</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
                        Configure your academic coordinates for Bangladesh Agricultural University. Gemini will calibrate your personalized syllabus, routine, and AI viva room.
                    </p>
                </div>

                {/* Stepper HUD */}
                <div className="flex items-center justify-center gap-2 md:gap-4 font-mono text-xs">
                    {[
                        { s: 1, label: "Faculty & Dept" },
                        { s: 2, label: "Level & Semester" },
                        { s: 3, label: "Career & Goals" },
                    ].map(({ s, label }) => (
                        <div
                            key={s}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                step === s
                                    ? "bg-neon-green/10 border-neon-green text-neon-green font-bold shadow-[0_0_15px_rgba(0,255,148,0.15)]"
                                    : step > s
                                    ? "bg-white/[0.04] border-white/20 text-gray-300"
                                    : "bg-black/30 border-white/5 text-gray-400"
                            }`}
                        >
                            <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                                {step > s ? "✓" : s}
                            </span>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Faculty & Department Selection */}
                {step === 1 && (
                    <GlassCard className="p-6 md:p-8 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold flex items-center gap-2 font-mono">
                                <GraduationCap className="h-5 w-5 text-neon-green" />
                                Select Your BAU Faculty
                            </h2>
                            <p className="text-xs text-gray-400">Choose one of the 6 official degree-awarding faculties.</p>
                        </div>

                        {/* 6 Faculty Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {BAU_FACULTIES.map((fac) => {
                                const Icon = FACULTY_ICONS[fac.code] || Leaf;
                                const isSelected = selectedFacultyCode === fac.code;
                                return (
                                    <button
                                        key={fac.code}
                                        onClick={() => handleSelectFaculty(fac.code)}
                                        className={`flex flex-col text-left p-4 rounded-xl border transition-all text-xs ${
                                            isSelected
                                                ? "bg-neon-green/15 border-neon-green text-white shadow-[0_0_15px_rgba(0,255,148,0.2)]"
                                                : "bg-agri-dark/60 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-2">
                                            <div className={`p-2 rounded-lg ${isSelected ? "bg-neon-green text-black" : "bg-white/5 text-neon-green"}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span className="font-mono text-[10px] font-bold text-gray-400 uppercase">{fac.code}</span>
                                        </div>
                                        <span className="font-bold text-sm leading-snug">{fac.name}</span>
                                        <span className="text-[11px] text-gray-400 mt-1 line-clamp-2">{fac.description}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Department Selection */}
                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <label className="text-xs font-mono font-bold text-neon-green uppercase tracking-wider block">
                                Department within {currentFaculty.shortName}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {currentFaculty.departments.map((dept) => (
                                    <button
                                        key={dept.code}
                                        onClick={() => {
                                            setSelectedDeptCode(dept.code);
                                            if (dept.degrees.length > 0) setSelectedDegreeName(dept.degrees[0].name);
                                        }}
                                        className={`text-left p-3 rounded-lg border text-xs transition-all ${
                                            selectedDeptCode === dept.code
                                                ? "bg-neon-green/10 border-neon-green text-white font-bold"
                                                : "bg-black/30 border-white/5 text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        <span className="font-mono text-neon-green mr-1.5">[{dept.code}]</span>
                                        {dept.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={() => setStep(2)}
                                className="bg-neon-green text-black hover:bg-neon-green/90 font-bold px-6 h-11"
                            >
                                Continue to Cohort
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </GlassCard>
                )}

                {/* Step 2: Level & Semester Selection */}
                {step === 2 && (
                    <GlassCard className="p-6 md:p-8 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold flex items-center gap-2 font-mono">
                                <BookOpen className="h-5 w-5 text-neon-green" />
                                Current Academic Level & Semester
                            </h2>
                            <p className="text-xs text-gray-400">Select your active semester to load exact course prerequisites and routines.</p>
                        </div>

                        {/* Level & Semester Selectors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Undergraduate Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {([1, 2, 3, 4] as const).map((lvl) => (
                                        <button
                                            key={lvl}
                                            onClick={() => setLevel(lvl)}
                                            className={`p-3 rounded-xl border text-center font-mono text-sm transition-all ${
                                                level === lvl
                                                    ? "bg-neon-green text-black font-bold border-neon-green shadow-[0_0_15px_rgba(0,255,148,0.2)]"
                                                    : "bg-black/40 border-white/10 text-gray-300 hover:border-white/20"
                                            }`}
                                        >
                                            Level {lvl} ({lvl === 1 ? "1st Year" : lvl === 2 ? "2nd Year" : lvl === 3 ? "3rd Year" : "Final Year"})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase">Semester</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {([1, 2] as const).map((sem) => (
                                        <button
                                            key={sem}
                                            onClick={() => setSemester(sem)}
                                            className={`p-3 rounded-xl border text-center font-mono text-sm transition-all ${
                                                semester === sem
                                                    ? "bg-neon-green text-black font-bold border-neon-green shadow-[0_0_15px_rgba(0,255,148,0.2)]"
                                                    : "bg-black/40 border-white/10 text-gray-300 hover:border-white/20"
                                            }`}
                                        >
                                            Semester {sem} ({sem === 1 ? "Odd / Autumn" : "Even / Spring"})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Student ID & Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="text-xs font-mono text-gray-400 uppercase block mb-1.5">Student Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black/50 border border-white/15 rounded-lg px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-neon-green"
                                    placeholder="e.g. Hasan Zubair"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-mono text-gray-400 uppercase block mb-1.5">BAU Student Roll / ID</label>
                                <input
                                    type="text"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="w-full bg-black/50 border border-white/15 rounded-lg px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-neon-green"
                                    placeholder="e.g. 2108102"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-400 hover:text-white">
                                <ChevronLeft className="mr-1 h-4 w-4" /> Back
                            </Button>
                            <Button
                                onClick={() => setStep(3)}
                                className="bg-neon-green text-black hover:bg-neon-green/90 font-bold px-6 h-11"
                            >
                                Continue to Goals
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </GlassCard>
                )}

                {/* Step 3: Career & Academic Goals */}
                {step === 3 && (
                    <GlassCard className="p-6 md:p-8 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold flex items-center gap-2 font-mono">
                                <Sparkles className="h-5 w-5 text-neon-green" />
                                Primary Academic & Career Goal
                            </h2>
                            <p className="text-xs text-gray-400">INSYT BAU will weight your AI viva questions and recommended sprints toward your objective.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {GOALS.map((goal) => {
                                const isSelected = selectedGoal === goal.title;
                                return (
                                    <button
                                        key={goal.id}
                                        onClick={() => setSelectedGoal(goal.title)}
                                        className={`flex flex-col text-left p-4 rounded-xl border transition-all text-xs ${
                                            isSelected
                                                ? "bg-neon-green/15 border-neon-green text-white shadow-[0_0_15px_rgba(0,255,148,0.2)]"
                                                : "bg-agri-dark/60 border-white/10 text-gray-300 hover:border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1.5">
                                            <span className="font-bold text-sm text-white">{goal.title}</span>
                                            {isSelected && <CheckCircle2 className="h-4 w-4 text-neon-green" />}
                                        </div>
                                        <span className="text-gray-400 text-xs leading-relaxed">{goal.desc}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Summary Confirmation */}
                        <div className="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs space-y-1">
                            <div className="text-neon-green font-bold">CONFIGURED ACADEMIC PROFILE:</div>
                            <div className="text-gray-300">
                                {fullName} · {studentId} · {currentFaculty.code} ({currentFaculty.shortName})
                            </div>
                            <div className="text-gray-400">
                                {selectedDegreeName} · Level {level}, Semester {semester} · Goal: {selectedGoal}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-400 hover:text-white">
                                <ChevronLeft className="mr-1 h-4 w-4" /> Back
                            </Button>
                            <Button
                                onClick={handleComplete}
                                className="bg-neon-green text-black hover:bg-neon-green/90 font-bold px-8 h-12 text-sm shadow-[0_0_20px_rgba(0,255,148,0.3)]"
                            >
                                Launch BAU Academic OS
                                <Sparkles className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
