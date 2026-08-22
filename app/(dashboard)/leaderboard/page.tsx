import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Trophy, Clock, ShieldCheck } from "lucide-react";
import { getLeaderboardData } from "@/actions/gamification";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Leaderboard" };
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login?next=/leaderboard");
    }

    const data = await getLeaderboardData();
    const leaders = data.entries || [];

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-20">
            <SectionHeading title="Leaderboard" subtitle="TOP OPERATIVES" />

            <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-white/[0.06] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-neon-green" />
                        <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                            XP Rankings
                        </h2>
                    </div>
                    {data.current_user_rank && (
                        <div className="text-xs font-mono text-neon-green bg-neon-green/10 border border-neon-green/20 px-3 py-1 rounded-full">
                            YOUR RANK: #{data.current_user_rank}
                        </div>
                    )}
                </div>

                <div className="divide-y divide-white/[0.04]">
                    {leaders.length > 0 ? (
                        leaders.map((entry) => {
                            const medal = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : null;
                            const initials = entry.display_name
                                ? entry.display_name.trim().split(/\s+/).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                                : "?";
                            return (
                                <div
                                    key={entry.user_id}
                                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                                        entry.is_current_user ? "bg-neon-green/5 border-l-2 border-neon-green" : "hover:bg-white/[0.02]"
                                    }`}
                                >
                                    <span className="w-8 text-center text-sm font-mono text-gray-500">
                                        {medal || `#${entry.rank}`}
                                    </span>
                                    <div className="h-9 w-9 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green flex-shrink-0">
                                        {initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                                                {entry.display_name}
                                            </p>
                                            {entry.is_staff && (
                                                <span className="flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">
                                                    <ShieldCheck className="h-3 w-3" /> STAFF
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 font-mono">
                                            LVL {entry.level || 1} · STREAK: {entry.streak_count || 0}d
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-neon-green font-bold font-mono">{(entry.total_xp || 0).toLocaleString()}</span>
                                        <span className="text-xs text-gray-500 ml-1">XP</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <Clock className="h-8 w-8 text-gray-600" />
                            <p className="text-gray-400">No rankings yet. Complete lessons to earn XP!</p>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
