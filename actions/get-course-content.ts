"use server";

import { createClient } from "@/lib/supabase/server";

export type Lesson = {
    id: string;
    title: string;
    slug: string;
    order_index: number;
    video_url: string | null;
};

export type Module = {
    id: string;
    title: string;
    slug: string;
    order_index: number;
    description: string | null;
    lessons: Lesson[];
};

export type CourseContent = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    modules: Module[];
    completedLessonIds: string[];
};

export async function getCourseBySlug(slug: string): Promise<CourseContent | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch Course -> Modules -> Lessons
    const { data: course, error } = await supabase
        .from("courses")
        .select(`
            id, 
            title, 
            description, 
            slug, 
            modules (
                id, 
                title, 
                slug, 
                order_index, 
                description,
                lessons (
                    id, 
                    title, 
                    slug, 
                    order_index,
                    video_url
                )
            )
        `)
        .eq("slug", slug)
        .single();

    if (error || !course) {
        console.error("Error fetching course:", error);
        return null;
    }

    // 2. Sort Modules and Lessons (Supabase ordering can be unreliable)
    const modules = (course.modules as unknown as Module[]).sort(
        (a, b) => (a.order_index || 0) - (b.order_index || 0)
    );

    modules.forEach(mod => {
        mod.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    });

    // 3. Flatten lessons to check progress efficiently
    const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id));

    // 4. Fetch User Progress (if logged in)
    let completedLessonIds: string[] = [];
    if (user && allLessonIds.length > 0) {
        const { data: progress } = await supabase
            .from("user_progress")
            .select("lesson_id")
            .eq("user_id", user.id)
            .in("lesson_id", allLessonIds);

        if (progress) {
            completedLessonIds = progress.map((p) => p.lesson_id);
        }
    }

    return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        modules,
        completedLessonIds
    };
}
