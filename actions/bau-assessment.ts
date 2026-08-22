// actions/bau-assessment.ts
"use server";

import type { CourseAssessmentScores, CGPATargetSimulation } from "@/types/bau";
import { convertScoreToGrade } from "@/lib/bau-data/assessment";

export async function calculateCourseResult(
    courseCode: string,
    courseTitle: string,
    creditHours: number,
    attendanceScore: number,       // 0-10
    continuousScore: number,       // 0-20
    finalExamScore: number         // 0-70
): Promise<CourseAssessmentScores> {
    const safeAttendance = Math.min(10, Math.max(0, attendanceScore));
    const safeContinuous = Math.min(20, Math.max(0, continuousScore));
    const safeFinal = Math.min(70, Math.max(0, finalExamScore));

    const totalScore = safeAttendance + safeContinuous + safeFinal;
    const { letterGrade, gradePoint } = convertScoreToGrade(totalScore);

    return {
        courseCode,
        courseTitle,
        creditHours,
        attendanceScore: safeAttendance,
        continuousAssessmentScore: safeContinuous,
        finalExamScore: safeFinal,
        totalScore,
        letterGrade,
        gradePoint
    };
}

export async function simulateCGPATarget(params: {
    currentCompletedCredits: number;
    currentCGPA: number;
    targetCGPA: number;
    currentSemesterCredits: number;
}): Promise<CGPATargetSimulation> {
    const { currentCompletedCredits, currentCGPA, targetCGPA, currentSemesterCredits } = params;

    const totalCredits = currentCompletedCredits + currentSemesterCredits;
    const requiredTotalQualityPoints = targetCGPA * totalCredits;
    const currentQualityPoints = currentCGPA * currentCompletedCredits;
    const requiredSemesterQualityPoints = requiredTotalQualityPoints - currentQualityPoints;

    const requiredSemesterGPA = requiredSemesterQualityPoints / currentSemesterCredits;

    // Check feasibility (max possible GPA is 4.00)
    const isFeasible = requiredSemesterGPA <= 4.00 && requiredSemesterGPA >= 0;

    // Estimate final exam score needed assuming average attendance (8/10) and continuous assessment (16/20)
    // Formula: TotalScoreNeeded = TargetScore corresponding to required GPA
    // For GPA 4.00 -> 80 marks. Base = 8 + 16 = 24. Required Final = 80 - 24 = 56.
    let requiredAverageFinalExamScore = 56;
    if (requiredSemesterGPA <= 3.00) {
        requiredAverageFinalExamScore = 40;
    } else if (requiredSemesterGPA <= 3.50) {
        requiredAverageFinalExamScore = 48;
    } else if (requiredSemesterGPA <= 3.75) {
        requiredAverageFinalExamScore = 52;
    } else {
        requiredAverageFinalExamScore = 56;
    }

    const strategyNotes: string[] = [];
    if (!isFeasible) {
        strategyNotes.push(`Mathematically unattainable within a single semester of ${currentSemesterCredits} credits (Requires Semester GPA ${requiredSemesterGPA.toFixed(2)} > 4.00). Recommend a 2-semester recovery plan.`);
    } else if (requiredSemesterGPA >= 3.75) {
        strategyNotes.push(`High precision required: Target A+ (80%+) in all major theory courses and maximize Continuous Assessment marks.`);
    } else if (requiredSemesterGPA >= 3.50) {
        strategyNotes.push(`Balanced preparation: Maintain minimum 70% in all continuous tests and 50+ out of 70 in final theory scripts.`);
    } else {
        strategyNotes.push(`Comfortably achievable: Secure regular attendance marks (8+/10) and consistent pass marks in final examination.`);
    }

    return {
        targetCGPA,
        currentCGPA,
        currentCompletedCredits,
        currentSemesterCredits,
        requiredSemesterGPA: Math.max(0, requiredSemesterGPA),
        isFeasible,
        requiredAverageFinalExamScore,
        strategyNotes
    };
}
