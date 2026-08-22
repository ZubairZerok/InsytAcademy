// components/layout/dashboard-topbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { LogOut, User, ChevronRight, Sparkles, GraduationCap, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationHub } from "@/components/academy/notification-hub";

const navLinks = [
    { label: "Dashboard", href: "/academy" },
    { label: "Courses", href: "/academy/courses" },
    { label: "Schedule", href: "/academy/schedule" },
    { label: "AI Viva", href: "/academy/viva" },
    { label: "Field AI", href: "/academy/field-lab" },
    { label: "Exam Lab", href: "/academy/assessment" },
    { label: "Research", href: "/research" },
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
    const [activeFaculty, setActiveFaculty] = useState("FAERS");
    const [activeCohort, setActiveCohort] = useState("Level 2 · Sem 1");
    const router = useRouter();
    const pathname = usePathname();
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedProfile = localStorage.getItem("insyt_bau_profile");
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.facultyCode) setActiveFaculty(parsed.facultyCode);
                    if (parsed.level && parsed.semester) setActiveCohort(`L${parsed.level}S${parsed.semester}`);
                } catch {
                    // ignore
                }
            }
        }
    }, []);

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

    return (
        <div className="hidden md:flex h-14 items-center justify-between px-6 border-b border-black/[0.08] dark:border-white/[0.06] bg-white/95 dark:bg-agri-dark/80 backdrop-blur-xl sticky top-0 z-30">
            {/* Left: Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">INSYT.BAU</span>
                {currentPage && (
                    <>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <span className="text-emerald-700 dark:text-neon-green font-bold">{currentPage.label.toUpperCase()}</span>
                    </>
                )}
            </div>

            {/* Center: Academic Cohort & AI Telemetry Badge */}
            <div className="flex items-center gap-3">
                <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-800 dark:text-neon-green hover:bg-emerald-500/20 transition-all cursor-pointer"
                    title="Change BAU Faculty or Semester"
                >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>BAU · {activeFaculty} · {activeCohort}</span>
                </Link>

                <div className="hidden lg:flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-700 dark:text-blue-400">
                        <Sparkles className="h-3 w-3 text-blue-500" />
                        Gemini 1.5 Flash
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-700 dark:text-purple-400">
                        <Mic className="h-3 w-3 text-purple-500" />
                        ElevenLabs
                    </span>
                </div>
            </div>

            {/* Right: theme toggle + auth actions */}
            <div className="flex items-center gap-2">
                <ThemeToggle />
                {displayUser ? (
                    <>
                        <NotificationHub />
                        <Link href="/academy/profile">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-800 dark:text-neon-green cursor-pointer hover:bg-emerald-500/20 transition-all overflow-hidden" title={displayUser.full_name || displayUser.email || "Profile"}>
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
                            <Button variant="ghost" className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg h-8 px-3">
                                LOG IN
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="text-xs font-mono font-bold bg-neon-green text-black hover:bg-neon-green/90 rounded-lg h-8 px-4 shadow-[0_0_12px_rgba(0,255,148,0.3)]">
                                ENTER OS
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
