// components/gamification/streak-hud.tsx
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Flame, Shield, Trophy } from "lucide-react";

interface StreakHudProps {
    streakCount: number;
    longestStreak: number;
    streakFreezes: number;
}

export function StreakHud({ streakCount, longestStreak, streakFreezes }: StreakHudProps) {
    const nextMilestone = [3, 7, 14, 30, 60, 100].find(m => m > streakCount) || 100;
    const progressToNext = Math.min(100, Math.round((streakCount / nextMilestone) * 100));

    return (
        <GlassCard className="p-6 border-orange-500/20 bg-gradient-to-r from-orange-500/[0.03] to-transparent">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Flame Counter */}
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 text-3xl shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse">
                        <Flame className="h-8 w-8 fill-orange-500 text-orange-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-white font-mono">{streakCount}</span>
                            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                                DAY STREAK
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                            Keep learning daily to protect your flame!
                        </p>
                    </div>
                </div>

                {/* Protection & Milestone HUD */}
                <div className="grid grid-cols-2 sm:flex items-center gap-4 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                    {/* Streak Freezes */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 px-4 flex items-center gap-3">
                        <Shield className="h-5 w-5 text-cyan-400" />
                        <div>
                            <div className="text-xs font-mono text-gray-400">STREAK FREEZE</div>
                            <div className="text-sm font-bold text-white font-mono">{streakFreezes} Active</div>
                        </div>
                    </div>

                    {/* Longest Record */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 px-4 flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-amber-400" />
                        <div>
                            <div className="text-xs font-mono text-gray-400">LONGEST RECORD</div>
                            <div className="text-sm font-bold text-white font-mono">{longestStreak} Days</div>
                        </div>
                    </div>

                    {/* Milestone Progress */}
                    <div className="col-span-2 sm:col-span-1 bg-black/40 border border-white/10 rounded-xl p-3 px-4 min-w-[160px]">
                        <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-1">
                            <span>NEXT GOAL</span>
                            <span className="text-orange-400 font-bold">{nextMilestone} DAYS</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                                style={{ width: `${progressToNext}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
