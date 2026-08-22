import type { ReactNode } from "react";
import { isFeatureEnabled, type FeatureFlag } from "@/lib/feature-flags";
import { ComingSoon } from "@/components/ui/coming-soon";

interface FeatureGateProps {
  flag: FeatureFlag;
  children: ReactNode;
  /** Custom fallback; defaults to a ComingSoon placeholder. */
  fallback?: ReactNode;
  title?: string;
  description?: string;
}

// Server component: renders children only when the flag is enabled; otherwise a
// "Coming Soon" placeholder. Works at page level (route interception) and inline.
export function FeatureGate({ flag, children, fallback, title, description }: FeatureGateProps) {
  if (isFeatureEnabled(flag)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  return (
    <ComingSoon
      title={title ?? "This feature is on the way"}
      description={description ?? "We're still building this. Check back soon."}
    />
  );
}
