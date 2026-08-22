"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/assert-role";
import { revalidatePath } from "next/cache";

export async function getAdminProblems() {
    try {
        await requireAdmin();
    } catch {
        return [];
    }

    const admin = createAdminClient();
    const { data: problems, error } = await admin
        .from("problems")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[getAdminProblems]", error);
        return [];
    }

    return problems || [];
}

export async function createAdminProblem(data: {
    title: string;
    slug: string;
    description: string;
    difficulty: string; // 'easy' | 'medium' | 'hard'
    tags?: string[];
    hints?: string[];
    expected_answer?: string;
    answer_type?: string; // 'exact' | 'numeric_tolerance' | 'regex'
    answer_tolerance?: number;
    xp_reward?: number;
    is_published?: boolean;
}) {
    try {
        await requireAdmin();
    } catch {
        return { error: "Permission denied." };
    }

    if (!data.title?.trim() || !data.slug?.trim() || !data.description?.trim()) {
        return { error: "Title, slug, and description are required." };
    }

    const admin = createAdminClient();
    const { data: problem, error } = await admin
        .from("problems")
        .insert({
            title: data.title.trim(),
            slug: data.slug.trim().toLowerCase().replace(/\s+/g, "-"),
            description: data.description,
            difficulty: data.difficulty || "medium",
            tags: data.tags || ["General"],
            hints: data.hints || [],
            expected_answer: data.expected_answer || null,
            answer_type: data.answer_type || "exact",
            answer_tolerance: data.answer_tolerance || 0,
            xp_reward: data.xp_reward || 150,
            is_published: data.is_published ?? true,
        })
        .select()
        .single();

    if (error) {
        console.error("[createAdminProblem]", error);
        return { error: "Failed to create problem: " + error.message };
    }

    revalidatePath("/admin/problems");
    revalidatePath("/academy/arena");
    return { success: true, problem };
}

export async function togglePublishProblem(id: string, isPublished: boolean) {
    try {
        await requireAdmin();
    } catch {
        return { error: "Permission denied." };
    }

    const admin = createAdminClient();
    const { error } = await admin
        .from("problems")
        .update({ is_published: isPublished })
        .eq("id", id);

    if (error) {
        console.error("[togglePublishProblem]", error);
        return { error: "Could not toggle publish status." };
    }

    revalidatePath("/admin/problems");
    revalidatePath("/academy/arena");
    return { success: true };
}

export async function getPendingSubmissions() {
    try {
        await requireAdmin();
    } catch {
        return [];
    }

    const admin = createAdminClient();
    const { data: attempts, error } = await admin
        .from("problem_attempts")
        .select(`
            id,
            user_id,
            problem_id,
            code_submission,
            is_correct,
            xp_earned,
            status,
            admin_feedback,
            started_at,
            submitted_at,
            problems (
                title,
                slug,
                xp_reward,
                difficulty
            ),
            profiles:user_id (
                full_name,
                avatar_url,
                role
            )
        `)
        .order("submitted_at", { ascending: false });

    if (error) {
        console.error("[getPendingSubmissions]", error);
        return [];
    }

    return (attempts || []).map((att: any) => ({
        ...att,
        problem_title: att.problems?.title || "Unknown Problem",
        problem_slug: att.problems?.slug || "",
        problem_xp: att.problems?.xp_reward || 150,
        user_name: att.profiles?.full_name || "Cadet",
        user_role: att.profiles?.role || "student",
    }));
}

export async function reviewSubmission(
    submissionId: string,
    status: "approved" | "rejected",
    feedback?: string
) {
    try {
        await requireAdmin();
    } catch {
        return { error: "Permission denied." };
    }

    const admin = createAdminClient();

    // Fetch submission details
    const { data: submission } = await admin
        .from("problem_attempts")
        .select("id, user_id, problem_id, problems(xp_reward)")
        .eq("id", submissionId)
        .single();

    if (!submission) {
        return { error: "Submission not found." };
    }

    const xpReward = (submission.problems as any)?.xp_reward || 150;
    let xpAwarded = 0;

    if (status === "approved") {
        // Award XP to student via DB RPC
        const { data: xpResult } = await admin.rpc("award_xp", {
            p_user_id: submission.user_id,
            p_event: "problem_solve",
            p_source_id: `problem_${submission.problem_id}`,
            p_xp: xpReward,
            p_meta: { problem_id: submission.problem_id, attempt_id: submissionId },
        });

        xpAwarded = (xpResult as { xp_awarded?: number })?.xp_awarded ?? xpReward;
    }

    const { error: updateError } = await admin
        .from("problem_attempts")
        .update({
            status,
            is_correct: status === "approved",
            xp_earned: xpAwarded,
            admin_feedback: feedback || null,
            reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

    if (updateError) {
        console.error("[reviewSubmission]", updateError);
        return { error: "Failed to update submission status." };
    }

    revalidatePath("/admin/submissions");
    revalidatePath("/admin");
    revalidatePath("/academy/arena");
    return { success: true, xpAwarded };
}
