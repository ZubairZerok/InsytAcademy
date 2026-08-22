"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { voteResearchArticle, saveResearchArticle } from "@/actions/research-actions";

interface ArticleActionsProps {
    articleId: string;
    initialVote: "up" | "down" | null;
    initialSaved: boolean;
    initialUpvotes?: number;
}

export function ArticleActions({ articleId, initialVote, initialSaved, initialUpvotes = 0 }: ArticleActionsProps) {
    const [vote, setVote] = useState<"up" | "down" | null>(initialVote);
    const [saved, setSaved] = useState(initialSaved);
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [loading, setLoading] = useState<string | null>(null);

    const handleVote = async (direction: "up" | "down") => {
        setLoading(direction);
        const newVote = vote === direction ? null : direction;
        // Optimistic update
        if (direction === "up") setUpvotes(v => vote === "up" ? v - 1 : vote === "down" ? v + 1 : v + 1);
        if (direction === "down") setUpvotes(v => vote === "up" ? v - 1 : v);
        setVote(newVote);
        await voteResearchArticle(articleId, direction);
        setLoading(null);
    };

    const handleSave = async () => {
        setLoading("save");
        setSaved(s => !s);
        await saveResearchArticle(articleId);
        setLoading(null);
    };

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Upvote */}
            <button
                onClick={() => handleVote("up")}
                disabled={loading !== null}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold transition-all ${
                    vote === "up"
                        ? "bg-emerald-600 dark:bg-neon-green text-white dark:text-black border-transparent"
                        : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-400 hover:border-emerald-400 dark:hover:border-neon-green/40 hover:text-emerald-700 dark:hover:text-neon-green bg-white dark:bg-transparent"
                }`}
            >
                {loading === "up" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                <span>{upvotes} UPVOTES</span>
            </button>

            {/* Downvote */}
            <button
                onClick={() => handleVote("down")}
                disabled={loading !== null}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold transition-all ${
                    vote === "down"
                        ? "bg-red-500 text-white border-transparent"
                        : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-400 hover:border-red-400 hover:text-red-600 bg-white dark:bg-transparent"
                }`}
            >
                {loading === "down" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDown className="h-4 w-4" />}
                <span>DOWNVOTE</span>
            </button>

            {/* Save */}
            <button
                onClick={handleSave}
                disabled={loading !== null}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold transition-all ${
                    saved
                        ? "bg-blue-600 text-white border-transparent"
                        : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 bg-white dark:bg-transparent"
                }`}
            >
                {loading === "save"
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />
                }
                <span>{saved ? "SAVED" : "SAVE FOR LATER"}</span>
            </button>
        </div>
    );
}
