"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // The pre-paint script in <head> has already applied the class. Read it
        // back so React state matches what's on screen (no second flash).
        setMounted(true);
        const applied = document.documentElement.classList.contains("light") ? "light" : "dark";
        setTheme(applied);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        
        const root = document.documentElement;
        if (theme === "light") {
            root.classList.add("light");
            root.classList.remove("dark");
            localStorage.setItem("insyt-theme", "light");
        } else {
            root.classList.add("dark");
            root.classList.remove("light");
            localStorage.setItem("insyt-theme", "dark");
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
