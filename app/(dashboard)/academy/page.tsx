import { getUserCourses } from "@/actions/get-user-courses";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";
import { Suspense } from "react";
import { Terminal, PlayCircle, CheckCircle, Sparkles } from "lucide-react";

import { AcademyHero } from "@/components/academy/academy-hero";
import { getRecommendedCourses } from "@/actions/recommendations";
import { getUserGamificationProfile, updateUserStreak } from "@/actions/gamification";
import { getUserBadges } from "@/actions/badges";
import { StreakHud } from "@/components/gamification/streak-hud";
import { BadgeShowcase } from "@/components/gamification/badge-showcase";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login?next=/academy");
    }

    const recommended = await getRecommendedCourses();
    const enrolledCourses = await getUserCourses();
    const gamificationProfile = await getUserGamificationProfile();
    const badges = await getUserBadges();

    // Auto-update streak on dashboard load
    await updateUserStreak();

    return (
        <div className="space-y-12">
            <Suspense fallback={
                <div className="h-32 rounded-2xl border border-white/10 bg-agri-dark/60 animate-pulse" aria-label="Loading hero stats..." />
            }>
                <AcademyHero />
            </Suspense>

            {/* Streak Protection HUD */}
            <StreakHud
                streakCount={gamificationProfile?.streak_count || 0}
                longestStreak={gamificationProfile?.longest_streak || 0}
                streakFreezes={gamificationProfile?.streak_freezes_available || 1}
            />

            {/* Active Operations (Enrolled Courses Progress) */}
            {enrolledCourses.length > 0 ? (
                <div className="space-y-6">
                    <SectionHeading title="My Enrolled Courses" subtitle="ACTIVE LEARNING PROTOCOLS" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {enrolledCourses.map((course) => (
                            <GlassCard key={course.id} className="flex flex-col gap-4 p-6 hover:bg-agri-dark/60 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold group-hover:text-emerald-700 dark:group-hover:text-neon-green transition-colors" style={{color: 'var(--text-primary)'}}>
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">{course.description}</p>
                                    </div>
                                    {course.progress === 100 && (
                                        <CheckCircle className="text-neon-green h-6 w-6" />
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-mono text-gray-400">
                                        <span>PROGRESS</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div
                                        className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5"
                                        role="progressbar"
                                        aria-valuenow={course.progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={`${course.title} progress: ${course.progress}%`}
                                    >
                                        <div
                                            className="h-full bg-neon-green transition-all duration-500"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-400 text-right">
                                        {course.completedLessons} / {course.totalLessons} LESSONS completed
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto">
                                    <Link href={course.nextLessonSlug ? `/academy/${course.slug}/${course.nextLessonSlug}` : `/academy/${course.slug}`}>
                                        <Button variant="outline" className="w-full justify-between group-hover:bg-neon-green group-hover:text-black">
                                            <span>{course.progress === 100 ? "REVIEW COURSE" : "CONTINUE SEQUENCE"}</span>
                                            <PlayCircle className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            ) : (
                /* Empty state directing user to Courses page */
                <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
                    <Terminal className="mb-4 h-12 w-12 text-gray-400 animate-pulse" />
                    <h3 className="text-xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>No Active Protocols</h3>
                    <p className="mt-2 max-w-sm text-gray-400 text-sm leading-relaxed mb-6">
                        You have not initialized any learning protocols yet. Go to the course roster to view available modules.
                    </p>
                    <Link href="/academy/courses">
                        <Button className="bg-neon-green hover:bg-neon-green/90 text-black font-semibold h-11 px-6">
                            BROWSE PROTOCOLS
                        </Button>
                    </Link>
                </GlassCard>
            )}

            {/* Insignia & Badge Showcase */}
            <BadgeShowcase badges={badges} />

            {/* Adaptive Learning Section */}
            {recommended.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-neon-green">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <h3 className="font-mono text-xs font-bold uppercase tracking-widest">ADAPTIVE INTELLIGENCE SUGGESTIONS</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {recommended.map((course) => (
                            <Link key={course.id} href={`/academy/${course.slug}`}>
                                <GlassCard className="p-4 flex items-center gap-4 hover:border-neon-green/30 transition-all group">
                                    <div className="h-10 w-10 shrink-0 rounded bg-neon-green/10 flex items-center justify-center">
                                        <Terminal className="h-5 w-5 text-neon-green" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold truncate group-hover:text-neon-green" style={{color: 'var(--text-primary)'}}>{course.title}</h4>
                                        <p className="text-[10px] text-gray-400 font-mono">BASED ON PERFORMANCE</p>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
