"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Swords, Zap, CheckCircle2, AlertCircle, HelpCircle, Send } from "lucide-react";
import { submitProblemCode } from "@/actions/problems";
import { useRouter } from "next/navigation";

interface ArenaSolverModalProps {
    problem: {
        id: string;
        title: string;
        slug: string;
        description: string;
        difficulty: string | number;
        tags: string[];
        hints: string[];
        xp_reward: number;
    };
    userSubmission?: {
        status: string;
        xp_earned: number;
    } | null;
    attemptsLeft: number;
}

export function ArenaSolverModal({ problem, userSubmission, attemptsLeft }: ArenaSolverModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
    const [answer, setAnswer] = useState("");
    const [showHint, setShowHint] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; xp?: number } | null>(null);

    const isSolved = userSubmission?.status === "approved";
    const isPending = userSubmission?.status === "pending";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim() && !answer.trim()) return;

        setSubmitting(true);
        setResult(null);

        try {
            const res = await submitProblemCode({
                problem_id: problem.id,
                code_submission: code.trim() || answer.trim(),
                time_taken_seconds: 60,
                answer: answer.trim(),
            });

            if (res.success) {
                if (res.graded && res.correct) {
                    setResult({
                        success: true,
                        message: `SOLVED! You earned +${res.xp_awarded || problem.xp_reward} XP!`,
                        xp: res.xp_awarded || problem.xp_reward,
                    });
                } else if (res.graded && !res.correct) {
                    setResult({
                        success: false,
                        message: "Incorrect answer. Check your calculation or code logic and try again!",
                    });
                } else {
                    setResult({
                        success: true,
                        message: "Submission received! Admin review is in progress.",
                    });
                }
                router.refresh();
            } else {
                setResult({
                    success: false,
                    message: res.error || "Submission failed.",
                });
            }
        } catch (err: any) {
            setResult({
                success: false,
                message: err.message || "An unexpected error occurred.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className={`w-full justify-between font-bold h-10 ${
                        isSolved
                            ? "bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20"
                            : isPending
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                            : "bg-neon-green text-black hover:bg-neon-green/90"
                    }`}
                >
                    <span>
                        {isSolved ? "SOLVED" : isPending ? "PENDING REVIEW" : "SOLVE CHALLENGE"}
                    </span>
                    {isSolved ? (
                        <CheckCircle2 className="h-4 w-4 text-neon-green" />
                    ) : (
                        <Swords className="h-4 w-4" />
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl bg-agri-dark border-cyber-gray text-white p-6 space-y-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                            problem.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            problem.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                            {problem.difficulty}
                        </span>
                        <span className="text-neon-green font-mono font-bold flex items-center gap-1">
                            <Zap className="h-4 w-4 fill-current" /> +{problem.xp_reward} XP
                        </span>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-white mt-2">
                        {problem.title}
                    </DialogTitle>
                </DialogHeader>

                {/* Problem Description */}
                <div className="space-y-4">
                    <div className="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5 whitespace-pre-line">
                        {problem.description}
                    </div>

                    {/* Hints Dropdown */}
                    {problem.hints && problem.hints.length > 0 && (
                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowHint(!showHint)}
                                className="text-xs text-amber-400 border-amber-500/30 hover:bg-amber-500/10 gap-1.5"
                            >
                                <HelpCircle className="h-3.5 w-3.5" />
                                {showHint ? "Hide Hint" : "Show Hint"}
                            </Button>
                            {showHint && (
                                <div className="mt-2 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                                    💡 {problem.hints[0]}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider block">
                            Direct Answer / Output Value
                        </label>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="e.g. 0.74 or Normalized Difference Vegetation Index"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-neon-green outline-none font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider block">
                            Code / Logic Implementation (Optional)
                        </label>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows={5}
                            placeholder="Paste your R or JavaScript/GEE code snippet here..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-xs font-mono text-gray-200 focus:border-neon-green outline-none resize-none"
                        />
                    </div>

                    {/* Feedback Alert */}
                    {result && (
                        <div className={`p-4 rounded-xl text-sm font-mono flex items-center gap-3 ${
                            result.success ? "bg-neon-green/10 border border-neon-green/30 text-neon-green" : "bg-red-500/10 border border-red-500/30 text-red-400"
                        }`}>
                            {result.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                            <span>{result.message}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-xs font-mono text-gray-500">
                            Attempts left today: <strong className="text-white">{attemptsLeft}</strong>
                        </span>
                        <Button
                            type="submit"
                            disabled={submitting || attemptsLeft <= 0 || (!code.trim() && !answer.trim())}
                            className="bg-neon-green text-black hover:bg-neon-green/90 font-bold px-6"
                        >
                            <Send className="mr-2 h-4 w-4" />
                            {submitting ? "SUBMITTING..." : "SUBMIT SOLUTION"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
