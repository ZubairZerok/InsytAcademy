// app/(dashboard)/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let userData = null;

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        userData = {
            email: user.email,
            full_name: profile?.full_name || user.user_metadata?.full_name,
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
        };
    }

    return (
        <div className="flex min-h-screen bg-white dark:bg-agri-black text-gray-900 dark:text-white">
            <DashboardSidebar user={userData} />

            {/* Main Content Area without duplicate left padding */}
            <main className="dashboard-main flex-1 min-w-0 flex flex-col pt-14 md:pt-0 transition-all duration-300">
                {/* Top navigation bar — rendered on desktop */}
                <DashboardTopbar user={userData} />
                <div className="p-4 md:p-8 flex-1">{children}</div>
            </main>
        </div>
    );
}
