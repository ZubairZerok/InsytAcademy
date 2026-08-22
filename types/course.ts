// types/course.ts
// Centralized TypeScript interfaces for Courses, Modules, Lessons, and Progress.

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    slug: string;
    content: string | null;
    content_variants?: Record<string, string> | null;
    video_url: string | null;
    order_index: number;
    created_at?: string;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    slug: string;
    description: string | null;
    order_index: number;
    lessons?: Lesson[];
    created_at?: string;
}

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    is_published: boolean;
    modules?: Module[];
    created_at?: string;
}

export interface LessonData {
    courseId: string;
    lessonIndex: number;
    lesson: Lesson;
    nextLesson: { slug: string; title: string } | null;
    prevLesson: { id: string; slug: string; title: string } | null;
}

export interface EnrolledCourse {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    totalLessons: number;
    completedLessons: number;
    progress: number; // 0-100
    lastAccessed: string | null;
    isEnrolled?: boolean;
    nextLessonSlug?: string;
}

export interface UserProgress {
    user_id: string;
    lesson_id: string;
    completed_at: string;
}

export interface Enrollment {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: string;
}
