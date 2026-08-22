"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calcLevel } from "@/lib/gamification/constants";

export async function completeLesson(lessonId: string, courseSlug: string) {
    const supabase = createClient();

    // 1. Auth Check
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    // 2. Idempotency Check
    const { data: existingProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .limit(1);

    if (existingProgress && existingProgress.length > 0) {
        return { success: true, message: "Already completed" };
    }

    // 3. Transaction Logic (Simulated with sequential awaits for now)
    // Insert Progress
    const { error: progressError } = await supabase.from("user_progress").insert({
        user_id: user.id,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
    });

    if (progressError) {
        console.error("Progress Error:", progressError);
        return { error: "Failed to save progress" };
    }

    // Auto-enroll user in course if not already enrolled
    try {
        const { data: lessonInfo } = await supabase
            .from("lessons")
            .select("module_id, modules(course_id)")
            .eq("id", lessonId)
            .single();

        if (lessonInfo && (lessonInfo.modules as any)?.course_id) {
            const courseId = (lessonInfo.modules as any).course_id;
            await supabase.from("enrollments").upsert({
                user_id: user.id,
                course_id: courseId,
            }, { onConflict: "user_id, course_id" });
        }
    } catch (e) {
        console.error("Auto-enroll error:", e);
    }

    // Fetch Current Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("total_xp, level")
        .eq("id", user.id)
        .single();

    if (!profile) {
        // Should ideally not happen if trigger worked
        return { error: "Profile not found" };
    }

    // Calculate New Stats using standard level formula
    const XP_REWARD = 50;
    const currentXP = profile.total_xp || 0;
    const newXP = currentXP + XP_REWARD;
    const newLevel = calcLevel(newXP);

    // Update Profile
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ total_xp: newXP, level: newLevel })
        .eq("id", user.id);

    if (updateError) {
        console.error("Profile Update Error:", updateError);
        // Note: Progress was saved, but XP failed. In a real app, use SQL transaction.
        return { success: true, warning: "Progress saved but XP update failed" };
    }

    // 4. Revalidate
    revalidatePath("/academy", "layout");

    return { success: true, newLevel, xpGained: XP_REWARD };
}

export async function checkLessonCompleted(lessonId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .limit(1);

    return !!(data && data.length > 0);
}
