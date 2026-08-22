"use server";

import { createClient } from "@/lib/supabase/server";
import type { Lesson, Module } from "@/types/course";

interface OrderedLesson extends Lesson {
    module_order: number;
}

export async function getResumeLesson(courseSlug: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Get Course -> Modules -> Lessons
    const { data: course } = await supabase
        .from("courses")
        .select(`
            id, 
            modules (
                order_index,
                lessons (
                    id, 
                    slug, 
                    order_index
                )
            )
        `)
        .eq("slug", courseSlug)
        .single();

    if (!course || !course.modules) return null;

    // 2. Flatten and Sort Lessons
    let allLessons: OrderedLesson[] = [];

    const sortedModules = ((course.modules as unknown as Module[]) || []).sort((a, b) => a.order_index - b.order_index);

    sortedModules.forEach(mod => {
        const modLessons = (mod.lessons || []).sort((a, b) => a.order_index - b.order_index);
        modLessons.forEach(l => {
            allLessons.push({
                ...l,
                module_order: mod.order_index
            } as OrderedLesson);
        });
    });

    if (allLessons.length === 0) return null;

    // 3. Get User Progress
    const { data: progress } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id);

    const completedIds = new Set(progress?.map(p => p.lesson_id) || []);

    // 4. Find First Incomplete Lesson
    const nextLesson = allLessons.find(l => !completedIds.has(l.id));

    // If all completed, return the last one
    return nextLesson || allLessons[allLessons.length - 1];
}
