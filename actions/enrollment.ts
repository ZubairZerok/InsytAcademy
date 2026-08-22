"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollCourse(courseId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    // Check if exists
    const { data: existing } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .limit(1);

    if (existing && existing.length > 0) {
        return { success: true, message: "Already enrolled" };
    }

    const { error } = await supabase.from("enrollments").upsert({
        user_id: user.id,
        course_id: courseId,
    }, { onConflict: "user_id, course_id" });

    if (error) {
        console.error("Enrollment Error:", error);
        return { error: "Failed to enroll" };
    }

    revalidatePath("/academy");
    revalidatePath(`/academy/courses`); // My Courses
    return { success: true };
}

export async function checkEnrollment(courseId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .limit(1);

    return !!(data && data.length > 0);
}
