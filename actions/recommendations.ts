"use server";
 
import { createClient } from "@/lib/supabase/server";

export async function getRecommendedCourses() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // 1. Get User Profile (Sector)
    const { data: profile } = await supabase.from("profiles").select("sector, sub_sector").eq("id", user.id).single();
    const userSector = profile?.sector || "GEN";

    // 2. Get Quiz Performance
    const { data: attempts } = await supabase
        .from("quiz_attempts")
        .select("is_correct, question_id, quiz_questions(lesson_id, lessons(module_id, modules(course_id)))")
        .eq("user_id", user.id);

    // Calculate pass rate per course
    const performance: Record<string, { total: number, correct: number }> = {};
    
    attempts?.forEach((att: any) => {
        const courseId = att.quiz_questions?.lessons?.modules?.course_id;
        if (courseId) {
            if (!performance[courseId]) performance[courseId] = { total: 0, correct: 0 };
            performance[courseId].total++;
            if (att.is_correct) performance[courseId].correct++;
        }
    });

    // Simple Logic:
    // If pass rate < 50% in a course, recommend "Remedial" or "Basics"
    // If pass rate > 90% in a course, recommend "Advanced"
    
    // For now, let's just return courses that match the user's sector but they aren't enrolled in.
    const { data: enrolled } = await supabase.from("enrollments").select("course_id").eq("user_id", user.id);
    const enrolledIds = enrolled?.map(e => e.course_id) || [];

    let query = supabase
        .from("courses")
        .select("id, title, slug, description, thumbnail_url")
        .eq("is_published", true)
        .limit(3);

    if (enrolledIds.length > 0) {
        query = query.not("id", "in", `(${enrolledIds.join(",")})`);
    }

    const { data: courses } = await query;

    // Sort by sector match first
    return (courses || []).sort((a, b) => {
        // Mock sector matching logic - in a real app, courses would have a 'sector' tag
        if (a.title.includes(userSector)) return -1;
        if (b.title.includes(userSector)) return 1;
        return 0;
    });
}
