import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Swords, Plus, Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";
import { getAdminProblems, togglePublishProblem } from "@/actions/admin-problems";
import { requireAdmin } from "@/lib/auth/assert-role";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin — Problems Management" };
export const dynamic = "force-dynamic";

export default async function AdminProblemsPage() {
    await requireAdmin();
    const problems = await getAdminProblems();

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <SectionHeading title="Problem Management" subtitle="ARENA COMMAND" className="mb-0" />
                    <p className="text-gray-400 text-sm mt-1">Create, edit, and publish problem challenges for cadets.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin">
                        <Button variant="outline">Back to Admin</Button>
                    </Link>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                        <Swords className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{problems.length}</div>
                        <div className="text-xs text-gray-400 font-mono">TOTAL PROBLEMS</div>
                    </div>
                </GlassCard>
                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{problems.filter(p => p.is_published).length}</div>
                        <div className="text-xs text-gray-400 font-mono">PUBLISHED</div>
                    </div>
                </GlassCard>
                <GlassCard className="p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{problems.filter(p => !p.is_published).length}</div>
                        <div className="text-xs text-gray-400 font-mono">DRAFTS</div>
                    </div>
                </GlassCard>
            </div>

            {/* Problems Table */}
            <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">All Arena Problems</h3>
                    <span className="text-xs text-gray-400 font-mono">{problems.length} items</span>
                </div>

                <div className="divide-y divide-white/[0.04] overflow-x-auto">
                    {problems.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider bg-white/[0.02]">
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Difficulty</th>
                                    <th className="p-4">Tags</th>
                                    <th className="p-4">Reward</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04] text-sm">
                                {problems.map((prob) => (
                                    <tr key={prob.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 font-medium text-white">
                                            <div>{prob.title}</div>
                                            <div className="text-xs text-gray-500 font-mono">{prob.slug}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                                                prob.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                prob.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}>
                                                {prob.difficulty}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(prob.tags || []).slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono font-bold text-neon-green">
                                            +{prob.xp_reward || 150} XP
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                                prob.is_published ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            }`}>
                                                {prob.is_published ? "PUBLISHED" : "DRAFT"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <form action={async () => {
                                                "use server";
                                                await togglePublishProblem(prob.id, !prob.is_published);
                                            }}>
                                                <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                                                    {prob.is_published ? (
                                                        <>
                                                            <EyeOff className="h-3.5 w-3.5" /> Unpublish
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="h-3.5 w-3.5" /> Publish
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-400 font-mono">
                            No problems found in database.
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
