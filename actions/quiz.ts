"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calcLevel } from "@/lib/gamification/constants";

export async function submitQuizAnswer(
    questionId: string,
    selectedOptionIndex: number,
    courseSlug: string,
    lessonSlug: string
) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // 1. Fetch Question (Correct Answer & Points)
    const { data: question } = await supabase
        .from("quiz_questions")
        .select("correct_option, points, quizzes!inner(lesson_id)")
        .eq("id", questionId)
        .single();

    if (!question) return { error: "Question not found" };

    const isCorrect = String(question.correct_option) === String(selectedOptionIndex);

    // 2. Record Attempt
    const { error: attemptError } = await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        question_id: questionId,
        is_correct: isCorrect,
    });

    if (attemptError) {
        console.error("Quiz Attempt Error:", attemptError);
        return { error: "Failed to record attempt" };
    }

    // 3. Handle Rewards (If Correct)
    let xpGained = 0;
    let message = isCorrect ? "Correct answer!" : "Incorrect answer.";

    if (isCorrect) {
        // Check if previously answered correctly (to prevent infinite XP farming)
        const { data: previousCorrect } = await supabase
            .from("quiz_attempts")
            .select("id")
            .eq("user_id", user.id)
            .eq("question_id", questionId)
            .eq("is_correct", true)
            .neq("attempted_at", new Date().toISOString()) // Exclude just inserted (approx check, strictly should use ID)
            .limit(1); // just need to know if any exist

        // Wait, the insert happened above. So we need to check if there is MORE than 1 correct attempt now.
        // Or simpler: Check count of correct attempts.

        const { count } = await supabase
            .from("quiz_attempts")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", user.id)
            .eq("question_id", questionId)
            .eq("is_correct", true);

        // If this is the FIRST correct attempt, award XP.
        if (count === 1) {
            const points = question.points || 10;

            // Fetch User
            const { data: profile } = await supabase.from("profiles").select("total_xp, level").eq("id", user.id).single();
            const currentXP = profile?.total_xp || 0;
            const newXP = currentXP + points;
            const newLevel = calcLevel(newXP);

            await supabase.from("profiles").update({ total_xp: newXP, level: newLevel }).eq("id", user.id);

            xpGained = points;
            message = `Correct! +${points} XP`;
        } else {
            message = "Correct! (Already mastered)";
        }
    }

    // Mark Lesson as Complete in User Progress
    // Get lesson ID from question -> lesson_id is nested in quizzes relation
    const lesson_id = (question.quizzes as any)?.lesson_id;
    if (lesson_id) {
        const { error: progressError } = await supabase
            .from("user_progress")
            .upsert({
                user_id: user.id,
                lesson_id: lesson_id,
                completed_at: new Date().toISOString()
            }, { onConflict: 'user_id, lesson_id' });

        if (progressError) console.error("Progress Update Error:", progressError);
    }

    revalidatePath(`/academy/${courseSlug}/${lessonSlug}`);
    return { success: true, isCorrect, xpGained, message };
}

export async function getQuizForLesson(lessonId: string) {
    const supabase = createClient();

    const { data: quiz } = await supabase
        .from("quizzes")
        .select("id")
        .eq("lesson_id", lessonId)
        .single();

    if (!quiz) return [];

    const { data: questions } = await supabase
        .from("quiz_questions")
        .select("id, question_text, options")
        .eq("quiz_id", quiz.id)
        .order("order_index", { ascending: true });

    return (questions || []).map(q => ({
        id: q.id,
        question: q.question_text,
        options: q.options
    }));
}

export async function submitQuizAnswers(
    quizId: string,
    answers: Record<string, string>,
    _timeTakenSeconds?: number
) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Fetch quiz questions for this lesson/quiz
    const { data: questions } = await supabase
        .from("quiz_questions")
        .select("id, correct_option, options, explanation, points, quizzes!inner(lesson_id)")
        .eq("quiz_id", quizId); // Assuming quizId here is actually the gamification quiz.id

    const results: Record<string, boolean> = {};
    const explanations: Record<string, string | null> = {};
    const correct_answers: Record<string, string> = {};

    let totalPoints = 0;
    let earnedPoints = 0;

    if (questions && questions.length > 0) {
        for (const q of questions) {
            const selectedOption = answers[q.id];
            const isCorrect = String(q.correct_option) === String(selectedOption);
            results[q.id] = isCorrect;
            explanations[q.id] = q.explanation || null;
            correct_answers[q.id] = String(q.correct_option);

            const pts = q.points || 10;
            totalPoints += pts;
            if (isCorrect) earnedPoints += pts;
        }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
    const passed = score >= 60;
    const xp_earned = passed ? earnedPoints : 0;

    let leveled_up = false;
    let new_level = 1;
    let new_total_xp = 0;

    if (passed && xp_earned > 0) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("total_xp, level")
            .eq("id", user.id)
            .single();

        const currentXP = profile?.total_xp || 0;
        const currentLevel = profile?.level || 1;
        new_total_xp = currentXP + xp_earned;
        new_level = calcLevel(new_total_xp);
        leveled_up = new_level > currentLevel;

        await supabase
            .from("profiles")
            .update({ total_xp: new_total_xp, level: new_level })
            .eq("id", user.id);
    }

    // Mark Lesson as Complete in User Progress if passed
    if (passed && questions && questions.length > 0) {
        const lesson_id = (questions[0].quizzes as any)?.lesson_id;
        if (lesson_id) {
            const { error: progressError } = await supabase
                .from("user_progress")
                .upsert({
                    user_id: user.id,
                    lesson_id: lesson_id,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id, lesson_id' });

            if (progressError) console.error("Progress Update Error:", progressError);
        }
    }

    revalidatePath("/academy", "layout");

    return {
        submission_id: Date.now().toString(),
        score,
        xp_earned,
        passed,
        results,
        explanations,
        correct_answers,
        leveled_up,
        new_level,
        new_total_xp,
    };
}
