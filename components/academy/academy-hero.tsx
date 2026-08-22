import { createClient } from "@/lib/supabase/server";
import { Zap, Target } from "lucide-react";
import { calcLevel, xpRequiredForLevel, getTierForLevel } from "@/lib/gamification/constants";

export async function AcademyHero() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("total_xp, level, role")
        .eq("id", user.id)
        .single();

    const xp = profile?.total_xp || 0;
    const level = calcLevel(xp);
    const tier = getTierForLevel(level);
    const role = profile?.role || "Cadet";

    const xpFloor = xpRequiredForLevel(level);
    const xpCeil = xpRequiredForLevel(level + 1);
    const xpInLevel = Math.max(0, xp - xpFloor);
    const xpNeeded = xpCeil - xpFloor;
    const progressPercent = xpNeeded > 0 ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

    // Calculate Accuracy
    const { count: totalAttempts } = await supabase
        .from("quiz_attempts")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id);

    const { count: correctAttempts } = await supabase
        .from("quiz_attempts")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("is_correct", true);

    const accuracy = totalAttempts && totalAttempts > 0
        ? Math.round((correctAttempts! / totalAttempts) * 100)
        : null; // null = no attempts yet, show '—' instead of misleading 100%

    return (
        <div className="relative overflow-hidden rounded-2xl border border-neon-green/30 bg-gradient-to-br from-agri-dark/90 via-agri-dark/70 to-purple-950/20 p-6 backdrop-blur-xl md:p-8 shadow-[0_0_40px_rgba(0,255,148,0.08)]">
            {/* Background Glows */}
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-neon-green/15 blur-3xl" />
            <div className="absolute left-1/2 -top-20 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* User Info */}
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neon-green/50 bg-black/50 text-2xl font-bold text-neon-green shadow-[0_0_20px_rgba(0,255,148,0.25)] flex-col">
                        <span className="text-[10px] text-gray-400 font-mono">LVL</span>
                        <span className="text-xl font-bold leading-none">{level}</span>
                    </div>
                    <div>
                        <h2 className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">OPERATOR TIER</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-2xl font-bold text-white tracking-tight flex items-center gap-1.5">
                                <span>{tier.badgeEmoji}</span>
                                <span className="gradient-text-cyber">{tier.title.toUpperCase()}</span>
                            </span>
                            <span className="rounded-full bg-neon-green/20 border border-neon-green/40 px-2.5 py-0.5 text-[10px] font-bold text-neon-green font-mono shadow-[0_0_10px_rgba(0,255,148,0.2)]">
                                ACTIVE
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress HUD */}
                <div className="flex-1 md:mx-12">
                    <div className="mb-2 flex justify-between text-xs font-mono text-gray-400">
                        <span>LEVEL {level} PROGRESS</span>
                        <span className="text-neon-green font-bold">{xpInLevel} / {xpNeeded} XP</span>
                    </div>
                    <div
                        className="h-3.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/10 p-0.5"
                        role="progressbar"
                        aria-valuenow={progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Level Progress: ${progressPercent}%`}
                    >
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-neon-green via-cyan-400 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,255,148,0.5)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 md:flex md:gap-8">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white/5 p-3 px-6 md:items-end">
                        <Zap className="mb-1 h-4 w-4 text-yellow-400" />
                        <span className="text-xl font-bold text-white">{xp}</span>
                        <span className="text-[10px] uppercase text-gray-500">Total XP</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white/5 p-3 px-6 md:items-end">
                        <Target className="mb-1 h-4 w-4 text-blue-400" />
                        <span className="text-xl font-bold text-white">{accuracy !== null ? `${accuracy}%` : "—"}</span>
                        <span className="text-[10px] uppercase text-gray-500">{accuracy !== null ? "Accuracy" : "No quizzes yet"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
