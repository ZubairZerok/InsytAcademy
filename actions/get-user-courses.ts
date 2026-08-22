"use server";

import { createClient } from "@/lib/supabase/server";
import type { EnrolledCourse, Lesson } from "@/types/course";

export async function getUserCourses(): Promise<EnrolledCourse[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // 1. Fetch all Published Courses
    const { data: courses } = await supabase
        .from("courses")
        .select("id, title, slug, description, thumbnail_url, modules(lessons(id, slug, order_index))")
        .eq("is_published", true);

    if (!courses) return [];

    // 2. Fetch User Progress AND Enrollments
    const { data: progress } = await supabase
        .from("user_progress")
        .select("lesson_id, completed_at")
        .eq("user_id", user.id);

    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id);

    const enrolledCourseIds = new Set(enrollments?.map(e => e.course_id) || []);
    const completedLessonIds = new Set(progress?.map((p) => p.lesson_id) || []);

    // 3. Map & Calculate Progress
    const enrolledCourses = (courses || []).map((course) => {
        const modules = (course.modules || []) as unknown as { lessons: Lesson[] }[];
        const lessons = modules.flatMap((m) => m.lessons || []);
        const totalLessons = lessons.length;
        // Count how many lessons in *this* course are completed
        const completedCount = lessons.filter((l) =>
            completedLessonIds.has(l.id)
        ).length;

        // Determine Next Lesson (Resume Point)
        const sortedLessons = lessons.sort((a, b) => a.order_index - b.order_index);
        const nextLesson = sortedLessons.find((l) => !completedLessonIds.has(l.id));
        const nextLessonSlug = nextLesson?.slug || sortedLessons[0]?.slug;

        return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            thumbnail_url: course.thumbnail_url,
            totalLessons,
            completedLessons: completedCount,
            progress: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
            lastAccessed: null,
            isEnrolled: enrolledCourseIds.has(course.id),
            nextLessonSlug
        };
    });

    // Filter: Show if Enrolled OR has Progress
    const myCourses = enrolledCourses.filter(c => c.isEnrolled || c.progress > 0);

    return myCourses;
}
