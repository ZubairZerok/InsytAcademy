"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme] = useState<Theme>("light");

    useEffect(() => {
        const root = document.documentElement;
        root.classList.add("light");
        root.classList.remove("dark");
        localStorage.setItem("insyt-theme", "light");
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme: () => {} }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
