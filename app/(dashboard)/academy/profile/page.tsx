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

import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const data = await getSettings();
    if (!data) {
        redirect("/login");
    }
    const activityLog = await getUserActivityLog();

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch real payment transactions for this user
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
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

    // Safely parse joined courses and map to exact expected type structure
    const formattedTransactions = ((transactions as unknown as TransactionDbResult[]) || []).map((t) => ({
        id: t.id,
        amount: Number(t.amount),
        currency: t.currency,
        gateway: t.gateway,
        trx_id: t.trx_id,
        status: t.status,
        created_at: t.created_at,
        courses: Array.isArray(t.courses) ? (t.courses[0] || null) : (t.courses || null)
    }));

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <SectionHeading
                title="Agent Credentials"
                subtitle="PROFILE OVERVIEW"
            />

            <ProfileDetails 
                initialData={data} 
                activityLog={activityLog} 
                transactions={formattedTransactions} 
            />
        </div>
    );
}
