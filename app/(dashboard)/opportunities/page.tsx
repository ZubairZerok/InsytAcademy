"use client";

import { useState, useEffect } from "react";
import { getOpportunities, applyForOpportunity } from "@/actions/opportunities";
import { Opportunity } from "@/types/opportunity";
import { Button } from "@/components/ui/button";
import {
    Search, Briefcase, MapPin, DollarSign, Award, CheckCircle,
    Sparkles, Building2, Send, Loader2, Link2, ExternalLink,
    ChevronRight, Clock, ShieldCheck, UserCheck, AlertTriangle
} from "lucide-react";

export default function OpportunitiesPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [userLevel, setUserLevel] = useState<number>(1);
    const [selectedType, setSelectedType] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

    // Application form state inside right detail pane
    const [coverNote, setCoverNote] = useState("");
    const [portfolioLink, setPortfolioLink] = useState("");
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState("");
    const [applySuccess, setApplySuccess] = useState(false);

    const loadOpportunities = async () => {
        setLoading(true);
        const res = await getOpportunities(selectedType, searchQuery);
        setOpportunities(res.opportunities);
        setUserLevel(res.userLevel);
        if (res.opportunities.length > 0 && !selectedOpp) {
            setSelectedOpp(res.opportunities[0]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadOpportunities();
    }, [selectedType]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loadOpportunities();
    };

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOpp) return;
        if (!coverNote.trim()) {
            setApplyError("Please enter a brief cover note summarizing your experience.");
            return;
        }

        setApplying(true);
        setApplyError("");

        const res = await applyForOpportunity(selectedOpp.id, coverNote, portfolioLink);
        setApplying(false);

        if (res.success) {
            setApplySuccess(true);
            // Update local state to show applied
            setOpportunities(prev =>
                prev.map(o => o.id === selectedOpp.id ? { ...o, user_has_applied: true } : o)
            );
            setSelectedOpp(prev => prev ? { ...prev, user_has_applied: true } : null);
        } else {
            setApplyError(res.error || "Application submission failed.");
        }
    };

    const categories = [
        { id: "all", label: "All Opportunities" },
        { id: "ra_position", label: "RA Positions" },
        { id: "internship", label: "Internships" },
        { id: "project_grant", label: "Project Grants" },
        { id: "gig", label: "Cadet Gigs" },
    ];

    const getOrgAvatarColor = (org: string) => {
        if (org.includes("BAU")) return "bg-emerald-600 text-white";
        if (org.includes("IRRI")) return "bg-blue-600 text-white";
        if (org.includes("FAO")) return "bg-cyan-600 text-white";
        return "bg-purple-600 text-white";
    };

    return (
        <div className="space-y-6 pb-20">
            {/* LinkedIn Style Top Header */}
            <div className="rounded-2xl border border-white/10 bg-agri-dark/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-neon-green animate-ping" />
                        <span className="text-xs font-mono font-bold text-neon-green uppercase tracking-wider">
                            INSYT CAREER & RESEARCH FEED
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                        Research Positions & Talent Board
                    </h1>
                    <p className="text-xs md:text-sm text-gray-400 max-w-2xl">
                        Apply to verified Research Assistant positions, internships, and project grants with your Cadet Level credentials.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl">
                    <Award className="h-5 w-5 text-amber-400 shrink-0" />
                    <div>
                        <div className="text-[10px] font-mono text-gray-400 uppercase">CADET QUALIFICATION</div>
                        <div className="text-sm font-bold text-white font-mono">LEVEL {userLevel} CADET</div>
                    </div>
                </div>
            </div>

            {/* LinkedIn Style Search & Category Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-agri-dark/50 p-4 rounded-xl border border-white/10">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, skills (GEE, R, Spatial), lab, or location..."
                        className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-gray-500 focus:border-neon-green/40 focus:outline-none transition-all font-mono"
                    />
                </form>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedType(cat.id);
                                setApplySuccess(false);
                                setApplyError("");
                            }}
                            className={`text-xs font-mono font-bold px-3.5 py-2 rounded-lg border transition-all shrink-0 ${
                                selectedType === cat.id
                                    ? "bg-neon-green text-black border-neon-green font-bold shadow-[0_0_12px_rgba(0,255,148,0.3)]"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* LinkedIn Master-Detail Split Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN: LinkedIn Job Feed List (5 Columns) */}
                <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                        ))
                    ) : opportunities.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-agri-dark/60 p-8 text-center space-y-3">
                            <Briefcase className="h-10 w-10 text-gray-600 mx-auto" />
                            <div className="text-sm font-bold text-white">No Positions Found</div>
                            <div className="text-xs text-gray-400">Try adjusting your search terms or filter selection.</div>
                        </div>
                    ) : (
                        opportunities.map((opp) => {
                            const isSelected = selectedOpp?.id === opp.id;
                            const isQualified = userLevel >= opp.min_level_required;

                            return (
                                <div
                                    key={opp.id}
                                    onClick={() => {
                                        setSelectedOpp(opp);
                                        setApplySuccess(false);
                                        setApplyError("");
                                    }}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative group ${
                                        isSelected
                                            ? "bg-neon-green/10 border-neon-green shadow-[0_0_20px_rgba(0,255,148,0.15)]"
                                            : "bg-agri-dark/70 border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                                    }`}
                                >
                                    {/* Top Org & Title Header */}
                                    <div className="flex items-start gap-3">
                                        {/* Company Avatar */}
                                        <div className={`h-10 w-10 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold font-mono shadow-md ${getOrgAvatarColor(opp.organization)}`}>
                                            {opp.organization.slice(0, 3).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-sm font-bold truncate transition-colors ${isSelected ? "text-neon-green" : "text-white group-hover:text-neon-green"}`}>
                                                {opp.title}
                                            </h3>
                                            <div className="text-xs font-mono text-gray-400 truncate">
                                                {opp.organization}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location & Stipend */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {opp.location}
                                        </span>
                                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                                            <DollarSign className="h-3 w-3" /> {opp.stipend_range}
                                        </span>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                                        <span className={`px-2 py-0.5 rounded font-bold uppercase border ${
                                            isQualified
                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                        }`}>
                                            LVL {opp.min_level_required}+ REQ
                                        </span>

                                        {opp.user_has_applied ? (
                                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" /> APPLIED
                                            </span>
                                        ) : (
                                            <span className="text-neon-green font-bold flex items-center gap-1">
                                                <ZapIcon /> EASY APPLY
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* RIGHT COLUMN: LinkedIn Selected Job Details Pane (7 Columns) */}
                <div className="lg:col-span-7">
                    {selectedOpp ? (
                        <div className="rounded-2xl border border-white/10 bg-agri-dark/90 p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl sticky top-20">

                            {/* Job Header */}
                            <div className="space-y-4 border-b border-white/10 pb-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold font-mono shadow-lg ${getOrgAvatarColor(selectedOpp.organization)}`}>
                                            {selectedOpp.organization.slice(0, 3).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white leading-snug">
                                                {selectedOpp.title}
                                            </h2>
                                            <div className="text-xs font-mono text-neon-green font-semibold">
                                                {selectedOpp.organization}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>{selectedOpp.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                        <DollarSign className="h-4 w-4" />
                                        <span>{selectedOpp.stipend_range}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-400">
                                        <Award className="h-4 w-4" />
                                        <span>LVL {selectedOpp.min_level_required}+ QUALIFICATION</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                                    ABOUT THE POSITION & RESPONSIBILITIES
                                </h3>
                                <div className="text-sm text-gray-300 leading-relaxed bg-white/[0.02] border border-white/5 p-5 rounded-xl space-y-2">
                                    {selectedOpp.description}
                                </div>
                            </div>

                            {/* Skill Tags */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                                    REQUIRED SKILLSETS
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedOpp.skills_required.map((skill, i) => (
                                        <span key={i} className="text-xs font-mono bg-neon-green/10 border border-neon-green/20 text-neon-green px-3 py-1 rounded-lg">
                                            #{skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* LinkedIn Style Inline "Easy Apply" Section */}
                            <div className="border-t border-white/10 pt-6 space-y-4">
                                {selectedOpp.user_has_applied || applySuccess ? (
                                    <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-neon-green shrink-0" />
                                        <div>
                                            <div className="font-bold text-white text-base">APPLICATION SUBMITTED!</div>
                                            <div className="text-xs text-gray-300">
                                                Your cadet profile credentials and level status were sent to {selectedOpp.organization}.
                                            </div>
                                        </div>
                                    </div>
                                ) : userLevel < selectedOpp.min_level_required ? (
                                    <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono flex items-center gap-3">
                                        <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                                        <div>
                                            <div className="font-bold text-white text-sm">CADET LEVEL REQUIREMENT UNMET</div>
                                            <div className="text-xs text-gray-300">
                                                Requires Level {selectedOpp.min_level_required}+. Your current status is Level {userLevel}. Complete more lessons to level up!
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplySubmit} className="space-y-4 bg-white/[0.02] border border-white/10 p-5 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                <Send className="h-4 w-4 text-neon-green" />
                                                EASY APPLY WITH CADET PROFILE
                                            </h3>
                                            <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/20">
                                                VERIFIED CADET LEVEL {userLevel}
                                            </span>
                                        </div>

                                        {applyError && (
                                            <div className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                                                {applyError}
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono text-gray-400">
                                                Cover Note / Brief Pitch *
                                            </label>
                                            <textarea
                                                value={coverNote}
                                                onChange={(e) => setCoverNote(e.target.value)}
                                                rows={3}
                                                placeholder="Summarize your R, GEE, or agricultural spatial modeling background..."
                                                className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-sm text-white placeholder-gray-600 focus:border-neon-green/40 focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono text-gray-400 flex items-center gap-1">
                                                <Link2 className="h-3.5 w-3.5 text-neon-green" />
                                                GitHub / Portfolio Link (Optional)
                                            </label>
                                            <input
                                                type="url"
                                                value={portfolioLink}
                                                onChange={(e) => setPortfolioLink(e.target.value)}
                                                placeholder="https://github.com/your-username"
                                                className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs md:text-sm text-white placeholder-gray-600 focus:border-neon-green/40 focus:outline-none transition-all font-mono"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={applying}
                                            className="w-full bg-neon-green text-black font-bold hover:bg-neon-green/90 font-mono text-sm h-11 shadow-[0_0_20px_rgba(0,255,148,0.3)] transition-all"
                                        >
                                            {applying ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> SUBMITTING EASY APPLY...
                                                </>
                                            ) : (
                                                "SUBMIT EASY APPLY APPLICATION"
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/10 bg-agri-dark/60 p-12 text-center text-gray-400 font-mono text-sm">
                            Select an opportunity from the feed to view details and apply.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function ZapIcon() {
    return (
        <svg className="h-3 w-3 text-neon-green fill-neon-green" viewBox="0 0 24 24">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );
}
