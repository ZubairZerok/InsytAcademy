// lib/feature-flags.ts
// Central registry for incomplete/experimental features. A disabled flag makes
// the UI render a "Coming Soon" placeholder instead of fake/mock content.
//
// Defaults below can be overridden via the FEATURE_FLAGS env var (JSON), e.g.
//   FEATURE_FLAGS={"skillTree":true}
// Swappable later for a remote config (Supabase/LaunchDarkly) behind this API.

export type FeatureFlag =
  | "skillTree"
  | "systemHealth"
  | "researchAnalytics"
  | "advancedAnalytics";

const DEFAULTS: Record<FeatureFlag, boolean> = {
  skillTree: false,
  systemHealth: false,
  researchAnalytics: false,
  advancedAnalytics: false,
};

let cache: Record<string, boolean> | null = null;

function load(): Record<string, boolean> {
  if (cache) return cache;
  let overrides: Record<string, boolean> = {};
  try {
    if (process.env.FEATURE_FLAGS) {
      overrides = JSON.parse(process.env.FEATURE_FLAGS);
    }
  } catch {
    // Ignore malformed env; fall back to defaults.
  }
  cache = { ...DEFAULTS, ...overrides };
  return cache;
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return load()[flag] ?? false;
}
