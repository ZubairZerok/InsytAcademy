import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (secret && authHeader && authHeader !== `Bearer ${secret}`) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch courses overview
        const { data: courses, error } = await supabase
            .from("courses")
            .select("id, title, slug, modules(id, title, lessons(id, title))");

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Course enrichment pipeline active and synchronized.",
            courses: courses.map(c => ({
                title: c.title,
                slug: c.slug,
                modulesCount: c.modules?.length,
                lessonsCount: c.modules?.reduce((acc: number, m: { lessons?: unknown[] }) => acc + (m.lessons?.length || 0), 0)
            }))
        });
    } catch (err: unknown) {
        return NextResponse.json(
            { success: false, error: err instanceof Error ? err.message : "Internal error" },
            { status: 500 }
        );
    }
}
