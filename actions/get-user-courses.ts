"use server";

import { createClient } from "@/lib/supabase/server";
import type { EnrolledCourse, Lesson } from "@/types/course";

export async function getUserCourses(): Promise<EnrolledCourse[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // 1. Fetch all Published Courses with Modules and Lessons
    const { data: courses } = await supabase
        .from("courses")
        .select(`
            id,
            title,
            slug,
            description,
            thumbnail_url,
            modules (
                id,
                title,
                slug,
                order_index,
                lessons (id, title, slug, order_index, module_id)
            )
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: true });

    if (!courses) return [];

    // 2. Fetch User Progress AND Enrollments concurrently
    const [{ data: progress }, { data: enrollments }] = await Promise.all([
        supabase.from("user_progress").select("lesson_id, completed_at").eq("user_id", user.id),
        supabase.from("enrollments").select("course_id").eq("user_id", user.id),
    ]);

    const enrolledCourseIds = new Set(enrollments?.map((e) => e.course_id) || []);
    const completedLessonIds = new Set(progress?.map((p) => p.lesson_id) || []);

    // 3. Map & Calculate Progress
    const enrolledCourses = (courses || []).map((course: any) => {
        const rawModules = (course.modules || []) as any[];
        // Sort modules by order_index
        const sortedModules = [...rawModules].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

        const allLessons: any[] = [];
        const modulesProgress = sortedModules.map((m) => {
            const mLessons = (m.lessons || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
            allLessons.push(...mLessons);
            const mTotal = mLessons.length;
            const mCompleted = mLessons.filter((l: any) => completedLessonIds.has(l.id)).length;
            return {
                id: m.id,
                title: m.title,
                order_index: m.order_index,
                totalLessons: mTotal,
                completedLessons: mCompleted,
                isCompleted: mTotal > 0 && mCompleted === mTotal,
                isCurrent: false, // will update below
            };
        });

        const totalLessons = allLessons.length;
        const completedCount = allLessons.filter((l) => completedLessonIds.has(l.id)).length;
        const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        // Determine Next Lesson (Resume Point)
        const nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id)) || allLessons[0];
        const nextLessonSlug = nextLesson?.slug;
        const nextLessonTitle = nextLesson?.title;

        // Find current module
        let currentModuleTitle = "";
        let currentModuleIndex = 1;
        if (nextLesson) {
            const currentMod = sortedModules.find((m) => m.id === nextLesson.module_id);
            if (currentMod) {
                currentModuleTitle = currentMod.title;
                currentModuleIndex = currentMod.order_index;
                const activeProgressMod = modulesProgress.find((mp) => mp.id === currentMod.id);
                if (activeProgressMod) activeProgressMod.isCurrent = true;
            }
        }

        const completedModulesCount = modulesProgress.filter((mp) => mp.isCompleted).length;

        return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            thumbnail_url: course.thumbnail_url,
            totalLessons,
            completedLessons: completedCount,
            progress: progressPercent,
            lastAccessed: null,
            isEnrolled: enrolledCourseIds.has(course.id),
            nextLessonSlug,
            nextLessonTitle,
            currentModuleTitle,
            currentModuleIndex,
            totalModules: sortedModules.length,
            completedModulesCount,
            modulesProgress,
        };
    });

    // Filter: Show if Enrolled OR has Progress
    const myCourses = enrolledCourses.filter((c) => c.isEnrolled || c.progress > 0);

    return myCourses;
}
