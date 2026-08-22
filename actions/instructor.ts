"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertInstructor } from "@/lib/auth/assert-role";
import { revalidatePath } from "next/cache";

// Only these fields may ever be written from the course form. Prevents arbitrary
// columns (e.g. is_published, id) being injected via `data: any`.
const COURSE_FIELDS = ["title", "slug", "description", "thumbnail_url"] as const;
type CourseField = (typeof COURSE_FIELDS)[number];

function pickCourseFields(input: Record<string, unknown>): Partial<Record<CourseField, unknown>> {
    const out: Partial<Record<CourseField, unknown>> = {};
    for (const k of COURSE_FIELDS) {
        if (input[k] !== undefined) out[k] = input[k];
    }
    return out;
}

export async function createCourse(data: {
    title: string;
    slug: string;
    description?: string;
    thumbnail_url?: string;
}) {
    try {
        await assertInstructor();
    } catch {
        return { error: "You don't have permission to create courses." };
    }

    if (!data?.title?.trim() || !data?.slug?.trim()) {
        return { error: "Title and slug are required." };
    }

    const admin = createAdminClient();
    const { data: course, error } = await admin
        .from("courses")
        .insert({ ...pickCourseFields(data), is_published: false })
        .select()
        .single();

    if (error) {
        console.error("[createCourse]", error);
        return { error: "Could not create the course." };
    }

    revalidatePath("/instructor/courses");
    return { success: true, course };
}

export async function updateCourse(id: string, data: Record<string, unknown>) {
    try {
        await assertInstructor();
    } catch {
        return { error: "You don't have permission to edit courses." };
    }

    if (!id) return { error: "Missing course id." };

    const fields = pickCourseFields(data);
    // Allow toggling publish state explicitly (still staff-gated above).
    if (typeof data.is_published === "boolean") {
        (fields as Record<string, unknown>).is_published = data.is_published;
    }
    if (Object.keys(fields).length === 0) {
        return { error: "Nothing to update." };
    }

    const admin = createAdminClient();
    const { error } = await admin.from("courses").update(fields).eq("id", id);

    if (error) {
        console.error("[updateCourse]", error);
        return { error: "Could not update the course." };
    }

    revalidatePath(`/instructor/courses/${id}`);
    revalidatePath("/academy");
    return { success: true };
}

export async function getInstructorCourses() {
    try {
        await assertInstructor();
    } catch {
        return [];
    }
    // Service client so instructors can see unpublished drafts too.
    const admin = createAdminClient();
    const { data, error } = await admin
        .from("courses")
        .select("*, modules(count)")
        .order("created_at", { ascending: false });

    if (error) return [];
    return data;
}
