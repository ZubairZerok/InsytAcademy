"use server";
 
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function checkAndIssueCertificate(courseId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // 1. Get all lesson IDs for this course
    const { data: courseData } = await supabase
        .from("courses")
        .select(`
            modules (
                lessons (id)
            )
        `)
        .eq("id", courseId)
        .single();

    if (!courseData) return { error: "Course not found" };

    const courseLessonIds = courseData.modules.flatMap(m => m.lessons.map(l => l.id));
    
    if (courseLessonIds.length === 0) return { error: "Course has no lessons" };

    // 2. Get user's completed lessons for this course
    const { data: completedLessons } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in("lesson_id", courseLessonIds);

    const completedIds = new Set(completedLessons?.map(l => l.lesson_id) || []);
    const isCompleted = courseLessonIds.every(id => completedIds.has(id));

    if (!isCompleted) return { success: false, message: "Course not yet completed" };

    // 3. Issue Certificate (upsert)
    const { data: certificate, error: certError } = await supabase
        .from("certificates")
        .upsert({
            user_id: user.id,
            course_id: courseId,
            issued_at: new Date().toISOString()
        }, { onConflict: 'user_id, course_id' })
        .select()
        .single();

    if (certError) {
        console.error("Certificate Issue Error:", certError);
        return { error: "Failed to issue certificate" };
    }

    revalidatePath("/academy/certificates");
    return { success: true, certificate };
}

export async function getUserCertificates() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("certificates")
        .select("*, courses(title, slug)")
        .eq("user_id", user.id);

    if (error) return [];
    return data;
}

export async function getCertificateById(id: string) {
    const supabase = createClient();

    // In a real app we might secure this, but certificates are often public to verify
    const { data, error } = await supabase
        .from("certificates")
        .select("*, courses(title, slug), profiles(full_name)")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}
