"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Calendar, Users, Microscope, Tag } from "lucide-react";

interface Author {
    name: string;
    institution: string;
}

interface PaperCardProps {
    paper: {
        id: string;
        title: string;
        abstract: string;
        authors: Author[];
        doi: string | null;
        pdf_url?: string | null;
        dataset_url?: string | null;
        discipline: string;
        published_at: string;
    };
}

// Only allow http(s) links; blocks javascript:/data: and other dangerous schemes.
function safeHttpUrl(url?: string | null): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
    } catch {
        return null;
    }
}

export function PaperCard({ paper }: PaperCardProps) {
    const formattedDate = new Date(paper.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const pdfUrl = safeHttpUrl(paper.pdf_url);
    const datasetUrl = safeHttpUrl(paper.dataset_url);

    return (
        <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-full group border-white/[0.04] hover:border-white/[0.14] transition-all duration-300">
            <div className="space-y-4">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-xs font-mono text-neon-green">
                        <Tag className="h-3 w-3" />
                        {paper.discipline.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                        <Calendar className="h-3.5 w-3.5" />
                        {formattedDate}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white leading-snug group-hover:text-neon-green transition-colors">
                    {paper.title}
                </h3>

                {/* Authors */}
                <div className="flex items-start gap-2 text-sm text-gray-400 font-mono">
                    <Users className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <div>
                        {paper.authors.map((author, index) => (
                            <span key={author.name}>
                                <strong className="text-gray-300">{author.name}</strong>
                                <span className="text-gray-400"> ({author.institution})</span>
                                {index < paper.authors.length - 1 && ", "}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Abstract */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {paper.abstract}
                </p>
            </div>

            {/* DOI and Actions */}
            <div className="border-t border-white/[0.05] pt-6 mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {paper.doi && (
                    <span className="text-xs text-gray-400 font-mono select-all">
                        DOI: <span className="text-gray-400">{paper.doi}</span>
                    </span>
                )}

                <div className="flex gap-2">
                    <a href={datasetUrl || "#"} target="_blank" rel="noopener noreferrer" className={!datasetUrl ? "pointer-events-none opacity-40" : ""}>
                        <Button variant="ghost" size="sm" className="h-9 px-4 text-xs font-mono border border-white/5 rounded-xl hover:border-white/10 flex items-center gap-1.5">
                            <Microscope className="h-3.5 w-3.5" />
                            DATASET
                        </Button>
                    </a>
                    <a href={pdfUrl || "#"} target="_blank" rel="noopener noreferrer" className={!pdfUrl ? "pointer-events-none opacity-40" : ""}>
                        <Button variant="primary" size="sm" className="h-9 px-4 text-xs font-mono rounded-xl bg-neon-green text-black hover:bg-neon-green/90 font-bold flex items-center gap-1.5 shadow-sm">
                            <FileText className="h-3.5 w-3.5" />
                            PREPRINT
                            <ExternalLink className="h-3 w-3" />
                        </Button>
                    </a>
                </div>
            </div>
        </GlassCard>
    );
}
