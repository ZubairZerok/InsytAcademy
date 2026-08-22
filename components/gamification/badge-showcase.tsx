"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Award, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import type { UserBadgeDisplay } from "@/types/gamification";

interface BadgeShowcaseProps {
    badges: UserBadgeDisplay[];
}

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = [
        { id: "all", label: "ALL BADGES" },
        { id: "learning", label: "LEARNING" },
        { id: "streak", label: "STREAKS" },
        { id: "arena", label: "ARENA" },
        { id: "xp", label: "XP & MILESTONES" },
    ];

    const filteredBadges = selectedCategory === "all"
        ? badges
        : badges.filter(b => b.category === selectedCategory);

    const unlockedCount = badges.filter(b => b.unlocked).length;

    const rarityStyles: Record<string, { border: string; bg: string; text: string; glow: string }> = {
        common: {
            border: "border-slate-500/30",
            bg: "bg-slate-500/10",
            text: "text-slate-300",
            glow: "shadow-none",
        },
        rare: {
            border: "border-cyan-500/40",
            bg: "bg-cyan-500/10",
            text: "text-cyan-400",
            glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
        },
        epic: {
            border: "border-purple-500/40",
            bg: "bg-purple-500/10",
            text: "text-purple-400",
            glow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
        },
        legendary: {
            border: "border-amber-400/50",
            bg: "bg-amber-500/10",
            text: "text-amber-400",
            glow: "shadow-[0_0_25px_rgba(251,191,36,0.3)]",
        },
    };

    return (
        <div className="space-y-6">
            {/* Header & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                        <Award className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            INSIGNIA SHOWCASE
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">
                            {unlockedCount} of {badges.length} Badges Unlocked
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                                selectedCategory === cat.id
                                    ? "bg-neon-green text-black"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBadges.map((badge) => {
                    const rarity = rarityStyles[badge.rarity] || rarityStyles.common;

                    return (
                        <GlassCard
                            key={badge.id}
                            className={`p-5 flex items-start gap-4 transition-all duration-300 relative overflow-hidden ${
                                badge.unlocked
                                    ? `${rarity.border} ${rarity.glow}`
                                    : "border-white/5 opacity-50 grayscale"
                            }`}
                        >
                            {/* Rarity Indicator Badge */}
                            <span className={`absolute top-3 right-3 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${rarity.border} ${rarity.bg} ${rarity.text}`}>
                                {badge.rarity}
                            </span>

                            {/* Badge Icon Box */}
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                                badge.unlocked ? `${rarity.border} ${rarity.bg}` : "border-white/10 bg-black/40"
                            }`}>
                                {badge.unlocked ? badge.icon : <Lock className="h-5 w-5 text-gray-500" />}
                            </div>

                            {/* Info */}
                            <div className="space-y-1 pr-12">
                                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                                    {badge.name}
                                    {badge.unlocked && <CheckCircle2 className="h-3.5 w-3.5 text-neon-green shrink-0" />}
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    {badge.description}
                                </p>
                                {badge.xp_bonus > 0 && (
                                    <span className="text-[10px] font-mono font-bold text-neon-green block pt-1">
                                        +{badge.xp_bonus} XP BONUS
                                    </span>
                                )}
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}
