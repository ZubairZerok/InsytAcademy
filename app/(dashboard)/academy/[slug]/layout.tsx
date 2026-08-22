import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/actions/get-course-content";
import { checkEnrollment } from "@/actions/enrollment";
import { CourseSidebar } from "@/components/academy/course-sidebar";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnrollButton } from "@/components/academy/enroll-button";

interface CourseLayoutProps {
    children: React.ReactNode;
    params: { slug: string };
}

export default async function CourseLayout({
    children,
    params,
}: CourseLayoutProps) {
    const course = await getCourseBySlug(params.slug);

    if (!course) {
        notFound();
    }

    // We need to pass the slug back to the sidebar for linking
    const courseWithSlug = { ...course, slug: params.slug };

    const isEnrolled = await checkEnrollment(course.id);

    return (
        <div className="space-y-8">
            {/* Course Header */}
            <div className="flex flex-col gap-4 border-b border-cyber-gray pb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <SectionHeading
                            title={course.title}
                            subtitle={isEnrolled ? "ACTIVE SEQUENCE" : "PROTOCOL LOCKED"}
                            className="mb-0"
                        />
                        <p className="max-w-2xl text-gray-400 mt-2">{course.description}</p>
                    </div>
                    {!isEnrolled && <EnrollButton courseId={course.id} />}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Main Content Area */}
                <div className="lg:col-span-3 min-h-[500px]">
                    {isEnrolled ? children : (
                        <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-cyber-gray bg-white/5 p-12 text-center">
                            <h3 className="text-xl font-bold text-white">Enrollment Required</h3>
                            <p className="mt-2 text-gray-400 mb-6 max-w-md">
                                Access to sensitive training materials is restricted. Initialize this protocol to begin.
                            </p>
                            <EnrollButton courseId={course.id} />
                        </div>
                    )}
                </div>

                {/* Sidebar Navigation */}
                <div className="order-first lg:order-last lg:col-span-1">
                    <div className="sticky top-24">
                        <CourseSidebar course={courseWithSlug} />
                    </div>
                </div>
            </div>
        </div>
    );
}
