// lib/bau-data/assessment.ts
import type { CourseAssessmentScores } from "@/types/bau";

export function convertScoreToGrade(totalScore: number): { letterGrade: CourseAssessmentScores["letterGrade"]; gradePoint: number } {
    const clamped = Math.min(100, Math.max(0, Math.round(totalScore)));

    if (clamped >= 80) return { letterGrade: "A+", gradePoint: 4.00 };
    if (clamped >= 75) return { letterGrade: "A", gradePoint: 3.75 };
    if (clamped >= 70) return { letterGrade: "A-", gradePoint: 3.50 };
    if (clamped >= 65) return { letterGrade: "B+", gradePoint: 3.25 };
    if (clamped >= 60) return { letterGrade: "B", gradePoint: 3.00 };
    if (clamped >= 55) return { letterGrade: "B-", gradePoint: 2.75 };
    if (clamped >= 50) return { letterGrade: "C+", gradePoint: 2.50 };
    if (clamped >= 45) return { letterGrade: "C", gradePoint: 2.25 };
    if (clamped >= 40) return { letterGrade: "D", gradePoint: 2.00 };
    return { letterGrade: "F", gradePoint: 0.00 };
}
