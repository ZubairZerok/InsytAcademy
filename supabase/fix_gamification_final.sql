-- =============================================================================
-- INSYT ACADEMY — FINAL GAMIFICATION FIX
-- Run this in Supabase SQL Editor (single new tab, run all at once).
-- Fixes: missing unique constraint on xp_events, broken award_xp function
--        (never updated profiles.total_xp), missing quizzes published flag.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ADD UNIQUE CONSTRAINT on xp_events so award_xp idempotency works
-- ─────────────────────────────────────────────────────────────────────────────
-- Drop first in case a partial constraint exists
ALTER TABLE public.xp_events DROP CONSTRAINT IF EXISTS xp_events_dedup;

-- Add the unique constraint the award_xp function depends on
ALTER TABLE public.xp_events
  ADD CONSTRAINT xp_events_dedup UNIQUE (user_id, event_type, source_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. REPLACE award_xp — version that ACTUALLY updates profiles.total_xp
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id   UUID,
  p_event     TEXT,
  p_source_id TEXT,
  p_xp        INTEGER,
  p_meta      JSONB DEFAULT '{}'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_xp  INTEGER;
  v_new_lvl INTEGER;
BEGIN
  -- 1. Guard: profile must exist
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
    RETURN json_build_object('success', false, 'reason', 'profile_not_found');
  END IF;

  -- 2. Idempotency: try to insert into xp_events; bail on duplicate
  BEGIN
    INSERT INTO public.xp_events (user_id, event_type, source_id, xp_awarded, metadata)
    VALUES (p_user_id, p_event, p_source_id, p_xp, COALESCE(p_meta, '{}'));
  EXCEPTION WHEN unique_violation THEN
    SELECT total_xp, level INTO v_new_xp, v_new_lvl
    FROM public.profiles WHERE id = p_user_id;
    RETURN json_build_object(
      'success',      false,
      'reason',       'already_claimed',
      'new_total_xp', v_new_xp,
      'new_level',    v_new_lvl,
      'leveled_up',   false
    );
  END;

  -- 3. Atomically add XP to profiles.total_xp
  UPDATE public.profiles
  SET total_xp = COALESCE(total_xp, 0) + p_xp
  WHERE id = p_user_id
  RETURNING total_xp INTO v_new_xp;

  -- 4. Recalculate level using the SQRT formula
  --    level = FLOOR(SQRT(total_xp / 100)) + 1, capped at 50
  v_new_lvl := LEAST(50, FLOOR(SQRT(v_new_xp::float / 100.0))::integer + 1);

  UPDATE public.profiles
  SET level = v_new_lvl
  WHERE id = p_user_id;

  RETURN json_build_object(
    'success',      true,
    'new_total_xp', v_new_xp,
    'new_level',    v_new_lvl,
    'leveled_up',   false,
    'xp_awarded',   p_xp
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. REPLACE update_streak — works without external award_xp dependency issues
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_date DATE;
  v_streak    INTEGER;
  v_today     DATE := CURRENT_DATE;
BEGIN
  SELECT last_active_date, streak_count
  INTO v_last_date, v_streak
  FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  IF v_last_date = v_today THEN
    RETURN json_build_object(
      'streak', v_streak, 'xp_earned', 0,
      'already_updated', true, 'streak_bonus', false
    );
  END IF;

  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSE
    v_streak := 1;
  END IF;

  UPDATE public.profiles
  SET last_active_date = v_today,
      streak_count     = v_streak,
      longest_streak   = GREATEST(COALESCE(longest_streak, 0), v_streak)
  WHERE id = p_user_id;

  RETURN json_build_object(
    'streak',         v_streak,
    'xp_earned',      5,
    'streak_bonus',   (v_streak % 7 = 0),
    'already_updated', false
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. PUBLISH all courses and quizzes so the frontend shows them
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE public.courses  SET is_published = TRUE;
UPDATE public.quizzes  SET is_published = TRUE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. GRANT execute permissions so anon/authenticated can call RPCs
-- ─────────────────────────────────────────────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.award_xp(UUID, TEXT, TEXT, INTEGER, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_xp(UUID, TEXT, TEXT, INTEGER, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_streak(UUID) TO service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. QUICK SANITY CHECK — run this to verify the function works
--    (replace the UUID below with your actual user ID from Supabase Auth)
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT public.award_xp(
--   'YOUR-USER-UUID-HERE'::uuid,
--   'test_event',
--   'test_source_1',
--   10,
--   '{}'::jsonb
-- );
-- Then verify: SELECT id, total_xp, level FROM public.profiles WHERE id = 'YOUR-USER-UUID-HERE';

SELECT 'Fix applied successfully. Courses published: ' || COUNT(*) || ' courses, ' ||
       (SELECT COUNT(*) FROM public.quizzes) || ' quizzes.' AS status
FROM public.courses WHERE is_published = TRUE;
