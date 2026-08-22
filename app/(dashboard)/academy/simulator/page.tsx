
import { IDE } from "@/components/simulator/ide";
import { Suspense } from "react";

interface PageProps {
    searchParams: { cmd?: string };
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SimulatorPage({ searchParams }: PageProps) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login?next=/academy/simulator");
    }

    const initialCmd = searchParams.cmd;

    return (
        <div className="w-full">
            <Suspense fallback={<div className="text-white p-10">Initializing Environment...</div>}>
                <IDE initialCode={initialCmd} initialLanguage="r" />
            </Suspense>
        </div>
    );
}
