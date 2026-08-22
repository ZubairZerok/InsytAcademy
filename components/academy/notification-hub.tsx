"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Bell, BookOpen, Trophy, MessageSquare, Microscope, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    NotificationItem,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    syncSystemNotifications
} from "@/actions/notifications";

export function NotificationHub() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hasSyncedRef = useRef(false);

    const loadNotifications = useCallback(async () => {
        // Sync new courses/research only ONCE per session, not every poll
        if (!hasSyncedRef.current) {
            await syncSystemNotifications();
            hasSyncedRef.current = true;
        }
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
    }, []);

    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every 60s (read-only check, no sync)
        const interval = setInterval(async () => {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }, 60000);
        return () => clearInterval(interval);
    }, [loadNotifications]);

    // Close when clicking outside or pressing Escape
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead();
        // Optimistic UI update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const handleItemClick = async (notif: NotificationItem) => {
        if (!notif.is_read) {
            // Optimistic UI update to ensure instant feedback
            setNotifications(prev =>
                prev.map(n => (n.id === notif.id ? { ...n, is_read: true } : n))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            // Trigger DB update asynchronously without blocking navigation
            markNotificationAsRead(notif.id).catch(console.error);
        }
        setIsOpen(false);
        if (notif.link) {
            router.push(notif.link);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "course":
                return <BookOpen className="h-4 w-4 text-emerald-600 dark:text-neon-green" />;
            case "leaderboard":
                return <Trophy className="h-4 w-4 text-amber-500" />;
            case "social":
                return <MessageSquare className="h-4 w-4 text-sky-500" />;
            case "research":
                return <Microscope className="h-4 w-4 text-indigo-500" />;
            default:
                return <Bell className="h-4 w-4 text-slate-500" />;
        }
    };

    const formatRelativeTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMin = Math.round(diffMs / 60000);
            const diffHr = Math.round(diffMs / 3600000);

            if (diffMin < 1) return "just now";
            if (diffMin < 60) return `${diffMin}m ago`;
            if (diffHr < 24) return `${diffHr}h ago`;
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch {
            return "recently";
        }
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg bg-slate-200 dark:bg-black border border-slate-350 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-white/5 transition-all outline-none"
                aria-label="Toggle notifications"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-neon-green" />
                )}
            </button>

            {/* Dropdown Container */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-slate-400 dark:border-white/20 bg-white dark:bg-black shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150" role="dialog" aria-label="Notifications">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-black border-b border-slate-400 dark:border-white/15">
                        <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                            NOTIFICATIONS ({unreadCount})
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-neon-green hover:underline uppercase"
                            >
                                <CheckCircle2 className="h-3 w-3" />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-300 dark:divide-white/10 bg-white dark:bg-black">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-xs font-mono text-slate-500 dark:text-white/40">
                                NO NOTIFICATIONS AVAILABLE.
                                <br />
                                YOU ARE ALL UP TO DATE!
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleItemClick(notif)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleItemClick(notif);
                                        }
                                    }}
                                    className={`w-full text-left flex gap-3 p-3.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-green/50 ${
                                        notif.is_read
                                            ? "bg-white dark:bg-black opacity-70 hover:opacity-100"
                                            : "bg-slate-50 dark:bg-neon-green/5 hover:bg-slate-100 dark:hover:bg-neon-green/10"
                                    }`}
                                    role="button"
                                    aria-label={`Notification: ${notif.title}. ${notif.message}`}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-black border border-slate-300 dark:border-white/10 flex items-center justify-center">
                                            {getIcon(notif.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                {notif.title}
                                            </h4>
                                            <span className="text-[9px] font-mono text-slate-500 dark:text-white/40 shrink-0">
                                                {formatRelativeTime(notif.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed mt-1 break-words font-sans">
                                            {notif.message}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
