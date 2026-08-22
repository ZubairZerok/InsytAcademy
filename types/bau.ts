// types/bau.ts
// Comprehensive TypeScript interfaces for Bangladesh Agricultural University (BAU)
// Academic Intelligence & Learning Operating System.

export type DataProvenanceState = "VERIFIED" | "DEMO" | "PENDING_VERIFICATION";

export type BAUFacultyCode = "FOA" | "FVS" | "FAH" | "FAERS" | "FAET" | "FOF";

export interface BAUFaculty {
    id: string;
    code: BAUFacultyCode;
    name: string;
    shortName: string;
    icon: string;
    description: string;
    dean: string;
    totalDepartments: number;
    departments: BAUDepartment[];
    provenance: DataProvenanceState;
}

export interface BAUDepartment {
    id: string;
    code: string;
    name: string;
    facultyCode: BAUFacultyCode;
    head?: string;
    degrees: BAUDegree[];
    provenance: DataProvenanceState;
}

export interface BAUDegree {
    id: string;
    name: string;
    shortName: string;
    degreeType: "Undergraduate" | "Master of Science (MS)" | "PhD";
    durationYears: number;
    totalSemesters: number;
    facultyCode: BAUFacultyCode;
    departmentCode: string;
}

export interface BAULevelSemester {
    level: 1 | 2 | 3 | 4;
    semester: 1 | 2;
    displayName: string; // e.g. "Level 2, Semester 1 (L2S1)"
}

export interface CreditBreakdown {
    theoryCredits: number;
    practicalCredits: number;
    totalCredits: number;
    theoryHoursPerWeek: number;
    practicalHoursPerWeek: number;
}

export interface CourseTopic {
    id: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    isKeyExamTopic?: boolean;
    prerequisites?: string[]; // topic IDs
    learningOutcomes: string[];
}

export interface CourseModule {
    id: string;
    moduleNumber: number;
    title: string;
    description: string;
    topics: CourseTopic[];
}

export interface CoursePrerequisite {
    courseCode: string;
    courseTitle: string;
    requiredGrade?: string;
    reason: string;
}

export interface BAUCourse {
    id: string;
    code: string; // e.g. "AAS 2107", "AE 2111", "AGRON 1101"
    title: string;
    slug: string;
    facultyCode: BAUFacultyCode;
    departmentCode: string;
    degreeId: string;
    level: 1 | 2 | 3 | 4;
    semester: 1 | 2;
    credits: CreditBreakdown;
    description: string;
    objectives: string[];
    prerequisites: CoursePrerequisite[];
    modules: CourseModule[];
    practicalModules?: CourseModule[];
    recommendedBooks: string[];
    provenance: DataProvenanceState;
    sourceReference?: string; // e.g. "BAU Academic Ordinance & Syllabus 2024-2025"
    enrolledCount?: number;
    averageGrade?: string;
    instructor?: {
        name: string;
        designation: string;
        email: string;
        photoUrl?: string;
    };
}

// Routine & Schedule Types
export interface RoutineEntry {
    id: string;
    courseCode: string;
    courseTitle: string;
    dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday";
    startTime: string; // e.g. "10:00"
    endTime: string;   // e.g. "11:00"
    room: string;      // e.g. "Gallery 204", "Computer Lab 3", "Field Lab 4"
    type: "Theory" | "Practical" | "Tutorial" | "Class Test";
    group?: "All" | "Group A" | "Group B" | "Group C" | "Group D";
    facultyCode: BAUFacultyCode;
    departmentCode: string;
    level: number;
    semester: number;
    teacherName?: string;
    isCustomAdded?: boolean;
}

export interface ScheduleConflict {
    type: "ROOM_CLASH" | "TIME_OVERLAP" | "STUDENT_GROUP_CLASH";
    message: string;
    entries: RoutineEntry[];
}

export interface PDFRoutineParseResult {
    success: boolean;
    extractedEventsCount: number;
    facultyDetected?: string;
    levelSemesterDetected?: string;
    academicYear?: string;
    events: RoutineEntry[];
    conflicts: ScheduleConflict[];
    confidenceScore: number;
    rawTextSnippet?: string;
    rawNoticeText?: string;
    provenance: "GEMINI_PARSED" | "DEMO_FALLBACK" | "GEMINI_1_5_FLASH" | "BAU_OFFICIAL_CATALOG" | "OPENROUTER_GPT4O_MINI" | string;
}

// AI Viva Voce Types
export interface VivaQuestion {
    id: string;
    courseCode: string;
    topic: string;
    difficulty: "Fundamental" | "Applied" | "Comprehensive";
    questionText: string;
    expectedKeyPoints: string[];
    idealAnswerSummary: string;
}

export interface VivaTurnEvaluation {
    questionId: string;
    studentTranscript: string;
    technicalAccuracy: number; // 0-100
    conceptualDepth: number;   // 0-100
    reasoningScore: number;    // 0-100
    fluencyScore: number;      // 0-100
    examinerFeedback: string;
    spokenFeedbackAudioText: string;
    identifiedWeaknesses: string[];
    recommendedSprintTopic?: string;
}

