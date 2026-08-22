"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UserActivity {
    id: string;
    user_id: string;
    action_type: "upvote" | "comment" | "post";
    target_id: string;
    target_title: string;
    created_at: string;
}

export async function logUserActivity(
    actionType: "upvote" | "comment" | "post",
    targetId: string,
    targetTitle: string
) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const newActivity = {
        user_id: user.id,
        action_type: actionType,
        target_id: targetId,
        target_title: targetTitle,
        created_at: new Date().toISOString()
    };

    try {
        // Try inserting into a dedicated user_activities table
        const { error: insertError } = await supabase
            .from("user_activities")
            .insert(newActivity);

        if (insertError) {
            // Fallback: Store inside profiles.settings JSONB field
            const { data: profile } = await supabase
                .from("profiles")
                .select("settings")
                .eq("id", user.id)
                .single();

            const settings = profile?.settings || {};
            const activities = Array.isArray((settings as any).activities) 
                ? (settings as any).activities 
                : [];
            
            const updatedActivities = [
                { id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, ...newActivity },
                ...activities
            ].slice(0, 50); // Keep last 50 activities

            await supabase
                .from("profiles")
                .update({
                    settings: {
                        ...settings,
                        activities: updatedActivities
                    }
                })
                .eq("id", user.id);
        }
    } catch (err) {
        console.error("Error logging activity:", err);
    }

    revalidatePath("/academy/profile");
    return { success: true };
}

export async function getUserActivityLog(): Promise<UserActivity[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    try {
        // Try querying the dedicated user_activities table
        const { data, error } = await supabase
            .from("user_activities")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
            return data as UserActivity[];
        }

        // Fallback: Read from profiles.settings
        const { data: profile } = await supabase
            .from("profiles")
            .select("settings")
            .eq("id", user.id)
            .single();

        const settings = profile?.settings || {};
        const activities = Array.isArray((settings as any).activities) 
            ? (settings as any).activities 
            : [];
        return activities as UserActivity[];
    } catch {
        return [];
    }
}
