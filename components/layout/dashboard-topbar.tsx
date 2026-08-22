// components/layout/dashboard-topbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { LogOut, User, ChevronRight, Sparkles, GraduationCap, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { NotificationHub } from "@/components/academy/notification-hub";

const navLinks = [
    { label: "Dashboard", href: "/academy" },
    { label: "Courses", href: "/academy/courses" },
    { label: "Schedule", href: "/academy/schedule" },
    { label: "AI Viva", href: "/academy/viva" },
    { label: "Field AI", href: "/academy/field-lab" },
    { label: "Exam Lab", href: "/academy/assessment" },
    { label: "Skill Graph", href: "/academy/skills" },
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
    }, [supabase, userProp]);

    const displayFullName = userProp?.full_name || (stateUser?.user_metadata?.full_name as string) || "";
    const displayEmail = userProp?.email || stateUser?.email || "";
    const displayAvatar = userProp?.avatar_url || (stateUser?.user_metadata?.avatar_url as string) || "";
    const hasUser = Boolean(userProp || stateUser);

    const initials = (() => {
        if (displayFullName) {
            const parts = displayFullName.trim().split(/\s+/).filter(Boolean);
            if (parts.length > 0) return parts.map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
        }
        if (displayEmail) {
            return displayEmail[0].toUpperCase();
        }
        return "";
    })();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    // Breadcrumb generator
    const currentBreadcrumb = (() => {
        if (pathname === "/academy") return "Command Center";
        if (pathname.startsWith("/academy/courses")) return "Course Catalog & Syllabus";
        if (pathname.startsWith("/academy/schedule")) return "Schedule & Routine Intelligence";
        if (pathname.startsWith("/academy/viva")) return "Spoken AI Viva Room";
        if (pathname.startsWith("/academy/field-lab")) return "Field & Specimen AI";
        if (pathname.startsWith("/academy/assessment")) return "10/20/70 Ordinance Exam Lab";
        if (pathname.startsWith("/academy/skills")) return "Prerequisite & Skill Graph";
        if (pathname.startsWith("/academy/profile")) return "Student Profile";
        return "Academic OS";
    })();

    return (
        <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-black/[0.08] dark:border-white/[0.06] bg-white/95 dark:bg-agri-dark/95 backdrop-blur-xl sticky top-0 z-30">
            {/* Left: Breadcrumbs & Active Institutional Cohort */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-gray-900 dark:text-white">INSYT.BAU</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-emerald-700 dark:text-neon-green font-semibold uppercase">{currentBreadcrumb}</span>
                </div>

                <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

                {/* Institutional Student Cohort Indicator */}
                <Link href="/onboarding" className="group">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/5 hover:border-emerald-500/40 transition-all">
                        <GraduationCap className="h-3.5 w-3.5 text-emerald-600 dark:text-neon-green group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-mono text-gray-700 dark:text-gray-300">
                            BAU &middot; <strong className="text-gray-900 dark:text-white">{activeFaculty}</strong> &middot; {activeCohort}
                        </span>
                    </div>
                </Link>

                {/* Live Model Indicators */}
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

            {/* Right: Auth actions */}
            <div className="flex items-center gap-2">
                {hasUser ? (
                    <>
                        <NotificationHub />
                        <Link href="/academy/profile">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-800 dark:text-neon-green cursor-pointer hover:bg-emerald-500/20 transition-all overflow-hidden" title={displayFullName || displayEmail || "Profile"}>
                                {displayAvatar && !avatarError ? (
                                    <img
                                        src={displayAvatar}
                                        alt={displayFullName || "Profile"}
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
        </header>
    );
}
