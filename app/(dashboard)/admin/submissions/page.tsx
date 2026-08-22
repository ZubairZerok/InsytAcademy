import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { FileCheck, Check, X, Clock, User, Code } from "lucide-react";
import { getPendingSubmissions, reviewSubmission } from "@/actions/admin-problems";
import { requireAdmin } from "@/lib/auth/assert-role";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin — Submission Queue" };
export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
    await requireAdmin();
    const submissions = await getPendingSubmissions();

    const pendingCount = submissions.filter(s => s.status === 'pending').length;
    const approvedCount = submissions.filter(s => s.status === 'approved').length;
    const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <SectionHeading title="Submission Review Queue" subtitle="EVALUATION COMMAND" className="mb-0" />
                    <p className="text-gray-400 text-sm mt-1">Review student code submissions and approve XP awards.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin">
                        <Button variant="outline">Back to Admin</Button>
                    </Link>
                </div>
            </div>

            {/* Counter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{pendingCount}</div>
                        <div className="text-xs text-gray-400 font-mono">PENDING REVIEW</div>
                    </div>
                </GlassCard>
                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Check className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{approvedCount}</div>
                        <div className="text-xs text-gray-400 font-mono">APPROVED</div>
                    </div>
                </GlassCard>
                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <X className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{rejectedCount}</div>
                        <div className="text-xs text-gray-400 font-mono">REJECTED</div>
                    </div>
                </GlassCard>
            </div>

            {/* Submissions List */}
            <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">All Student Submissions</h3>
                    <span className="text-xs text-gray-400 font-mono">{submissions.length} submissions</span>
                </div>

                <div className="divide-y divide-white/[0.04]">
                    {submissions.length > 0 ? (
                        submissions.map((sub: any) => (
                            <div key={sub.id} className="p-6 space-y-4 hover:bg-white/[0.01] transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white flex items-center gap-2">
                                                {sub.user_name}
                                                <span className="text-xs font-mono font-normal text-gray-400">({sub.user_role})</span>
                                            </h4>
                                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                Problem: <span className="text-neon-green font-bold">{sub.problem_title}</span> (+{sub.problem_xp} XP)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                                            sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                            sub.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                            'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                                        }`}>
                                            {sub.status.toUpperCase()}
                                        </span>

                                        {sub.status === 'pending' && (
                                            <div className="flex items-center gap-2">
                                                <form action={async () => {
                                                    "use server";
                                                    await reviewSubmission(sub.id, "approved", "Good solution!");
                                                }}>
                                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8">
                                                        <Check className="mr-1 h-3.5 w-3.5" /> Approve (+{sub.problem_xp} XP)
                                                    </Button>
                                                </form>

                                                <form action={async () => {
                                                    "use server";
                                                    await reviewSubmission(sub.id, "rejected", "Submission rejected.");
                                                }}>
                                                    <Button size="sm" variant="outline" className="text-red-400 hover:bg-red-500/10 border-red-500/30 h-8">
                                                        <X className="mr-1 h-3.5 w-3.5" /> Reject
                                                    </Button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submitted Code Box */}
                                <div className="rounded-lg bg-black/50 border border-white/10 p-4 overflow-x-auto font-mono text-xs text-gray-300">
                                    <div className="flex items-center justify-between text-gray-500 mb-2 border-b border-white/5 pb-2">
                                        <span className="flex items-center gap-1"><Code className="h-3.5 w-3.5" /> SUBMITTED SOLUTION</span>
                                        <span>Submitted: {new Date(sub.submitted_at || sub.started_at).toLocaleString()}</span>
                                    </div>
                                    <pre className="whitespace-pre-wrap leading-relaxed">{sub.code_submission}</pre>
                                </div>

                                {sub.admin_feedback && (
                                    <div className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded">
                                        Feedback: {sub.admin_feedback}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-400 font-mono">
                            No student submissions found.
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
