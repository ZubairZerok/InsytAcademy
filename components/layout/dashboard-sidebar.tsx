// components/layout/dashboard-sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu, X, LayoutDashboard, BookOpen,
    ChevronRight, ChevronLeft,
    Calendar, Mic, Microscope, Calculator, Network, Sparkles, LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationHub } from "@/components/academy/notification-hub";

interface SidebarItem {
    name: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
}

const sidebarItems: SidebarItem[] = [
    { name: "Academic OS", href: "/academy", icon: LayoutDashboard },
    { name: "My Courses", href: "/academy/courses", icon: BookOpen },
    { name: "BAU Schedule", href: "/academy/schedule", icon: Calendar, badge: "AI PDF" },
    { name: "AI Viva Room", href: "/academy/viva", icon: Mic, badge: "Voice" },
    { name: "Field / Lab AI", href: "/academy/field-lab", icon: Microscope, badge: "Vision" },
    { name: "Exam Lab", href: "/academy/assessment", icon: Calculator },
    { name: "Skill Graph", href: "/academy/skills", icon: Network },
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

    // Close mobile drawer on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const initials = (() => {
        if (!user) return "";
        if (user.full_name) {
            const parts = user.full_name.trim().split(/\s+/).filter(Boolean);
            if (parts.length > 0) return parts.map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
        }
        if (user.email) {
            return user.email[0].toUpperCase();
        }
        return "";
    })();

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="flex md:hidden items-center justify-between p-4 border-b border-black/[0.08] dark:border-white/[0.06] bg-white/95 dark:bg-agri-dark/95 backdrop-blur sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                        aria-label="Toggle Sidebar"
                    >
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <Link href="/academy" className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-neon-green" />
                        </div>
                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">INSYT.BAU</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <NotificationHub />
                    {user ? (
                        <Link href="/academy/profile">
                            <div className="h-7 w-7 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green cursor-pointer hover:bg-neon-green/20 transition-all overflow-hidden" title={user.full_name || user.email || "Profile"}>
                                {user.avatar_url && !avatarError ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.full_name || "Profile"}
                                        className="h-full w-full object-cover"
                                        onError={() => setAvatarError(true)}
                                    />
                                ) : (
                                    initials
                                )}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">LOG IN</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Backdrop for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Shell */}
            <aside
                className={cn(
                    "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-black/[0.08] dark:border-white/[0.06] bg-white/95 dark:bg-agri-dark/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:static shrink-0",
                    isCollapsed ? "w-20" : "w-64",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Brand / Logo Area */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-black/[0.08] dark:border-white/[0.06]">
                    <Link href="/academy" className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center w-full")}>
                        <div className="h-9 w-9 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green shadow-[0_0_12px_rgba(0,255,148,0.2)] shrink-0">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col animate-in fade-in duration-200">
                                <span className="font-mono text-sm font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                    INSYT<span className="text-emerald-700 dark:text-neon-green font-bold">.BAU</span>
                                </span>
                                <span className="text-[9px] font-mono text-gray-600 dark:text-gray-400 uppercase tracking-widest mt-0.5">
                                    Academic OS
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex h-6 w-6 items-center justify-center rounded-md border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                    </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-none">
                    {!isCollapsed && (
                        <div className="px-3 pb-2 text-[10px] font-mono font-bold text-gray-600 dark:text-gray-400 tracking-widest uppercase">
                            Academic Intelligence
                        </div>
                    )}

                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href !== "/academy" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-emerald-100 text-emerald-900 font-bold dark:bg-neon-green dark:text-black dark:font-bold dark:shadow-[0_0_15px_rgba(0,255,148,0.35)]"
                                            : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.04]",
                                        isCollapsed && "justify-center px-0"
                                    )}
                                    title={isCollapsed ? item.name : undefined}
                                >
                                    <Icon className={cn(
                                        "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                                        isActive ? "text-emerald-900 dark:text-black font-bold" : "text-gray-600 dark:text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-neon-green"
                                    )} />
                                    {!isCollapsed && (
                                        <span className="animate-in fade-in duration-200 flex-1 truncate">{item.name}</span>
                                    )}
                                    {!isCollapsed && item.badge && (
                                        <span className={cn(
                                            "text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                                            isActive
                                                ? "bg-black/20 text-black"
                                                : "bg-emerald-500/10 text-emerald-800 dark:text-neon-green border border-emerald-500/20"
                                        )}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Auth CTA */}
                    <div className="border-t border-black/[0.08] dark:border-white/[0.06] p-3 mt-4">
                        {user ? (
                            <Link href="/academy/profile">
                                <div className={cn(
                                    "flex items-center gap-3 p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/5 hover:border-neon-green/30 transition-all cursor-pointer",
                                    isCollapsed && "justify-center p-1"
                                )}>
                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-800 dark:text-neon-green shrink-0 overflow-hidden">
                                        {user.avatar_url && !avatarError ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.full_name || "Profile"}
                                                className="h-full w-full object-cover"
                                                onError={() => setAvatarError(true)}
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    {!isCollapsed && (
                                        <div className="flex-1 overflow-hidden">
                                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate font-sans">
                                                {user.full_name || "Student"}
                                            </div>
                                            <div className="text-[10px] text-gray-600 dark:text-gray-400 truncate font-mono">
                                                {user.email}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <div className={cn("space-y-2", isCollapsed && "hidden")}>
                                <Link href="/login" className="block">
                                    <button className="w-full py-2 px-3 rounded-lg border border-black/10 dark:border-white/10 font-mono text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                        LOG IN
                                    </button>
                                </Link>
                                <Link href="/signup" className="block">
                                    <button className="w-full py-2 px-3 rounded-lg bg-neon-green text-black font-mono text-xs font-bold hover:bg-neon-green/90 shadow-[0_0_12px_rgba(0,255,148,0.25)] transition-all">
                                        ENTER OS
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
