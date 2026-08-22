// app/(dashboard)/academy/[slug]/page.tsx
import { redirect } from "next/navigation";

interface CourseOverviewProps {
    params: { slug: string };
}

export default function CourseOverviewPage({ params }: CourseOverviewProps) {
    redirect(`/academy/courses/${params.slug}`);
}
