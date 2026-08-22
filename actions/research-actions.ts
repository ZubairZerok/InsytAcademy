"use server";

import { createClient } from "@/lib/supabase/server";

export async function voteResearchArticle(
    articleId: string,
    direction: "up" | "down"
): Promise<{ success?: boolean; error?: string }> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Try research_votes table, fall back to profiles.settings
    try {
        const { error } = await supabase.from("research_votes").upsert({
            user_id: user.id,
            article_id: articleId,
            direction,
            created_at: new Date().toISOString(),
        }, { onConflict: "user_id,article_id" });

        if (error) throw error;
    } catch {
        const { data: profile } = await supabase
            .from("profiles").select("settings").eq("id", user.id).single();
        const settings = (profile?.settings as Record<string, unknown>) || {};
        const votes = (settings.research_votes as Record<string, string>) || {};
        votes[articleId] = direction;
        await supabase.from("profiles").update({
            settings: { ...settings, research_votes: votes }
        }).eq("id", user.id);
    }

    return { success: true };
}

export async function saveResearchArticle(
    articleId: string
): Promise<{ success?: boolean; saved?: boolean; error?: string }> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles").select("settings").eq("id", user.id).single();
    const settings = (profile?.settings as Record<string, unknown>) || {};
    const saved: string[] = Array.isArray(settings.saved_articles)
        ? (settings.saved_articles as string[]) : [];

    const alreadySaved = saved.includes(articleId);
    const updated = alreadySaved
        ? saved.filter(id => id !== articleId)
        : [...saved, articleId];

    await supabase.from("profiles").update({
        settings: { ...settings, saved_articles: updated }
    }).eq("id", user.id);

    return { success: true, saved: !alreadySaved };
}

export async function getUserArticleData(articleId: string): Promise<{
    userVote: "up" | "down" | null;
    isSaved: boolean;
}> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { userVote: null, isSaved: false };

    const { data: profile } = await supabase
        .from("profiles").select("settings").eq("id", user.id).single();
    const settings = (profile?.settings as Record<string, unknown>) || {};

    const saved: string[] = Array.isArray(settings.saved_articles)
        ? (settings.saved_articles as string[]) : [];
    const isSaved = saved.includes(articleId);

    let userVote: "up" | "down" | null = null;
    try {
        const { data: voteRow } = await supabase
            .from("research_votes").select("direction")
            .eq("user_id", user.id).eq("article_id", articleId).single();
        if (voteRow) userVote = voteRow.direction as "up" | "down";
    } catch {
        const votes = (settings.research_votes as Record<string, string>) || {};
        userVote = (votes[articleId] as "up" | "down") || null;
    }

    return { userVote, isSaved };
}
