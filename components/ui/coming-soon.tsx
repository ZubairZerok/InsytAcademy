import { Lock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface ComingSoonProps {
  title: string;
  description?: string;
  estimatedDate?: string;
  className?: string;
}

// Reusable placeholder that masks an unfinished module without shipping fake
// data. Accessible (labelled region), reduced-motion safe (no infinite anim).
export function ComingSoon({ title, description, estimatedDate, className }: ComingSoonProps) {
  return (
    <GlassCard
      role="region"
      aria-label={`${title} — coming soon`}
      className={`p-10 text-center flex flex-col items-center gap-4 border-neon-green/15 ${className ?? ""}`}
    >
      <div className="h-14 w-14 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
        <Lock className="h-6 w-6 text-neon-green" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-green/70">
          Coming Soon
        </p>
        {description && (
          <p className="text-sm text-gray-400 leading-relaxed pt-1">{description}</p>
        )}
        {estimatedDate && (
          <p className="text-xs text-gray-400 pt-1">Expected: {estimatedDate}</p>
        )}
      </div>
    </GlassCard>
  );
}
