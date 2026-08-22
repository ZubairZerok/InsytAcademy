import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleById } from "@/actions/research-articles";
import { getUserArticleData } from "@/actions/research-actions";
import { ArticleActions } from "@/components/research/article-actions";
import { ChevronLeft, Calendar, User, Package } from "lucide-react";

interface ArticlePageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: ArticlePageProps) {
    const article = getArticleById(params.id);
    if (!article) return { title: "Article Not Found" };
    return {
        title: `${article.title} | INSYT Research`,
        description: article.abstract.slice(0, 150),
    };
}

export default async function ResearchArticlePage({ params }: ArticlePageProps) {
    const article = getArticleById(params.id);
    if (!article) notFound();

    const { userVote, isSaved } = await getUserArticleData(params.id);

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Back link */}
            <Link
                href="/research"
                className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-emerald-600 dark:hover:text-neon-green transition-colors group"
            >
                <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                BACK TO RESEARCH HUB
            </Link>

            {/* Article Header */}
            <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-white/[0.06]">
                {/* Discipline tag — neutral, not colored */}
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 text-xs font-mono text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                    {article!.discipline}
                </span>

                <h1 className="text-2xl md:text-3xl font-bold leading-snug">
                    {article!.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="font-bold text-emerald-700 dark:text-neon-green">{article!.author}</span>
                        <span>• {article!.authorRole}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(article!.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                        })}
                    </div>
                </div>
            </div>

            {/* Vote + Save Actions */}
            <ArticleActions
                articleId={params.id}
                initialVote={userVote}
                initialSaved={isSaved}
                initialUpvotes={0}
            />

            {/* Abstract / Full Content */}
            <div className="space-y-4">
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-gray-400">Abstract</h2>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {article!.abstract}
                </p>
            </div>

            {/* R Packages */}
            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-gray-400">R Packages Used</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {article!.rPackages.map((pkg) => (
                        <span
                            key={pkg}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] text-xs font-mono text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-neon-green/30 hover:text-emerald-700 dark:hover:text-neon-green transition-colors"
                        >
                            {pkg}
                        </span>
                    ))}
                </div>
            </div>

            {/* Study Notes area */}
            <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-gray-400">Your Study Notes</h2>
                <textarea
                    placeholder="Take notes on this article... (saved locally)"
                    className="w-full h-36 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] px-4 py-3 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-emerald-400 dark:focus:border-neon-green/40 resize-none transition-colors font-mono"
                />
                <p className="text-[10px] font-mono text-gray-400">Notes are stored in your browser&apos;s local storage.</p>
            </div>
        </div>
    );
}
