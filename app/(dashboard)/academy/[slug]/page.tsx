import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/actions/get-course-content";
import { EnrollButton } from "@/components/academy/enroll-button";
import { BackButton } from "@/components/ui/back-button";
import { checkEnrollment } from "@/actions/enrollment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle, Lock, MonitorPlay, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { getResumeLesson } from "@/actions/resume";

interface CourseOverviewProps {
    params: { slug: string };
}

export default async function CourseOverviewPage({ params }: CourseOverviewProps) {
    const course = await getCourseBySlug(params.slug);
    if (!course) notFound();

    const isEnrolled = await checkEnrollment(course.id);
    const resumeLesson = await getResumeLesson(course.slug);

    // Flatten lessons for easier "first lesson" access
    const allLessons = course.modules.flatMap(m => m.lessons);
    const firstLesson = allLessons[0];

    // Calculate total module count
    const totalModules = course.modules.length;

    // Pre-compute global lesson indices BEFORE render (avoids side-effects in JSX)
    const lessonIndexMap = new Map<string, number>();
    let idx = 0;
    course.modules.forEach(m => m.lessons.forEach(l => lessonIndexMap.set(l.id, ++idx)));

    return (
        <div className="space-y-8 pb-20">
            <BackButton href="/academy/courses" label="COURSE ROSTER" />
            {/* Banner / Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-agri-dark/50 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-neon-green/10 blur-3xl" />

                <div className="relative z-10 max-w-2xl space-y-4 flex-1">
                    <div className="inline-flex items-center rounded bg-neon-green/10 px-3 py-1 text-xs font-bold text-neon-green border border-neon-green/20">
                        PROTOCOL ACCESS
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight md:text-5xl">
                        {course.title}
                    </h1>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {course.description}
                    </p>

                    <div className="pt-4 flex flex-wrap gap-4">
                        {isEnrolled ? (
                            <Link href={`/academy/${course.slug}/${resumeLesson?.slug || firstLesson?.slug}`}>
                                <Button className="h-12 px-8 text-base">
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    {resumeLesson && resumeLesson.slug !== firstLesson?.slug ? "RESUME PROTOCOL" : "START PROTOCOL"}
                                </Button>
                            </Link>
                        ) : (
                            <EnrollButton courseId={course.id} />
                        )}

                        <div className="flex items-center gap-6 text-sm text-gray-400 px-4 py-3 bg-black/20 rounded-md border border-white/5">
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-neon-green" />
                                <span>{totalModules} MODULES</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MonitorPlay className="h-4 w-4 text-neon-green" />
                                <span>{allLessons.length} LESSONS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {course.thumbnail_url && (
                    <div className="relative w-full md:w-72 aspect-[16/9] md:aspect-video rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-[0_0_25px_rgba(0,0,0,0.5)] z-10">
                        <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Syllabus List (grouped by Module) */}
            <div className="space-y-8">
                {course.modules.map((module) => (
                    <div key={module.id} className="space-y-4">
                        <div className="flex items-end justify-between border-b border-white/10 pb-2 px-2">
                            <div>
                                <h3 className="text-lg font-bold text-neon-green font-mono tracking-wider">
                                    {module.title.toUpperCase()}
                                </h3>
                                <p className="text-sm text-gray-400 max-w-xl">
                                    {module.description}
                                </p>
                            </div>
                            <span className="text-xs font-mono text-gray-600">
                                {String(module.order_index).padStart(2, '0')}
                            </span>
                        </div>

                        <div className="grid gap-3">
                            {module.lessons.map((lesson) => {
                                const lessonNum = lessonIndexMap.get(lesson.id) ?? 0;
                                const isLocked = !isEnrolled && lessonNum > 1;

                                return (
                                    <div
                                        key={lesson.id}
                                        className={cn(
                                            "group relative flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10",
                                            isLocked && "opacity-60 grayscale"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/40 font-mono text-neon-green text-sm font-bold">
                                                {String(lessonNum).padStart(2, '0')}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white group-hover:text-neon-green transition-colors">
                                                    {lesson.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="ml-4">
                                            {!isLocked ? (
                                                <Link href={`/academy/${course.slug}/${lesson.slug}`}>
                                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                        ACCESS <PlayCircle className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Lock className="h-5 w-5 text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
