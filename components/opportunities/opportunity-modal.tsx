"use client";

import { useState } from "react";
import { Opportunity } from "@/types/opportunity";
import { applyForOpportunity } from "@/actions/opportunities";
import { Button } from "@/components/ui/button";
import { X, MapPin, DollarSign, Award, CheckCircle, AlertTriangle, Send, Loader2, Link2 } from "lucide-react";

interface OpportunityModalProps {
    opportunity: Opportunity | null;
    userLevel: number;
    onClose: () => void;
    onSuccess: () => void;
}

export function OpportunityModal({ opportunity, userLevel, onClose, onSuccess }: OpportunityModalProps) {
    const [coverNote, setCoverNote] = useState("");
    const [portfolioLink, setPortfolioLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [appliedSuccess, setAppliedSuccess] = useState(false);

    if (!opportunity) return null;

    const isQualified = userLevel >= opportunity.min_level_required;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverNote.trim()) {
            setErrorMsg("Please enter a short cover note outlining your relevant skills.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        const res = await applyForOpportunity(opportunity.id, coverNote, portfolioLink);
        setLoading(false);

        if (res.success) {
            setAppliedSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 1800);
        } else {
            setErrorMsg(res.error || "Failed to submit application.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-agri-dark/95 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header Info */}
                <div className="space-y-3 border-b border-white/10 pb-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon-green bg-neon-green/10 border border-neon-green/20 px-2.5 py-0.5 rounded-full">
                            {opportunity.opportunity_type.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                            <Award className="h-3.5 w-3.5 text-amber-400" />
                            <span>LVL {opportunity.min_level_required}+ REQUIRED</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {opportunity.title}
                    </h2>
                    <p className="text-sm font-mono text-neon-green font-semibold">
                        {opportunity.organization}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 pt-2">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{opportunity.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400">
                            <DollarSign className="h-4 w-4" />
                            <span>{opportunity.stipend_range}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                        POSITION OVERVIEW & RESPONSIBILITIES
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                        {opportunity.description}
                    </p>
                </div>

                {/* Required Skills */}
                <div className="space-y-2">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                        REQUIRED SKILLSETS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {opportunity.skills_required.map((skill, i) => (
                            <span key={i} className="text-xs font-mono bg-white/5 border border-white/10 text-gray-200 px-3 py-1 rounded-lg">
                                #{skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Application Section */}
                {opportunity.user_has_applied || appliedSuccess ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-mono flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-neon-green shrink-0" />
                        <div>
                            <div className="font-bold text-white">APPLICATION SUBMITTED!</div>
                            <div className="text-xs text-gray-300">Your cadet credentials and profile level have been sent to {opportunity.organization}.</div>
                        </div>
                    </div>
                ) : !isQualified ? (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-mono flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                        <div>
                            <div className="font-bold">CADET LEVEL REQUIREMENT UNMET</div>
                            <div className="text-xs text-gray-300">
                                This position requires Cadet Level {opportunity.min_level_required}+. Your current profile level is Level {userLevel}. Complete more course lessons to level up!
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-white/10">
                        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Send className="h-4 w-4 text-neon-green" />
                            SUBMIT APPLICATION TO {opportunity.organization.toUpperCase()}
                        </h3>

                        {errorMsg && (
                            <div className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-gray-400">
                                Cover Note / Why are you a good fit? *
                            </label>
                            <textarea
                                value={coverNote}
                                onChange={(e) => setCoverNote(e.target.value)}
                                rows={3}
                                placeholder="Highlight your relevant R, GEE, or spatial analysis project experience..."
                                className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm text-white placeholder-gray-600 focus:border-neon-green/40 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-gray-400 flex items-center gap-1">
                                <Link2 className="h-3.5 w-3.5 text-neon-green" />
                                GitHub / Research Portfolio Link (Optional)
                            </label>
                            <input
                                type="url"
                                value={portfolioLink}
                                onChange={(e) => setPortfolioLink(e.target.value)}
                                placeholder="https://github.com/your-username or researchgate link"
                                className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm text-white placeholder-gray-600 focus:border-neon-green/40 focus:outline-none transition-all font-mono"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="text-xs font-mono text-gray-400 hover:text-white"
                            >
                                CANCEL
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-neon-green text-black font-bold hover:bg-neon-green/90 font-mono text-xs px-6"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> SUBMITTING...
                                    </>
                                ) : (
                                    "SUBMIT APPLICATION"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
