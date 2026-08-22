"use server";

import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
    type: "course" | "lesson";
    id: string;
    title: string;
    subtitle?: string;
    href: string;
}

// Lightweight cross-entity search (courses, lessons).
export async function search(query: string): Promise<SearchResult[]> {
    const q = (query ?? "").trim();
    if (q.length < 2) return [];

    const supabase = createClient();
    const term = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;
    const results: SearchResult[] = [];

    const [courses, lessons] = await Promise.all([
        supabase
            .from("courses")
            .select("id, title, slug, description")
            .eq("is_published", true)
            .ilike("title", term)
            .limit(5),
        supabase
            .from("lessons")
            .select("id, title, slug, module_id")
            .ilike("title", term)
            .limit(5),
    ]);

    for (const c of courses.data ?? []) {
        results.push({
            type: "course",
            id: c.id,
            title: c.title,
            subtitle: c.description ?? undefined,
            href: `/academy/${c.slug}`,
        });
    }
    for (const l of lessons.data ?? []) {
        results.push({
            type: "lesson",
            id: l.id,
            title: l.title,
            subtitle: "Lesson",
            href: `/academy`,
        });
    }

    return results;
}
