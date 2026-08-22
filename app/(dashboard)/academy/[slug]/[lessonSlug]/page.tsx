import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getLesson } from "@/actions/get-lesson";
import { getQuizForLesson } from "@/actions/quiz";
import { checkEnrollment } from "@/actions/enrollment";
import { checkLessonCompleted } from "@/actions/progress";
import { VideoPlayer } from "@/components/academy/video-player";
import { Button } from "@/components/ui/button";
import { LessonCompleteButton } from "@/components/academy/complete-button";
import { QuizPlayer } from "@/components/academy/quiz-player";
import { LessonContent } from "@/components/academy/lesson-content";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

interface LessonPageProps {
    params: { slug: string; lessonSlug: string };
}

export default async function LessonPage({ params }: LessonPageProps) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/login?next=${encodeURIComponent(`/academy/${params.slug}/${params.lessonSlug}`)}`);
    }

    const lessonData = await getLesson(params.slug, params.lessonSlug);

    if (!lessonData) {
        notFound();
    }

    const { lesson, nextLesson, prevLesson, courseId, lessonIndex } = lessonData;
    const questions = await getQuizForLesson(lesson.id);

    const isEnrolled = await checkEnrollment(courseId);
    const isCurrentCompleted = await checkLessonCompleted(lesson.id);
    const hasQuiz = questions && questions.length > 0;

    // Strict Enforcement: Sequence locking
    let isLocked = false;
    let lockedReason = "";
    let lockedRedirectUrl = `/academy/${params.slug}`;

    if (lessonIndex > 1) {
        if (!isEnrolled) {
            isLocked = true;
            lockedReason = "You must enroll in this course to access advanced lessons.";
            lockedRedirectUrl = `/academy/${params.slug}`;
        } else if (prevLesson && prevLesson.id) {
            const isPrevCompleted = await checkLessonCompleted(prevLesson.id);
            if (!isPrevCompleted) {
                isLocked = true;
                lockedReason = "You must complete the previous lesson to unlock this content.";
                lockedRedirectUrl = `/academy/${params.slug}/${prevLesson.slug}`;
            }
        }
    }

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] pb-20">
                <div className="rounded-xl border border-cyber-gray/30 bg-agri-dark/80 p-10 backdrop-blur-md text-center space-y-6 max-w-md w-full flex flex-col items-center shadow-2xl">
                    <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <Lock className="w-12 h-12 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white tracking-wide">CONTENT LOCKED</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">{lockedReason}</p>
                    </div>
                    <Link href={lockedRedirectUrl} className="w-full pt-4">
                        <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-bold border-none shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">
                            GO BACK
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-20">
            {/* Video Player */}
            <VideoPlayer url={lesson.video_url} />



            {/* Title & Content */}
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white md:text-4xl">
                    {lesson.title}
                </h1>

                <LessonContent content={lesson.content || ""} />
            </div>
            {/* Quiz Module */}
            <QuizPlayer
                questions={questions}
                courseSlug={params.slug}
                lessonSlug={params.lessonSlug}
            />

            {/* Navigation Panel */}
            <div className="rounded-xl border border-cyber-gray/30 bg-agri-dark/40 p-6 backdrop-blur-md space-y-4">
                <h3 className="font-mono text-sm font-bold text-white">SEQUENCE CONTROL</h3>
                <div className="flex flex-col gap-3">
                    {prevLesson ? (
                        <Link href={`/academy/${params.slug}/${prevLesson.slug}`}>
                            <Button variant="outline" className="w-full justify-start">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                PREVIOUS LESSON
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="outline" disabled className="w-full justify-start opacity-50">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            START OF SEQUENCE
                        </Button>
                    )}

                    {nextLesson ? (
                        isEnrolled ? (
                            isCurrentCompleted ? (
                                <Link href={`/academy/${params.slug}/${nextLesson.slug}`}>
                                    <Button className="w-full justify-between">
                                        NEXT LESSON
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : hasQuiz ? (
                                <Button className="w-full justify-between opacity-50 cursor-not-allowed" disabled>
                                    PASS QUIZ TO UNLOCK NEXT LESSON
                                    <Lock className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <LessonCompleteButton
                                    lessonId={lesson.id}
                                    courseSlug={params.slug}
                                    isCompleted={false}
                                    nextLessonUrl={`/academy/${params.slug}/${nextLesson.slug}`}
                                />
                            )
                        ) : (
                            <Link href={`/academy/${params.slug}`}>
                                <Button className="w-full justify-between bg-neon-green text-black hover:bg-neon-green/90 font-bold border-none">
                                    ENROLL TO CONTINUE
                                    <Lock className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        )
                    ) : (
                        // No next lesson (End of course)
                        isCurrentCompleted ? (
                            <Button variant="outline" className="w-full justify-center text-neon-green border-neon-green hover:bg-transparent cursor-default">
                                <CheckCircle className="mr-2 h-4 w-4" /> COURSE COMPLETED
                            </Button>
                        ) : hasQuiz ? (
                            <Button className="w-full justify-between opacity-50 cursor-not-allowed" disabled>
                                PASS QUIZ TO FINISH
                                <Lock className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <LessonCompleteButton
                                lessonId={lesson.id}
                                courseSlug={params.slug}
                                isCompleted={false}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
