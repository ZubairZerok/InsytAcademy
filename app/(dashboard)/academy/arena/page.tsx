import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Swords, Zap, Trophy, ShieldCheck, Flame, Tag } from "lucide-react";
import { getPublishedProblems } from "@/actions/problems";
import { getUserGamificationProfile } from "@/actions/gamification";
import { ArenaSolverModal } from "@/components/arena/arena-solver-modal";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "INSYT Arena — Competitive Challenges" };
export const dynamic = "force-dynamic";

export default async function ArenaPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login?next=/academy/arena");
    }

    const problems = await getPublishedProblems();
    const profile = await getUserGamificationProfile();

    const solvedCount = problems.filter(p => p.user_submission?.status === "approved").length;
    const pendingCount = problems.filter(p => p.user_submission?.status === "pending").length;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                <div>
                    <SectionHeading title="Problem Arena" subtitle="COMPETITIVE CHALLENGES" className="mb-0" />
                    <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
                        Test your remote sensing, GEE, R, and spatial analytical mastery against real-world problem sets. Earn instant XP and climb the global leaderboard.
                    </p>
                </div>
            </div>

            {/* Operator Arena Stats HUD */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{solvedCount} / {problems.length}</div>
                        <div className="text-xs text-gray-400 font-mono">CHALLENGES SOLVED</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                        <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{(profile?.total_xp || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-400 font-mono">TOTAL EARNED XP</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-flame-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                        <Flame className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{profile?.streak_count || 0} DAYS</div>
                        <div className="text-xs text-gray-400 font-mono">ACTIVE STREAK</div>
                    </div>
                </GlassCard>
            </div>

            {/* Problem Roster */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Swords className="h-4 w-4 text-neon-green" /> AVAILABLE ARENA CHALLENGES
                    </h3>
                    <span className="text-xs font-mono text-gray-400">{problems.length} Problems Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problems.length > 0 ? (
                        problems.map((prob) => {
                            const isSolved = prob.user_submission?.status === "approved";
                            const isPending = prob.user_submission?.status === "pending";

                            return (
                                <GlassCard
                                    key={prob.id}
                                    className={`p-6 flex flex-col justify-between gap-6 transition-all duration-200 hover:border-neon-green/30 group ${
                                        isSolved ? "border-neon-green/40 bg-neon-green/[0.02]" : ""
                                    }`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                                        prob.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                        prob.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                        'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    }`}>
                                                        {prob.difficulty}
                                                    </span>

                                                    {isSolved && (
                                                        <span className="text-[10px] font-mono font-bold text-neon-green bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 rounded flex items-center gap-1">
                                                            <ShieldCheck className="h-3 w-3" /> COMPLETED
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors mt-2">
                                                    {prob.title}
                                                </h4>
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <span className="text-neon-green font-mono font-bold text-sm block">
                                                    +{prob.xp_reward} XP
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                                            {prob.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {(prob.tags || []).map((t) => (
                                                <span key={t} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 flex items-center gap-1">
                                                    <Tag className="h-2.5 w-2.5" /> {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <ArenaSolverModal
                                            problem={prob}
                                            userSubmission={prob.user_submission}
                                            attemptsLeft={prob.attempts_left_today}
                                        />
                                    </div>
                                </GlassCard>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-16 text-center text-gray-400 font-mono border border-dashed border-white/10 rounded-2xl">
                            No published challenges available right now. Check back soon!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
