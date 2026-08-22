import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, children, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-agri-dark/60 backdrop-blur-xl transition-all duration-300 hover:border-neon-green/40 hover:shadow-[0_0_25px_rgba(0,255,148,0.12)] hover:-translate-y-0.5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
