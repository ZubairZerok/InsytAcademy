"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="sm"
                className={`h-9 w-9 rounded-xl p-0 transition-all duration-300 relative overflow-hidden ${className}`}
                aria-label="Toggle theme"
            >
                <div className="h-[18px] w-[18px]" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`h-9 w-9 rounded-xl p-0 hover:bg-white/[0.08] dark:hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden group ${className}`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out">
                {theme === "dark" ? (
                    <Sun className="h-[18px] w-[18px] text-neon-green rotate-0 scale-100 transition-all group-hover:rotate-45" />
                ) : (
                    <Moon className="h-[18px] w-[18px] text-gray-400 rotate-0 scale-100 transition-all group-hover:-rotate-12" />
                )}
            </div>
        </Button>
    );
}
