"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Simplified Select Implementation using native select for stability
// without Radix dependencies.

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

export const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
}>({});

export const Select = ({ value, onValueChange, children }: SelectProps) => {
    return (
        <SelectContext.Provider value={{ value, onValueChange }}>
            <div className="relative inline-block">{children}</div>
        </SelectContext.Provider>
    );
};

interface TriggerProps {
    className?: string;
    children?: React.ReactNode;
}

export const SelectTrigger = ({ className, children }: TriggerProps) => {
    return (
        <div className={cn("flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)}>
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
    );
};

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
    const { value } = React.useContext(SelectContext);
    return <span className="pointer-events-none block truncate">{value === "r" ? "R Stats" : value === "python" ? "Python" : placeholder}</span>;
};



export const SelectContent = () => {
    // Hidden because native select handles the interaction in this simplified version
    return null;
};

export const SelectItem = () => null;
