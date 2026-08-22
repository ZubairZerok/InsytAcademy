"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserBadgeDisplay, Badge } from "@/types/gamification";

export async function getUserBadges(): Promise<UserBadgeDisplay[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const admin = createAdminClient();

    // 1. Fetch all catalog badges
    const { data: catalog, error: catalogError } = await admin
        .from("badges")
        .select("*")
        .order("created_at", { ascending: true });

    if (catalogError || !catalog) return [];

    // 2. Fetch user's unlocked badges
    const { data: userBadges } = await admin
        .from("user_badges")
        .select("badge_id, unlocked_at")
        .eq("user_id", user.id);

    const unlockedMap = new Map<string, string>();
    (userBadges || []).forEach((ub) => {
        unlockedMap.set(ub.badge_id, ub.unlocked_at);
    });

    return catalog.map((b: Badge) => ({
        ...b,
        unlocked: unlockedMap.has(b.id),
        unlocked_at: unlockedMap.get(b.id) || undefined,
    }));
}

export async function checkAndAwardUserBadges(): Promise<{ newly_unlocked: { badge_id: string; badge_name: string; xp_bonus: number }[] }> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { newly_unlocked: [] };

    const admin = createAdminClient();

    try {
        const { data, error } = await admin.rpc("check_and_award_badges", {
            p_user_id: user.id,
        });

        if (error) {
            console.error("[checkAndAwardUserBadges]", error);
            return { newly_unlocked: [] };
        }

        return { newly_unlocked: data || [] };
    } catch (e) {
        console.error("[checkAndAwardUserBadges] error:", e);
        return { newly_unlocked: [] };
    }
}
