// actions/bau-viva.ts
"use server";

import { GeminiService } from "@/lib/ai/gemini-service";
import type { VivaQuestion, VivaTurnEvaluation, VivaSessionSummary } from "@/types/bau";
import { getCourseByCode } from "@/lib/bau-data/courses";

const DEFAULT_VIVA_BANK: Record<string, VivaQuestion[]> = {
    "AAS 2107": [
        {
            id: "viva-aas-1",
            courseCode: "AAS 2107",
            topic: "Hypothesis Testing & Type I/II Errors",
            difficulty: "Fundamental",
            questionText: "Candidate, explain the fundamental difference between a Type I error and a Type II error in an agricultural field trial.",
            expectedKeyPoints: [
                "Type I error (alpha): rejecting a true null hypothesis.",
                "Type II error (beta): failing to reject a false null hypothesis.",
                "Alpha is the level of significance (typically 0.05 or 0.01).",
                "Power of the test equals 1 minus beta."
            ],
            idealAnswerSummary: "A Type I error occurs when the researcher falsely claims a new crop treatment has a significant effect when in reality there is none (rejecting true H0). A Type II error occurs when a genuine treatment effect exists but the trial fails to detect it (accepting false H0). Power is 1 - beta."
        },
        {
            id: "viva-aas-2",
            courseCode: "AAS 2107",
            topic: "Analysis of Variance (ANOVA) Assumptions",
            difficulty: "Applied",
            questionText: "What are the three essential mathematical assumptions that must hold before you can validly perform an F-test in ANOVA?",
            expectedKeyPoints: [
                "Normality of experimental residuals.",
                "Homogeneity of variances (Homoscedasticity across treatment groups).",
                "Independence of error terms / random allocation."
            ],
            idealAnswerSummary: "The three core assumptions are: 1. Normal distribution of residuals, 2. Homogeneity of variances across all treatment groups (homoscedasticity), and 3. Mutual independence of observations guaranteed through proper randomization."
        },
        {
            id: "viva-aas-3",
            courseCode: "AAS 2107",
            topic: "RCBD vs. CRD in BAU Field Trials",
            difficulty: "Comprehensive",
            questionText: "Why do we prefer a Randomized Complete Block Design over a Completely Randomized Design when laying out yield plots at the BAU Agronomy Farm?",
            expectedKeyPoints: [
                "Field heterogeneity and soil fertility gradients.",
                "Blocking partitions out nuisance variability.",
                "Reduces experimental error mean square.",
                "Increases precision of treatment comparisons."
            ],
            idealAnswerSummary: "Open agricultural fields exhibit natural soil fertility gradients and moisture slopes. RCBD groups homogeneous plots into blocks perpendicular to the gradient, partitioning extraneous environmental variance out of the experimental error and yielding a much more sensitive F-test."
        }
    ],
    "AE 2111": [
        {
            id: "viva-ae-1",
            courseCode: "AE 2111",
            topic: "Cobb-Douglas Production Elasticity",
            difficulty: "Fundamental",
            questionText: "If the output elasticities of labor and capital in a Cobb-Douglas agricultural production function sum to 1.15, what economic returns to scale does the farm exhibit?",
            expectedKeyPoints: [
                "Returns to scale equals alpha plus beta.",
                "Sum > 1 implies Increasing Returns to Scale (IRS).",
                "Doubling all inputs increases output by more than double."
            ],
            idealAnswerSummary: "Since alpha + beta = 1.15 > 1, the production function exhibits Increasing Returns to Scale (IRS), meaning proportional increases in inputs yield more than proportional increases in agricultural output."
        }
    ],
    "AGRON 1101": [
        {
            id: "viva-agron-1",
            courseCode: "AGRON 1101",
            topic: "Critical Stages of Irrigation in Rice",
            difficulty: "Fundamental",
            questionText: "What are the two most sensitive growth stages in Boro rice where moisture stress causes irreversible grain yield reduction?",
            expectedKeyPoints: [
                "Panicle Initiation / Booting stage.",
                "Flowering and Anthesis / Milk stage.",
                "Causes high spikelet sterility."
            ],
            idealAnswerSummary: "The two most critical stages are Panicle Initiation (Booting) and Flowering (Anthesis). Drought stress at these stages disrupts pollen viability, resulting in severe spikelet sterility and chaffy grain."
        }
    ]
};

