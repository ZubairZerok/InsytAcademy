import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";

export default function Loading() {
    return (
        <div className="space-y-8">
            <SectionHeading title="Protocol Training" subtitle="LOADING DATA..." />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <GlassCard key={i} className="h-[320px] p-0 overflow-hidden">
                        <div className="h-48 w-full bg-cyber-gray/10 animate-pulse" />
                        <div className="p-6 space-y-4">
                            <div className="h-6 w-3/4 bg-cyber-gray/20 rounded animate-pulse" />
                            <div className="h-4 w-full bg-cyber-gray/10 rounded animate-pulse" />
                            <div className="h-8 w-1/3 mt-4 bg-cyber-gray/10 rounded animate-pulse" />
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
