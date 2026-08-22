import { getUserCertificates } from "@/actions/certificates";
import { getUserCourses } from "@/actions/get-user-courses";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Award, CheckCircle2, ArrowRight, ShieldCheck, Download, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Certificates & Verified Credentials",
    description: "View and verify your earned agricultural science and bioinformatics certifications.",
};

export const dynamic = "force-dynamic";

interface CertificateRecord {
    id: string;
    course_id: string;
    issued_at: string;
    courses: {
        title: string;
        slug: string;
    } | null;
}

interface RawCert {
    id: string;
    course_id: string;
    issued_at: string;
    courses: { title: string; slug: string } | { title: string; slug: string }[] | null;
}

export default async function CertificatesPage() {
    const rawCerts = (await getUserCertificates()) as unknown as RawCert[];
    const enrolledCourses = await getUserCourses();

    const certificates: CertificateRecord[] = (rawCerts || []).map((c) => ({
        id: c.id,
        course_id: c.course_id,
        issued_at: c.issued_at,
        courses: c.courses ? (Array.isArray(c.courses) ? c.courses[0] : c.courses) : null,
    }));

    const completedCount = certificates.length;
    const inProgressCourses = enrolledCourses.filter((c) => c.progress < 100);

    return (
        <div className="space-y-10 pb-20">
            <SectionHeading
                title="Verified Credentials"
                subtitle="ACADEMIC & RESEARCH CERTIFICATIONS"
            />

            {/* Overview Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                        <Award className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-white">{completedCount}</div>
                        <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Earned Certificates</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-white">{inProgressCourses.length}</div>
                        <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Tracks In Progress</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-white">Cryptographic</div>
                        <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Verification Standard</div>
                    </div>
                </GlassCard>
            </div>

            {/* Issued Certificates Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-neon-green" />
                        ISSUED CERTIFICATES
                    </h2>
                    <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/20">
                        {completedCount} VERIFIED
                    </span>
                </div>

                {certificates.length === 0 ? (
                    <GlassCard className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                            <Award className="h-8 w-8 animate-pulse" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h3 className="text-lg font-bold text-white font-mono">No Certificates Earned Yet</h3>
                            <p className="text-xs text-gray-400 leading-relaxed font-mono">
                                Complete 100% of the lessons in any course track to automatically unlock and issue your verified certificate of completion.
                            </p>
                        </div>
                        <Link href="/academy/courses" className="pt-2">
                            <Button className="bg-neon-green hover:bg-neon-green/90 text-black font-bold h-11 px-6">
                                EXPLORE COURSES
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </GlassCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {certificates.map((cert) => {
                            const courseTitle = cert.courses?.title || "Specialized Agri-Science Protocol";
                            const courseSlug = cert.courses?.slug || "";
                            const issuedDate = new Date(cert.issued_at).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            });

                            return (
                                <GlassCard key={cert.id} className="p-6 relative overflow-hidden group hover:border-neon-green/30 transition-all flex flex-col justify-between space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-neon-green bg-neon-green/10 border border-neon-green/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    VERIFIED CREDENTIAL
                                                </div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors font-mono pt-1">
                                                    {courseTitle}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs text-gray-400">
                                            <div className="flex justify-between">
                                                <span>Issued To:</span>
                                                <span className="text-white font-bold">Authorized Learner</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Date Issued:</span>
                                                <span className="text-white">{issuedDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Credential ID:</span>
                                                <span className="text-neon-green font-mono">{cert.id.slice(0, 18)}...</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <Link href={`/academy/${courseSlug}`} className="flex-1">
                                            <Button variant="outline" className="w-full justify-between text-xs font-mono">
                                                <span>VIEW COURSE</span>
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                        <Button
                                            className="bg-neon-green hover:bg-neon-green/90 text-black font-bold text-xs font-mono"
                                            onClick={() => window.print()}
                                            title="Print/Download Credential"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* In-Progress Tracks */}
            {inProgressCourses.length > 0 && (
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-sky-400" />
                            CERTIFICATIONS IN PROGRESS
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {inProgressCourses.map((course) => (
                            <GlassCard key={course.id} className="p-6 space-y-4 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-white text-base font-mono">{course.title}</h3>
                                        <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20 font-bold">
                                            {course.progress}%
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div
                                        className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5"
                                        role="progressbar"
                                        aria-valuenow={course.progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={`${course.title} progress: ${course.progress}%`}
                                    >
                                        <div
                                            className="h-full bg-sky-400 transition-all duration-500"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>

                                    <p className="text-xs font-mono text-gray-400">
                                        {course.completedLessons} of {course.totalLessons} lessons completed. Complete remaining lessons to issue certificate.
                                    </p>
                                </div>

                                <Link href={course.nextLessonSlug ? `/academy/${course.slug}/${course.nextLessonSlug}` : `/academy/${course.slug}`}>
                                    <Button variant="outline" className="w-full justify-between hover:bg-white/5">
                                        <span>CONTINUE TRACK</span>
                                        <ArrowRight className="h-4 w-4 text-neon-green" />
                                    </Button>
                                </Link>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
