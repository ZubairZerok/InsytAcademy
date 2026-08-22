-- ═══════════════════════════════════════════════════════════════
-- INSYT ACADEMY: Phase 6 — Durable analytics event log
-- Backs lib/queue.ts (replaces the previous no-op console.log dispatcher).
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payload    JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time
  ON public.analytics_events (event_type, created_at DESC);

-- Written only by the service role (server-side). No client access.
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
-- (No policies = no anon/auth access; service role bypasses RLS.)
