// app/(dashboard)/academy/profile/page.tsx
import { getSettings } from "@/actions/settings";
import { getUserActivityLog } from "@/actions/activity";
import { ProfileDetails } from "@/components/academy/profile-details";
import { SectionHeading } from "@/components/ui/section-heading";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface TransactionDbResult {
    id: string;
    amount: number;
    currency: string;
    gateway: string;
    trx_id: string;
    status: string;
    created_at: string;
    courses: { title: string } | { title: string }[] | null;
}

export default async function ProfilePage() {
    const rawData = await getSettings();
    const data = rawData || {
        profile: {
            id: "bau-student-1",
            full_name: "Hasan Zubair",
            username: "hasanzubair",
            email: "student@bau.edu.bd",
            avatar_url: "",
            bio: "Agricultural Economics & Data Analytics Researcher at BAU.",
            role: "student",
            total_xp: 4200,
            level: 4,
            current_streak: 7,
            longest_streak: 14,
            created_at: new Date().toISOString(),
        },
        notifications: [],
    };

    const activityLog = (await getUserActivityLog()) || [];

    const supabase = createClient();
    let formattedTransactions: {
        id: string;
        amount: number;
        currency: string;
        gateway: string;
        trx_id: string;
        status: string;
        created_at: string;
        courses: { title: string } | null;
    }[] = [];

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: transactions } = await supabase
                .from("transactions")
                .select(`
                    id,
                    amount,
                    currency,
                    gateway,
                    trx_id,
                    status,
                    created_at,
                    courses (
                        title
                    )
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            formattedTransactions = ((transactions as unknown as TransactionDbResult[]) || []).map((t) => ({
                id: t.id,
                amount: Number(t.amount),
                currency: t.currency,
                gateway: t.gateway,
                trx_id: t.trx_id,
                status: t.status,
                created_at: t.created_at,
                courses: Array.isArray(t.courses) ? (t.courses[0] || null) : (t.courses || null)
            }));
        }
    } catch {
        // Fallback for open access
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <SectionHeading
                badge="ACADEMIC PROFILE"
                title="Student Telemetry & Settings"
                description="Manage your institutional BAU credentials, faculty allocation, and view activity telemetry."
            />

            <ProfileDetails
                initialData={{
                    id: (data as any).profile?.id || "bau-student-1",
                    email: (data as any).profile?.email || "student@bau.edu.bd",
                    full_name: (data as any).profile?.full_name || "Hasan Zubair",
                    role: (data as any).profile?.role || "student",
                    avatar_url: (data as any).profile?.avatar_url || null,
                    settings: (data as any).settings || {}
                }}
                activityLog={activityLog}
                transactions={formattedTransactions}
            />
        </div>
    );
}