export async function getVivaQuestionsForCourse(
    courseCode: string,
    topic?: string
): Promise<VivaQuestion[]> {
    const normalized = courseCode.toUpperCase().replace(/\s+/g, " ");
    const bank = DEFAULT_VIVA_BANK[normalized] || DEFAULT_VIVA_BANK["AAS 2107"];
    return bank;
}

export async function submitVivaTurnAnswer(
    question: VivaQuestion,
    transcript: string,
    courseCode: string
): Promise<VivaTurnEvaluation> {
    const cleanTranscript = (transcript || "").trim().slice(0, 3000);
    if (!cleanTranscript) {
        return {
            questionId: question.id,
            studentTranscript: "",
            technicalAccuracy: 0,
            conceptualDepth: 0,
            reasoningScore: 0,
            fluencyScore: 0,
            examinerFeedback: "No spoken answer detected. Please unmute your microphone and speak clearly.",
            spokenFeedbackAudioText: "I could not hear your answer. Please repeat your response.",
            identifiedWeaknesses: ["No audible response"]
        };
    }

    return await GeminiService.gradeVivaTurn(question, cleanTranscript, courseCode);
}

export async function generateVivaSessionSummary(
    sessionId: string,
    courseCode: string,
    evaluations: VivaTurnEvaluation[]
): Promise<VivaSessionSummary> {
    const course = getCourseByCode(courseCode);
    const courseTitle = course?.title || "BAU Academic Course";

    if (!evaluations || evaluations.length === 0) {
        return {
            sessionId,
            courseCode,
            courseTitle,
            startedAt: new Date(Date.now() - 600000).toISOString(),
            completedAt: new Date().toISOString(),
            totalQuestions: 0,
            overallReadinessScore: 0,
            subMetrics: { accuracy: 0, depth: 0, reasoning: 0, fluency: 0 },
            strengthAreas: [],
            criticalWeaknesses: ["Session incomplete"],
            remedialRecommendation: {
                topic: "Course Fundamentals",
                estimatedMinutes: 15,
                actionUrl: `/academy/courses/${courseCode.toLowerCase().replace(/\s+/g, "-")}`
            },
            examinerNote: "Viva session concluded without recorded responses."
        };
    }

    const avgAccuracy = Math.round(evaluations.reduce((sum, e) => sum + e.technicalAccuracy, 0) / evaluations.length);
    const avgDepth = Math.round(evaluations.reduce((sum, e) => sum + e.conceptualDepth, 0) / evaluations.length);
    const avgReasoning = Math.round(evaluations.reduce((sum, e) => sum + e.reasoningScore, 0) / evaluations.length);
    const avgFluency = Math.round(evaluations.reduce((sum, e) => sum + e.fluencyScore, 0) / evaluations.length);

    // Weighted Overall Readiness: Accuracy 40%, Depth 30%, Reasoning 20%, Fluency 10%
    const overallReadinessScore = Math.round(
        avgAccuracy * 0.4 + avgDepth * 0.3 + avgReasoning * 0.2 + avgFluency * 0.1
    );

    const allWeaknesses = Array.from(new Set(evaluations.flatMap(e => e.identifiedWeaknesses))).filter(Boolean);
    const primaryWeakness = allWeaknesses[0] || "Degrees of Freedom in Sampling Distributions";

    return {
        sessionId,
        courseCode,
        courseTitle,
        startedAt: new Date(Date.now() - 600000).toISOString(),
        completedAt: new Date().toISOString(),
        totalQuestions: evaluations.length,
        overallReadinessScore,
        subMetrics: {
            accuracy: avgAccuracy,
            depth: avgDepth,
            reasoning: avgReasoning,
            fluency: avgFluency
        },
        strengthAreas: [
            "Clear articulation of primary hypotheses ($H_0$ and $H_1$)",
            "Strong grasp of agricultural field blocking principles (RCBD)",
            "Confident verbal delivery and academic posture"
        ],
        criticalWeaknesses: allWeaknesses.length > 0 ? allWeaknesses : ["Minor oversight in degrees of freedom parameter formulation"],
        remedialRecommendation: {
            topic: `Prerequisite Sprint: ${primaryWeakness}`,
            estimatedMinutes: 12,
            prerequisiteCourse: "AAS 1101 (Probability & Distributions)",
            actionUrl: `/academy/courses/aas-2107-statistical-inference`
        },
        examinerNote: overallReadinessScore >= 80
            ? "Candidate demonstrated exemplary command of experimental statistics. Recommended for First Class honors standard."
            : "Satisfactory oral defense with solid core understanding. Recommended to complete the 12-minute remedial sprint before continuous assessments."
    };
}
