"use server";

import { createClient } from "@/lib/supabase/server";

export type CourseWithMeta = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    total_lessons: number;
};

export type CatalogCourse = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    total_lessons: number;
    completed_lessons: number;
    progress: number;
    is_enrolled: boolean;
    next_lesson_slug?: string;
};

export async function getPublishedCourses(): Promise<CourseWithMeta[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("courses")
        .select(`
            *, 
            modules (
                lessons (count)
            )
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching courses:", error);
        return [];
    }

    return data.map((course: any) => {
        const totalLessons = course.modules?.reduce((acc: number, mod: any) => {
            return acc + (mod.lessons?.[0]?.count || 0);
        }, 0) || 0;

        return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            thumbnail_url: course.thumbnail_url,
            total_lessons: totalLessons
        };
    });
}

export async function getCatalogCourses(): Promise<CatalogCourse[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch published courses with modules and nested lessons
    const { data: courses, error } = await supabase
        .from("courses")
        .select(`
            id,
            title,
            slug,
            description,
            thumbnail_url,
            created_at,
            modules (
                lessons (id, slug, order_index)
            )
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error || !courses) {
        console.error("Error fetching catalog courses:", error);
        return [];
    }

    let completedLessonIds = new Set<string>();
    let enrolledCourseIds = new Set<string>();

    if (user) {
        const [{ data: progress }, { data: enrollments }] = await Promise.all([
            supabase.from("user_progress").select("lesson_id").eq("user_id", user.id),
            supabase.from("enrollments").select("course_id").eq("user_id", user.id),
        ]);

        completedLessonIds = new Set(progress?.map((p) => p.lesson_id) || []);
        enrolledCourseIds = new Set(enrollments?.map((e) => e.course_id) || []);
    }

    return courses.map((course: any) => {
        const lessons = (course.modules || []).flatMap((m: any) => m.lessons || []);
        const totalLessons = lessons.length;
        const sortedLessons = [...lessons].sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
        
        const completedCount = lessons.filter((l: any) => completedLessonIds.has(l.id)).length;
        const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
        
        const nextUncompleted = sortedLessons.find((l: any) => !completedLessonIds.has(l.id));
        const nextLessonSlug = nextUncompleted?.slug || sortedLessons[0]?.slug;

        return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
            thumbnail_url: course.thumbnail_url,
            total_lessons: totalLessons,
            completed_lessons: completedCount,
            progress,
            is_enrolled: enrolledCourseIds.has(course.id),
            next_lesson_slug: nextLessonSlug,
        };
    });
}
