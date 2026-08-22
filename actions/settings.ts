"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UserSettings = {
    notifications: boolean;
    haptics: boolean;
    publicProfile: boolean;
    dataSharing: boolean;
};

export type UserProfile = {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    settings: UserSettings;
};

export async function getSettings() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role, avatar_url, settings")
        .eq("id", user.id)
        .single();

    // Default settings if null
    const defaultSettings: UserSettings = {
        notifications: true,
        haptics: false,
        publicProfile: true,
        dataSharing: false
    };

    return {
        id: user.id,
        email: user.email!,
        full_name: profile?.full_name || "",
        role: profile?.role || "Cadet",
        avatar_url: (profile as { avatar_url?: string | null })?.avatar_url || null,
        settings: { ...defaultSettings, ...profile?.settings }
    };
}

export async function updateSettings(
    fullName: string,
    settings: UserSettings
) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: fullName,
            settings: settings,
            updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

    if (error) {
        console.error("Update Settings Error:", error);
        return { error: "Failed to update settings" };
    }

    revalidatePath("/academy/settings");
    return { success: true };
}
