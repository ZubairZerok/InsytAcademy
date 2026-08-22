// app/(dashboard)/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let userData = {
        email: "student@bau.edu.bd",
        full_name: "Hasan Zubair",
        avatar_url: "",
    };

    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            userData = {
                email: user.email || "student@bau.edu.bd",
                full_name: profile?.full_name || user.user_metadata?.full_name || "Hasan Zubair",
                avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || "",
            };
        }
    } catch {
        // Safe fallback for open mode
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
            <DashboardSidebar user={userData} />

            {/* Main Content Area */}
            <main className="dashboard-main flex-1 min-w-0 flex flex-col transition-all duration-300">
                {/* Top navigation bar */}
                <DashboardTopbar user={userData} />
                <div className="p-4 md:p-8 flex-1">{children}</div>
            </main>
        </div>
    );
}
