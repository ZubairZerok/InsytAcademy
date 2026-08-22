"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Search, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user || null);
        };
        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    // Track scroll for glass effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/academy?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                scrolled
                    ? "border-b border-white/[0.06] bg-agri-black/80 backdrop-blur-xl shadow-glass"
                    : "border-b border-transparent bg-transparent"
            )}
        >
            <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-6">
                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                    <span className="font-mono text-xl font-bold tracking-tighter text-white">
                        INSYT<span className="text-neon-green">.</span>
                    </span>
                </Link>

                {/* Nav Links - Desktop */}
                <nav className="hidden md:flex items-center gap-1 ml-6">
                    <Link href="/academy/courses">
                        <Button variant="ghost" className="text-sm font-normal text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-lg">
                            Courses
                        </Button>
                    </Link>
                    <Link href="/research">
                        <Button variant="ghost" className="text-sm font-normal text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-lg">
                            Research
                        </Button>
                    </Link>
                </nav>

                {/* Search Bar */}
                {pathname !== "/" && (
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-neon-green/60 transition-colors" />
                            <Input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses, topics, instructors..."
                                className="w-full rounded-xl border-white/[0.06] bg-white/[0.03] pl-10 pr-4 h-10 text-white placeholder-gray-600 focus:border-neon-green/30 focus:bg-white/[0.05] transition-all"
                            />
                        </div>
                    </form>
                )}

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3 ml-auto">
                    <ThemeToggle />
                    {user ? (
                        <>
                            <Link href="/academy">
                                <Button variant="ghost" className="text-sm text-gray-400 hover:text-white rounded-lg">
                                    My Learning
                                </Button>
                            </Link>
                            {/* Avatar */}
                            <Link href="/academy/profile">
                                <div className="h-8 w-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green cursor-pointer hover:bg-neon-green/20 transition-all" title={user.email || "Profile"}>
                                    {user.email ? user.email[0].toUpperCase() : <User className="h-4 w-4" />}
                                </div>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-alert-red rounded-lg h-8 w-8" title="Log Out">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <Link href="/academy">
                            <Button className="text-sm font-bold bg-neon-green text-black hover:bg-neon-green/90 rounded-xl h-9 px-5 shadow-[0_0_15px_rgba(0,255,148,0.25)] transition-all">
                                ENTER ACADEMIC OS
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-black/[0.08] dark:border-white/[0.06] bg-white/95 dark:bg-agri-dark/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 space-y-3">
                        <div className="space-y-1 pt-2">
                            <Link href="/academy/courses" className="block px-3 py-2.5 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/[0.04]" onClick={() => setIsOpen(false)}>Courses</Link>
                            <Link href="/academy/viva" className="block px-3 py-2.5 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/[0.04]" onClick={() => setIsOpen(false)}>AI Viva Room</Link>
                            <Link href="/academy/schedule" className="block px-3 py-2.5 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/[0.04]" onClick={() => setIsOpen(false)}>BAU Schedule</Link>
                        </div>
                        <div className="border-t border-black/[0.08] dark:border-white/[0.06] pt-3">
                            <Link href="/academy" className="block">
                                <Button className="w-full bg-neon-green text-black font-mono font-bold rounded-lg" onClick={() => setIsOpen(false)}>
                                    ENTER ACADEMIC OS
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