export interface VivaSessionSummary {
    sessionId: string;
    courseCode: string;
    courseTitle: string;
    studentId?: string;
    startedAt: string;
    completedAt: string;
    totalQuestions: number;
    overallReadinessScore: number; // 0-100
    subMetrics: {
        accuracy: number;
        depth: number;
        reasoning: number;
        fluency: number;
    };
    strengthAreas: string[];
    criticalWeaknesses: string[];
    remedialRecommendation: {
        topic: string;
        estimatedMinutes: number;
        prerequisiteCourse?: string;
        actionUrl: string;
    };
    examinerNote: string;
}

// Multimodal Field AI Types
export interface FieldSpecimen {
    id: string;
    name: string;
    category: "Crop Pathology" | "Agronomy & Weed" | "Soil Science" | "Veterinary Parasitology" | "Aquaculture Fish Disease" | "Farm Machinery";
    commonName: string;
    scientificName?: string;
    relatedCourseCode: string;
    imageUrl: string;
    symptomsOrCharacteristics: string[];
    educationalNotes: string;
    managementOrPracticalTask: string;
    safetyCaution: string;
    provenance: DataProvenanceState;
}

export interface VisualFinding {
    feature: string;
    observation: string;
    confidence: number;
}

export interface SpecimenAnalysisResult {
    specimenId?: string;
    probableIdentification: string;
    scientificName?: string;
    confidence: number; // 0-100
    category: string;
    mappedBAUCourse: {
        code: string;
        title: string;
        relevantModule: string;
    };
    visualFindings: VisualFinding[];
    educationalDiagnosis: string;
    labExerciseGuidance: string;
    safetyDisclaimer: string;
    provenance: "GEMINI_VISION" | "DEMO_FALLBACK" | "BAU_OFFICIAL_CATALOG" | "OPENROUTER_VISION" | string;
}

// BAU 10/20/70 Assessment & CGPA Types
export interface CourseAssessmentScores {
    courseCode: string;
    courseTitle: string;
    creditHours: number;
    attendanceScore: number;       // max 10
    continuousAssessmentScore: number; // max 20 (Class tests, Quizzes, Assignments)
    finalExamScore: number;        // max 70
    totalScore: number;            // max 100
    letterGrade: "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D" | "F";
    gradePoint: number;            // 0.00 to 4.00
}

export interface CGPATargetSimulation {
    currentCompletedCredits: number;
    currentCGPA: number;
    targetCGPA: number;
    currentSemesterCredits: number;
    requiredSemesterGPA: number;
    isFeasible: boolean;
    requiredAverageFinalExamScore: number; // out of 70 across courses
    strategyNotes: string[];
}

// Skill & Prerequisite Graph Types
export interface AcademicSkillNode {
    id: string;
    courseCode: string;
    title: string;
    facultyCode: BAUFacultyCode;
    levelSemester: string;
    credits: number;
    category: "Foundation" | "Core Theory" | "Practical Lab" | "Advanced Elective" | "Capstone / Thesis";
    status: "LOCKED" | "IN_PROGRESS" | "COMPLETED" | "REMEDIAL_REQUIRED";
    masteryPercent: number;
    prerequisites: string[]; // Node IDs
    unlockedCareers: string[];
    x: number;
    y: number;
}

// Research OS Types
export interface BAUResearchPaper {
    id: string;
    title: string;
    authors: { name: string; designation?: string; department: string }[];
    departmentCode: string;
    facultyCode: BAUFacultyCode;
    journalOrVenue: string;
    year: number;
    doi?: string;
    abstract: string;
    keyThemes: string[];
    methodology: string[];
    researchGaps: string[];
    openAccessPdfUrl?: string;
    citationCount: number;
}

// Career Bridge Types
export interface CareerPathway {
    id: string;
    roleTitle: string;
    category: "Government Cadre (BCS)" | "Research Institutes (BARI/BRRI/BLRI)" | "AgTech & Corporate" | "International Fellowship & Higher Studies";
    organizationExamples: string[];
    requiredDegree: string;
    targetDepartments: string[];
    keyRequiredCourses: string[];
    coreSkills: string[];
    salaryRangeBDT: string;
    roadmapSteps: { step: number; title: string; description: string }[];
}

// User Academic Profile State
export interface BAUUserProfile {
    fullName: string;
    studentId: string;
    facultyCode: BAUFacultyCode;
    facultyName: string;
    departmentCode: string;
    departmentName: string;
    degreeName: string;
    level: 1 | 2 | 3 | 4;
    semester: 1 | 2;
    targetCGPA: number;
    currentCGPA: number;
    academicGoal: "BCS Preparation" | "Scientific Officer / Research" | "Higher Studies Abroad" | "Agribusiness & Tech" | "Academic Excellence (First Class)";
    isProfileComplete: boolean;
}
