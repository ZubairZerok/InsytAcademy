import { GlassCard } from "@/components/ui/glass-card";
export default function ProfileLoading() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-pulse">
      {/* Page Title skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-white/5 border border-white/10 rounded font-mono" />
        <div className="h-8 w-64 bg-white/10 rounded" />
      </div>

      {/* Identity grids skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side avatar card skeleton */}
        <GlassCard className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 mb-4 flex-shrink-0 skeleton" />
          <div className="h-6 w-36 bg-white/10 rounded mb-2 skeleton" />
          <div className="h-4 w-48 bg-white/5 rounded mb-4 skeleton" />
          <div className="h-6 w-20 bg-white/5 border border-white/10 rounded-full skeleton" />
        </GlassCard>

        {/* Right Side details skeleton */}
        <GlassCard className="lg:col-span-2 p-8 relative overflow-hidden">
          <div className="h-6 w-48 bg-white/10 rounded mb-6 skeleton" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-white/5 rounded skeleton" />
              <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl skeleton" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/5 rounded skeleton" />
              <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl skeleton" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <div className="h-10 w-32 bg-white/10 rounded-xl skeleton" />
          </div>
        </GlassCard>
      </div>

      {/* Syllabuses skeleton */}
      <GlassCard className="p-8">
        <div className="h-6 w-48 bg-white/10 rounded mb-6 skeleton" />
        <div className="overflow-x-auto">
          <div className="w-full h-32 bg-white/5 border border-white/10 rounded-xl skeleton" />
        </div>
      </GlassCard>

      {/* Payment & Billing skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-8">
          <div className="h-6 w-48 bg-white/10 rounded mb-6 skeleton" />
          <div className="space-y-4">
            <div className="h-16 w-full bg-white/5 border border-white/10 rounded-xl skeleton" />
            <div className="h-16 w-full bg-white/5 border border-white/10 rounded-xl skeleton" />
          </div>
        </GlassCard>
        <GlassCard className="p-8">
          <div className="h-6 w-48 bg-white/10 rounded mb-6 skeleton" />
          <div className="space-y-4">
            <div className="h-16 w-full bg-white/5 border border-white/10 rounded-xl skeleton" />
            <div className="h-16 w-full bg-white/5 border border-white/10 rounded-xl skeleton" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
