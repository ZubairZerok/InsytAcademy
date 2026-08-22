"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu, X, LayoutDashboard, BookOpen, Settings, Terminal,
    Award, TrendingUp, ChevronRight, ChevronLeft, Trophy, Swords, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationHub } from "@/components/academy/notification-hub";

const sidebarItems = [
    { name: "Dashboard", href: "/academy", icon: LayoutDashboard },
    { name: "Courses", href: "/academy/courses", icon: BookOpen },
    { name: "Code Lab", href: "/academy/simulator", icon: Terminal },
    { name: "Arena", href: "/academy/arena", icon: Swords },
    { name: "Opportunities", href: "/opportunities", icon: Briefcase },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Certificates", href: "/academy/certificates", icon: Award },
    { name: "Settings", href: "/academy/settings", icon: Settings },
];

interface DashboardSidebarProps {
    user?: {
        email?: string;
        full_name?: string;
        avatar_url?: string;
    } | null;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const pathname = usePathname();

    // Dynamically manage main layout padding
    useEffect(() => {
        if (isCollapsed) {
            document.documentElement.classList.add("sidebar-collapsed");
        } else {
            document.documentElement.classList.remove("sidebar-collapsed");
        }
        return () => {
            document.documentElement.classList.remove("sidebar-collapsed");
        };
    }, [isCollapsed]);

    // Body scroll lock for mobile menu
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    // Get initials for avatar fallback
    const initials = (() => {
        if (!user) return "G";
        const name = user.full_name || user.email || "Learner";
        const parts = name.trim().split(/\s+/).filter(Boolean);
        return parts.map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "L";
    })();

    return (
        <>
            {/* Mobile Topbar */}
            <div className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-black/[0.08] bg-white/95 backdrop-blur-xl px-4 md:hidden dark:border-white/[0.06] dark:bg-agri-dark/90">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold tracking-tighter">
                        INSYT<span className="text-neon-green">.</span>OS
                    </span>
                </Link>
                <div className="flex items-center gap-3">
                    <NotificationHub />
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-400 hover:text-gray-900 transition-colors p-1 dark:text-gray-400 dark:hover:text-white"
                        aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
                        aria-expanded={isSidebarOpen}
                    >
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 transform border-r bg-white/98 backdrop-blur-xl transition-all duration-300 ease-out md:translate-x-0 border-black/[0.08] dark:border-white/[0.06] dark:bg-agri-dark/95",
                    isCollapsed ? "md:w-20" : "md:w-64",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "pt-14 md:pt-0 w-64"
                )}
            >
                {/* Collapse / Expand Toggle Handle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3.5 top-20 h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all z-50 dark:border-white/20 dark:bg-agri-dark dark:text-gray-400 dark:hover:text-white dark:hover:border-white/30"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed
                        ? <ChevronRight className="h-3.5 w-3.5" />
                        : <ChevronLeft className="h-3.5 w-3.5" />
                    }
                </button>

                <div className="flex h-full flex-col relative">
                    {/* Logo — Desktop */}
                    <div className={cn(
                        "hidden h-16 items-center border-b border-black/[0.06] md:flex transition-all dark:border-white/[0.06]",
                        isCollapsed ? "px-5 justify-center" : "px-6"
                    )}>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-4 w-4 text-neon-green" />
                            </div>
                            {!isCollapsed && (
                                <span className="font-mono text-lg font-bold tracking-tighter animate-in fade-in duration-200">
                                    INSYT<span className="text-neon-green">.</span>OS
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-3 pt-4">
                        {!isCollapsed ? (
                            <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-gray-400 animate-in fade-in">
                                Navigation
                            </p>
                        ) : (
                            <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-4 mx-2" />
                        )}
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href ||
                                (item.href !== "/academy" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                                        isCollapsed ? "justify-center px-0" : "px-3",
                                        isActive
                                            ? "bg-emerald-100 text-emerald-900 font-bold dark:bg-neon-green dark:text-black dark:font-bold dark:shadow-[0_0_15px_rgba(0,255,148,0.25)]"
                                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.04] dark:hover:text-gray-200"
                                    )}
                                    title={isCollapsed ? item.name : undefined}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-emerald-600 dark:bg-black" />
                                    )}
                                    <Icon className={cn(
                                        "h-[18px] w-[18px] transition-colors flex-shrink-0",
                                        isActive
                                            ? "text-emerald-900 dark:text-black"
                                            : "text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200"
                                    )} />
                                    {!isCollapsed && (
                                        <span className="animate-in fade-in duration-200">{item.name}</span>
                                    )}
                                    {isActive && !isCollapsed && (
                                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-emerald-700 dark:text-black/70" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Auth CTA */}
                    <div className="border-t border-black/[0.08] dark:border-white/[0.06] p-3">
                        {user ? (
                            <Link
                                href="/academy/profile"
                                className={cn(
                                    "flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] p-3 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.06] group",
                                    isCollapsed ? "justify-center" : ""
                                )}
                            >
                                <div className="h-9 w-9 min-w-[2.25rem] rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-neon-green overflow-hidden flex-shrink-0">
                                    {user.avatar_url && !avatarError ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.full_name || "User avatar"}
                                            className="h-full w-full object-cover"
                                            onError={() => setAvatarError(true)}
                                        />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                {/* Info */}
                                {!isCollapsed && (
                                    <>
                                        <div className="flex-1 min-w-0 animate-in fade-in duration-200">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-neon-green transition-colors">
                                                {user.full_name || "Learner"}
                                            </p>
                                            <p className="truncate text-[11px] text-gray-400 dark:text-gray-400 font-mono">
                                                {user.email}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700 group-hover:text-gray-400 dark:group-hover:text-gray-400 transition-colors flex-shrink-0" />
                                    </>
                                )}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className={cn(
                                    "flex items-center gap-3 rounded-xl bg-neon-green/10 border border-neon-green/30 p-3 text-neon-green transition-all hover:bg-neon-green/20 font-mono text-xs font-bold",
                                    isCollapsed ? "justify-center px-0" : ""
                                )}
                            >
                                <div className="h-8 w-8 rounded-lg bg-neon-green text-black flex items-center justify-center font-bold shrink-0">
                                    →
                                </div>
                                {!isCollapsed && <span>LOG IN TO ACADEMY</span>}
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
}
