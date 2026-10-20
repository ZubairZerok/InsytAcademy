import { createClient } from "@/lib/supabase/server";
import { BookOpen, CheckCircle2, Target } from "lucide-react";

export async function AcademyHero() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, sector, sub_sector")
        .eq("id", user.id)
        .single();

    // 1. Enrolled Courses Count
    const { count: enrolledCount } = await supabase
        .from("enrollments")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id);

    // 2. Completed Lessons Count
    const { count: completedLessons } = await supabase
        .from("user_progress")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id);

    // 3. Total Platform Lessons Count (for overall curriculum benchmark)
    const { count: totalPlatformLessons } = await supabase
        .from("lessons")
        .select("id", { count: 'exact', head: true });

    const totalLessons = totalPlatformLessons || 142;
    const completedCount = completedLessons || 0;
    const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

    // 4. Calculate Quiz Accuracy
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
        : null;

    const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Researcher";
    const initials = displayName.trim().split(/\s+/).filter(Boolean).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "RS";
    const focusSector = profile?.sector || "GEOSPATIAL & AGRI DATA SCIENCE";

    return (
        <div className="relative overflow-hidden rounded-2xl border border-neon-green/30 bg-gradient-to-br from-agri-dark/95 via-agri-dark/80 to-emerald-950/25 p-6 backdrop-blur-xl md:p-8 shadow-[0_0_40px_rgba(0,255,148,0.08)]">
            {/* Ambient Background Glows */}
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-neon-green/15 blur-3xl pointer-events-none" />
            <div className="absolute left-1/2 -top-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Scholar Profile Identity */}
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neon-green/50 bg-black/60 text-xl font-mono font-bold text-neon-green shadow-[0_0_20px_rgba(0,255,148,0.25)] flex-shrink-0">
                        {initials}
                    </div>
                    <div>
                        <div className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">
                            {focusSector}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-0.5">
                            {displayName}
                        </h2>
                    </div>
                </div>

                {/* Academic Progress HUD */}
                <div className="flex-1 lg:mx-10 max-w-xl">
                    <div className="mb-2 flex justify-between text-xs font-mono text-gray-400">
                        <span className="uppercase tracking-wider">CURRICULUM ADVANCEMENT</span>
                        <span className="text-neon-green font-bold">{completedCount} / {totalLessons} LESSONS ({progressPercent}%)</span>
                    </div>
                    <div
                        className="h-3 w-full overflow-hidden rounded-full bg-black/60 border border-white/10 p-0.5"
                        role="progressbar"
                        aria-valuenow={progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Curriculum Progress: ${progressPercent}%`}
                    >
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-neon-green via-emerald-400 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,255,148,0.5)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Academic Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/5 p-3 px-4 text-center">
                        <BookOpen className="mb-1 h-4 w-4 text-emerald-400" />
                        <span className="text-xl font-bold text-white font-mono">{enrolledCount || 0}</span>
                        <span className="text-[10px] uppercase text-gray-400 font-mono">Courses</span>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/5 p-3 px-4 text-center">
                        <CheckCircle2 className="mb-1 h-4 w-4 text-neon-green" />
                        <span className="text-xl font-bold text-white font-mono">{completedCount}</span>
                        <span className="text-[10px] uppercase text-gray-400 font-mono">Completed</span>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/5 p-3 px-4 text-center">
                        <Target className="mb-1 h-4 w-4 text-cyan-400" />
                        <span className="text-xl font-bold text-white font-mono">{accuracy !== null ? `${accuracy}%` : "—"}</span>
                        <span className="text-[10px] uppercase text-gray-400 font-mono">Accuracy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

