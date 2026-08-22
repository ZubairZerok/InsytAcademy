"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
    icon?: React.ElementType;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, icon: Icon, children, ...props }, ref) => {
        const variants = {
            primary: "bg-neon-green text-agri-black hover:bg-neon-green/90 border border-transparent",
            outline: "bg-transparent text-neon-green border border-neon-green hover:bg-neon-green/10",
            ghost: "bg-transparent text-gray-400 hover:text-neon-green hover:bg-neon-green/10",
        };

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-12 rounded-md px-8",
            icon: "h-10 w-10",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-sm text-sm font-bold font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-green disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && Icon && <Icon className="mr-2 h-4 w-4" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
