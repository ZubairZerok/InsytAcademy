"use server";

import { createClient } from "@/lib/supabase/server";
import { researchArticles } from "@/actions/research-articles";
import { createNotification } from "@/lib/notifications";

export interface NotificationItem {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string; // 'course' | 'leaderboard' | 'social' | 'research'
    link?: string;
    is_read: boolean;
    created_at: string;
}

/**
 * Fetches all notifications for the current logged-in user
 */
export async function getNotifications(): Promise<NotificationItem[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    try {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.warn("Notifications query failed:", error.message);
            return [];
        }

        return (data || []) as NotificationItem[];
    } catch {
        return [];
    }
}

/**
 * Marks a notification as read (only the caller's own notification).
 */
export async function markNotificationAsRead(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    try {
        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id)
            .eq("user_id", user.id);
    } catch (e) {
        console.error("Failed to mark notification read:", e);
    }
}

/**
 * Marks all notifications as read for the current user
 */
export async function markAllNotificationsAsRead() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    try {
        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id);
    } catch (e) {
        console.error("Failed to mark all notifications read:", e);
    }
}

/**
 * Triggers points bypass check when User A gains XP.
 * Moved to lib/notifications.ts (server-only, not a client-invokable action).
 */

/**
 * Automatically syncs notifications for new courses and new research posts on login/dashboard view
 */
export async function syncSystemNotifications() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    try {
        // 1. Fetch current user's notifications of type 'course' and 'research'
        const { data: existingNotifs } = await supabase
            .from("notifications")
            .select("link, type")
            .eq("user_id", user.id)
            .in("type", ["course", "research"]);

        const createdLinks = new Set((existingNotifs || []).map(n => n.link));

        // 2. Fetch all courses
        const { data: courses } = await supabase
            .from("courses")
            .select("id, title, slug");

        if (courses && courses.length > 0) {
            for (const course of courses) {
                const link = `/academy/${course.slug}`;
                if (!createdLinks.has(link)) {
                    await createNotification(
                        user.id,
                        "📚 New Course Available",
                        `A new training course has been published: "${course.title}". Start learning today!`,
                        "course",
                        link
                    );
                }
            }
        }

        // 3. Process static Research articles by PlAiNSYT
        for (const article of researchArticles) {
            const link = `/research/${article.id}`;
            if (!createdLinks.has(link)) {
                await createNotification(
                    user.id,
                    "🔬 New PlAiNSYT Research",
                    `New research study published by PlAiNSYT: "${article.title}". Read the abstract and R packages referenced!`,
                    "research",
                    link
                );
            }
        }
    } catch (e) {
        console.warn("System notification sync failed (check if tables are created):", e);
    }
}
