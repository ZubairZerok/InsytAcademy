"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { LogOut, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationHub } from "@/components/academy/notification-hub";

const navLinks = [
    { label: "Dashboard", href: "/academy" },
    { label: "Courses", href: "/academy/courses" },
    { label: "Research", href: "/research" },
    { label: "Opportunities", href: "/opportunities" },
];

interface DashboardTopbarProps {
    user?: {
        email?: string;
        full_name?: string;
        avatar_url?: string;
    } | null;
}

export function DashboardTopbar({ user: userProp }: DashboardTopbarProps) {
    const [stateUser, setStateUser] = useState<SupabaseUser | null>(null);
    const [avatarError, setAvatarError] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        if (userProp) return; // Skip fetch if passed as prop
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setStateUser(session?.user || null);
        };
        fetchUser();
        const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setStateUser(s?.user || null));
        return () => listener.subscription.unsubscribe();
    }, [supabase, userProp]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // Find current page name for breadcrumb
    const currentPage = navLinks.find(l => l.href === pathname || (l.href !== "/academy" && pathname.startsWith(l.href)));

    // Resolve user data from props or client state
    const displayUser = userProp || (stateUser ? {
        email: stateUser.email,
        full_name: stateUser.user_metadata?.full_name || undefined,
        avatar_url: stateUser.user_metadata?.avatar_url || undefined
    } : null);

    const initials = (() => {
        if (!displayUser) return "";
        if (displayUser.full_name) {
            const parts = displayUser.full_name.trim().split(/\s+/).filter(Boolean);
            if (parts.length > 0) return parts.map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
        }
        if (displayUser.email) {
            return displayUser.email[0].toUpperCase();
        }
        return "";
    })();

    const activeNavLinks = displayUser
        ? navLinks
        : navLinks.filter(l => l.href !== "/academy");

    return (
        <div className="hidden md:flex h-14 items-center justify-between px-6 border-b border-white/[0.06] bg-agri-dark/80 backdrop-blur-xl sticky top-0 z-30">
            {/* Breadcrumb — shows current section */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <span>INSYT.OS</span>
                {currentPage && (
                    <>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-gray-300">{currentPage.label.toUpperCase()}</span>
                    </>
                )}
            </div>

            {/* Nav links */}
            <nav className="flex items-center gap-1">
                {activeNavLinks.map(({ label, href }) => {
                    const isActive = pathname === href || (href !== "/academy" && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href}>
                            <Button
                                variant="ghost"
                                className={`text-sm font-normal rounded-lg h-8 px-3.5 transition-all ${
                                    isActive
                                        ? "bg-emerald-100 text-emerald-900 font-bold dark:bg-neon-green dark:text-black dark:font-bold dark:shadow-[0_0_15px_rgba(0,255,148,0.35)]"
                                        : "text-gray-400 hover:text-neon-green hover:bg-neon-green/10"
                                }`}
                            >
                                {label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Right: theme toggle + auth actions */}
            <div className="flex items-center gap-2">
                <ThemeToggle />
                {displayUser ? (
                    <>
                        <NotificationHub />
                        <Link href="/academy/profile">
                            <div className="h-8 w-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green cursor-pointer hover:bg-neon-green/20 transition-all overflow-hidden" title={displayUser.full_name || displayUser.email || "Profile"}>
                                {displayUser.avatar_url && !avatarError ? (
                                    <img
                                        src={displayUser.avatar_url}
                                        alt={displayUser.full_name || "Profile"}
                                        className="h-full w-full object-cover"
                                        onError={() => setAvatarError(true)}
                                    />
                                ) : (
                                    initials || <User className="h-4 w-4" />
                                )}
                            </div>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-red-400 rounded-lg h-8 w-8"
                            title="Log Out"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" className="text-xs font-mono font-bold text-gray-300 hover:text-white rounded-lg h-8 px-3">
                                LOG IN
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="text-xs font-mono font-bold bg-neon-green text-black hover:bg-neon-green/90 rounded-lg h-8 px-4 shadow-[0_0_12px_rgba(0,255,148,0.3)]">
                                START LEARNING
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
