"use server";

import { createClient } from "@/lib/supabase/server";
import type { Lesson, Module, LessonData } from "@/types/course";

export async function getLesson(
    courseSlug: string,
    lessonSlug: string
): Promise<LessonData | null> {
    const supabase = createClient();

    // 0. Fetch User Profile for Adaptive Context
    const { data: { user } } = await supabase.auth.getUser();
    let userSector = "GEN"; // Default General
    let userSubSector = null;

    if (user) {
        try {
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("sector, sub_sector")
                .eq("id", user.id)
                .single();

            if (!error && profile) {
                userSector = profile.sector || "GEN";
                userSubSector = profile.sub_sector;
            }
        } catch (err) {
            // Ignore error - likely DB schema verification pending
            console.warn("Profile fetch failed (using defaults):", err);
        }
    }

    // 1. Fetch Course -> Modules -> Lessons
    const { data: course, error: courseError } = await supabase
        .from("courses")
        .select(`
            id, 
            modules (
                id,
                order_index,
                lessons (
                    id, 
                    title, 
                    slug, 
                    order_index,
                    content,
                    content_variants,
                    video_url,
                    module_id
                )
            )
        `)
        .eq("slug", courseSlug)
        .single();

    if (courseError) {
        console.error("Error fetching course:", courseError.message);
    }

    if (!course || !course.modules) {
        console.log(`Course not found for slug: ${courseSlug}`);
        return null;
    }

    // 2. Flatten and Sort Lessons
    const sortedModules = ((course.modules as unknown as Module[]) || []).sort((a, b) => a.order_index - b.order_index);
    let allLessons: Lesson[] = [];

    sortedModules.forEach(mod => {
        const modLessons = (mod.lessons || []).sort((a, b) => a.order_index - b.order_index);
        allLessons.push(...modLessons);
    });

    // 3. Find Current Lesson
    const currentIndex = allLessons.findIndex(l => l.slug === lessonSlug);
    console.log(`Searching for lesson slug: ${lessonSlug}, Found at index: ${currentIndex}`);

    if (currentIndex === -1) {
        console.warn(`Lesson slug '${lessonSlug}' not found in course '${courseSlug}'. Available slugs:`, allLessons.map(l => l.slug));
        return null;
    }

    const currentLesson = allLessons[currentIndex];

    // 4. Adaptive Content Resolution
    // Logic: Sub-sector > Sector > Default
    let finalContent = currentLesson.content;
    const variants = (currentLesson as any).content_variants;

    if (variants) {
        if (userSubSector && variants[userSubSector]) {
            // High specificity match
            finalContent = variants[userSubSector];
        } else if (userSector && variants[userSector]) {
            // Sector match
            finalContent = variants[userSector];
        }
    }

    // Update the lesson object with the resolved content
    currentLesson.content = finalContent;


    // 5. Determine Neighbors
    const prevLesson = currentIndex > 0
        ? allLessons[currentIndex - 1]
        : null;

    const nextLesson = currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;

    return {
        courseId: course.id,
        lessonIndex: currentIndex + 1,
        lesson: currentLesson,
        nextLesson: nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null,
        prevLesson: prevLesson ? { id: prevLesson.id, slug: prevLesson.slug, title: prevLesson.title } : null,
    };
}
