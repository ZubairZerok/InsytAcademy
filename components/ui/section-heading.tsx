import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    badge?: string;
    description?: string;
    className?: string;
}

export function SectionHeading({ title, subtitle, badge, description, className }: SectionHeadingProps) {
    const label = badge || subtitle;
    return (
        <div className={cn("flex flex-col gap-2 mb-8", className)}>
            {label && (
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-neon-green">
                        {label}
                    </span>
                </div>
            )}
            <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/40 via-blue-500/30 to-purple-500/10" />
            </div>
            {description && (
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
