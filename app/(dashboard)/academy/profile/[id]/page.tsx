import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { User, Shield, BookOpen } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
    params: {
        id: string;
    };
}

interface EnrollmentResult {
    course_id: string;
    courses: {
        id: string;
        title: string;
        slug: string;
        description: string | null;
    } | null;
}

export default async function UserProfilePage({ params }: Props) {
    const supabase = createClient();
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", params.id)
        .single();
        
    if (profileError || !profile) {
        return notFound();
    }
    
    // Fetch enrolled courses
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select(`
            course_id,
            courses (
                id,
                title,
                slug,
                description
            )
        `)
        .eq("user_id", params.id);

    // Format enrolled courses safely with type safety
    const enrolledCourses = ((enrollments as unknown as EnrollmentResult[]) || [])
        .map(e => e.courses)
        .filter((c): c is NonNullable<typeof c> => c !== null);

    const xp = profile.xp || 0;
    const level = profile.level || 1;
    const role = profile.role || "Cadet";
    const fullName = profile.full_name || "Agent";

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <SectionHeading
                title={`${fullName}'s Credentials`}
                subtitle="PUBLIC DOSSIER"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Identity Card */}
                <GlassCard className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-bl-full transition-all group-hover:bg-neon-green/10" />
                    
                    <div className="h-24 w-24 min-w-[6rem] rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-3xl font-extrabold text-emerald-700 dark:text-neon-green mb-4 flex-shrink-0">
                        {fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1 font-mono tracking-tight w-full overflow-hidden text-ellipsis whitespace-nowrap px-2" style={{color: 'var(--text-primary)'}}>{fullName}</h3>
                    <p className="text-xs text-gray-400 font-mono mb-4 w-full truncate px-2">Level {level} Operator</p>
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-emerald-700 dark:text-neon-green text-xs font-mono font-bold uppercase tracking-wider mb-6">
                        <Shield className="h-3 w-3" />
                        {role}
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                        <div className="text-center">
                            <span className="text-[10px] text-gray-400 font-mono block">TOTAL XP</span>
                            <span className="text-lg font-bold text-neon-green font-mono">{xp.toLocaleString()}</span>
                        </div>
                        <div className="text-center border-l border-white/5">
                            <span className="text-[10px] text-gray-400 font-mono block">COURSES</span>
                            <span className="text-lg font-bold text-white font-mono">{enrolledCourses.length}</span>
                        </div>
                    </div>
                </GlassCard>

                {/* Identity Metadata & Specializations */}
                <GlassCard className="lg:col-span-2 p-8 relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono">
                            <User className="text-neon-green h-5 w-5" />
                            AGENT SPECIFICATIONS
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-mono">
                            <div className="space-y-1 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">CODENAME</span>
                                <span className="text-sm font-bold text-white">{fullName}</span>
                            </div>
                            <div className="space-y-1 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">SECTOR BRANCH</span>
                                <span className="text-sm font-bold text-neon-green uppercase">{profile.sector || "UNASSIGNED"}</span>
                            </div>
                            <div className="space-y-1 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">SUB-SECTOR</span>
                                <span className="text-sm font-bold text-white uppercase">{profile.sub_sector || "STANDBY"}</span>
                            </div>
                            <div className="space-y-1 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">CLEARANCE ROLE</span>
                                <span className="text-sm font-bold text-neon-green uppercase">{role}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-[10px] font-mono text-gray-400 border-t border-white/5 pt-4 flex justify-between items-center">
                        <span>DATA RETRIEVED FROM SECURE CACHE</span>
                        <span>STATUS: ACTIVE</span>
                    </div>
                </GlassCard>
            </div>

            {/* Active Courses */}
            <GlassCard className="p-6 space-y-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2 font-mono pb-2 border-b border-white/5">
                    <BookOpen className="text-neon-green h-4 w-4" />
                    STUDYING CURRICULUM
                </h3>
                
                {enrolledCourses.length === 0 ? (
                    <div className="text-center py-10 font-mono text-xs text-gray-400">
                        No course records cataloged for this agent.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {enrolledCourses.map((course) => (
                            <Link href={`/academy/${course.slug}`} key={course.id} className="block">
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-neon-green/30 transition-all">
                                    <h4 className="text-sm font-bold text-white font-mono">{course.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
