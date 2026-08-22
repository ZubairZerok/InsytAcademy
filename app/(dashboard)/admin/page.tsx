import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Swords, Clock, FileCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/assert-role";

export default async function AdminDashboardPage() {
    // Server-side admin gate (DB role, not a hardcoded email).
    await requireAdmin();

    const admin = createAdminClient();
    const { data: problems } = await admin.from('problems').select('*');
    const { data: submissions } = await admin.from('problem_attempts').select('*');

    const totalProblems = problems?.length ?? 0;
    const pendingSubmissions = submissions?.filter(s => s.status === 'pending').length ?? 0;

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <SectionHeading title="Administrator Access" subtitle="COMMAND CENTER" className="mb-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded bg-white/5 text-neon-green">
                            <Swords className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{totalProblems}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-1">TOTAL PROBLEMS</p>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded bg-white/5 text-amber-400">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{pendingSubmissions}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-1">PENDING SUBMISSIONS</p>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Problems Management */}
                <div className="space-y-6">
                    <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Swords className="h-4 w-4 text-neon-green" /> PROBLEM ARENA
                    </h3>
                    <GlassCard className="p-6 text-center">
                        <p className="text-gray-400 text-sm mb-6">Manage competitive programming problems.</p>
                        <Link href="/admin/problems">
                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                View Problems
                            </Button>
                        </Link>
                    </GlassCard>
                </div>

                {/* Submissions Management */}
                <div className="space-y-6">
                    <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-neon-green" /> SUBMISSIONS REVIEW
                    </h3>
                    <GlassCard className="p-6 text-center">
                        <p className="text-gray-400 text-sm mb-6">Review pending code submissions.</p>
                        <Link href="/admin/submissions">
                            <Button className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20">
                                Review Queue ({pendingSubmissions})
                            </Button>
                        </Link>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
