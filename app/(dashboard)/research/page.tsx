import { Microscope, Database, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { researchArticles } from "@/actions/research-articles";
import { GlassCard } from "@/components/ui/glass-card";

export const metadata = {
    title: "INSYT Research Hub | R-Powered Scientific Discovery",
    description: "The official open-access research feed for Insyt Academy. Groundbreaking research conducted with R and the broader scientific computing ecosystem — curated by PlAiNSYT.",
};

export default function ResearchHubPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="space-y-2 pb-6 border-b border-gray-100 dark:border-white/[0.06]">
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{color: 'var(--text-primary)'}}>
                    <Microscope className="h-8 w-8 text-emerald-600 dark:text-neon-green" />
                    Research Hub
                </h1>
                <p className="text-gray-400 dark:text-gray-400 max-w-3xl leading-relaxed">
                    Groundbreaking research conducted with <strong className="text-emerald-700 dark:text-neon-green font-mono">R</strong> and the scientific computing ecosystem — curated exclusively by <span className="font-mono text-emerald-700 dark:text-neon-green font-bold">PlAiNSYT</span>.
                </p>
            </div>

            {/* Statistics Board — using GlassCard for consistent theme behavior */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: Microscope, label: "FEATURED STUDIES", value: researchArticles.length },
                    { icon: Database, label: "R PACKAGES REFERENCED", value: "24+" },
                    { icon: FileSpreadsheet, label: "CURATOR & ADMIN", value: "PlAiNSYT" },
                ].map(({ icon: Icon, label, value }) => (
                    <GlassCard key={label} className="p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                            <Icon className="h-5 w-5 text-emerald-600 dark:text-neon-green" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold tracking-tight" style={{color: 'var(--text-primary)'}}>{value}</div>
                            <div className="text-[11px] text-gray-400 font-mono">{label}</div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Research Articles Feed */}
            <div className="space-y-5">
                <h2 className="text-sm font-bold tracking-widest uppercase font-mono text-gray-400">
                    FEATURED R ECOSYSTEM STUDIES
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {researchArticles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/research/${article.id}`}
                        >
                            <GlassCard className="group p-6 space-y-4 hover:border-emerald-500/30 dark:hover:border-white/[0.12] transition-all duration-200 cursor-pointer h-full">
                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Neutral discipline tag */}
                                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-white/[0.06] border border-emerald-200 dark:border-white/10 text-[11px] font-mono text-emerald-700 dark:text-gray-400 uppercase tracking-wider">
                                        {article.discipline}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">
                                        {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                            year: "numeric", month: "short", day: "numeric"
                                        })}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-bold leading-snug group-hover:text-emerald-700 dark:group-hover:text-neon-green transition-colors" style={{color: 'var(--text-primary)'}}>
                                    {article.title}
                                </h3>

                                {/* Author */}
                                <div className="flex items-center gap-2 text-xs font-mono">
                                    <div className="h-5 w-5 rounded bg-emerald-100 dark:bg-neon-green/20 border border-emerald-200 dark:border-neon-green/30 flex items-center justify-center text-[8px] font-bold text-emerald-700 dark:text-neon-green">P</div>
                                    <span className="text-emerald-700 dark:text-neon-green font-bold">{article.author}</span>
                                    <span className="text-gray-400">• {article.authorRole}</span>
                                </div>

                                {/* Abstract preview */}
                                <p className="text-sm text-gray-400 dark:text-gray-400 leading-relaxed line-clamp-3">
                                    {article.abstract}
                                </p>

                                {/* R Packages */}
                                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-white/[0.04]">
                                    {article.rPackages.slice(0, 4).map((pkg) => (
                                        <span
                                            key={pkg}
                                            className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] text-[10px] font-mono text-gray-400 dark:text-gray-400"
                                        >
                                            {pkg}
                                        </span>
                                    ))}
                                    {article.rPackages.length > 4 && (
                                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/[0.04] text-[10px] font-mono text-gray-400">
                                            +{article.rPackages.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
