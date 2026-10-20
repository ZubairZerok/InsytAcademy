"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

    // 3. Feedback message
    const message = isCorrect ? "Correct answer!" : "Incorrect answer.";

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
    return { success: true, isCorrect, message };
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
        passed,
        results,
        explanations,
        correct_answers,
    };
}
