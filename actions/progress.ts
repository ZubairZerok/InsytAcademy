"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

    // 4. Revalidate
    revalidatePath("/academy", "layout");

    return { success: true };
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
