import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: "active" | "offline" | "warning";
    text?: string;
    className?: string;
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
    const variants = {
        active: "bg-neon-green/20 text-neon-green border-neon-green/50",
        offline: "bg-gray-500/20 text-gray-400 border-gray-500/50",
        warning: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    };

    const dotColors = {
        active: "bg-neon-green",
        offline: "bg-gray-500",
        warning: "bg-yellow-500",
    };

    const displayText = text || status.toUpperCase();

    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono font-medium uppercase tracking-wider",
                variants[status],
                className
            )}
        >
            <span className="relative flex h-2 w-2">
                <span
                    className={cn(
                        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                        dotColors[status]
                    )}
                ></span>
                <span
                    className={cn(
                        "relative inline-flex h-2 w-2 rounded-full",
                        dotColors[status]
                    )}
                ></span>
            </span>
            {displayText}
        </div>
    );
}
