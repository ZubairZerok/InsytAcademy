import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
    return (
        <div className={cn("flex flex-col gap-2 mb-8", className)}>
            {subtitle && (
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neon-green">
                        {subtitle}
                    </span>
                </div>
            )}
            <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: 'var(--text-primary)' }}>
                    {title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-neon-green/40 via-blue-500/30 to-purple-500/10" />
            </div>
        </div>
    );
}
