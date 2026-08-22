-- =============================================================================
-- INSYT ACADEMY — BADGE ENGINE & STREAK PROTECTION SCHEMA
-- Paste and run in Supabase SQL Editor. Safe to re-run multiple times.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Profile Additions: Streak Freezes
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'streak_freezes_available'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN streak_freezes_available INTEGER NOT NULL DEFAULT 1;
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Badges Catalog Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.badges (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'learning', -- 'learning' | 'streak' | 'arena' | 'xp' | 'special'
  icon         TEXT NOT NULL DEFAULT '🏅',
  rarity       TEXT NOT NULL DEFAULT 'common',   -- 'common' | 'rare' | 'epic' | 'legendary'
  xp_bonus     INTEGER NOT NULL DEFAULT 0,
  secret       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Initial Badges Catalog
INSERT INTO public.badges (id, slug, name, description, category, icon, rarity, xp_bonus)
VALUES
  ('first_lesson', 'first-lesson', 'First Steps', 'Completed your very first lesson in Insyt Academy.', 'learning', '🌱', 'common', 25),
  ('quiz_whiz', 'quiz-whiz', 'Quiz Whiz', 'Passed 5 quiz challenges with high accuracy.', 'learning', '🎯', 'rare', 50),
  ('arena_gladiator', 'arena-gladiator', 'Arena Gladiator', 'Successfully solved 3 competitive problems in the Arena.', 'arena', '⚔️', 'rare', 100),
  ('streak_3', 'streak-3', 'Ignition', 'Maintained a 3-day learning streak.', 'streak', '⚡', 'common', 25),
  ('streak_7', 'streak-7', 'Flame Keeper', 'Maintained a 7-day continuous learning streak.', 'streak', '🔥', 'rare', 100),
  ('streak_30', 'streak-30', 'Inferno Master', 'Achieved an unstoppable 30-day streak.', 'streak', '🌋', 'legendary', 500),
  ('xp_1k', 'xp-1k', 'XP Titan', 'Accumulated 1,000 Total XP.', 'xp', '⚡', 'common', 150),
  ('xp_10k', 'xp-10k', 'XP Overlord', 'Accumulated 10,000 Total XP.', 'xp', '👑', 'epic', 500),
  ('course_graduate', 'course-graduate', 'Course Graduate', 'Completed 100% of an entire curriculum course.', 'learning', '🎓', 'epic', 300)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  rarity = EXCLUDED.rarity,
  xp_bonus = EXCLUDED.xp_bonus;

-- ---------------------------------------------------------------------------
-- 3. User Unlocked Badges Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_badges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id     TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta         JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);

-- ---------------------------------------------------------------------------
-- 4. Streak Logs Audit Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.streak_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  action_type    TEXT NOT NULL DEFAULT 'daily_active', -- 'daily_active' | 'freeze_consumed' | 'reset'
  streak_count   INTEGER NOT NULL DEFAULT 1,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_streak_logs_user_date ON public.streak_logs(user_id, log_date DESC);

-- ---------------------------------------------------------------------------
-- 5. RLS Policies
-- ---------------------------------------------------------------------------
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "badges_read_all" ON public.badges;
CREATE POLICY "badges_read_all" ON public.badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "user_badges_read_own" ON public.user_badges;
CREATE POLICY "user_badges_read_own" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "streak_logs_read_own" ON public.streak_logs;
CREATE POLICY "streak_logs_read_own" ON public.streak_logs FOR SELECT USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 6. Stored Procedure: update_streak (With Streak Freeze Protection)
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.update_streak(UUID);

CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_date  DATE;
  v_today      DATE := CURRENT_DATE;
  v_streak     INTEGER;
  v_freezes    INTEGER;
  v_consumed   BOOLEAN := FALSE;
BEGIN
  SELECT last_active_date, streak_count, streak_freezes_available
  INTO v_last_date, v_streak, v_freezes
  FROM public.profiles
  WHERE id = p_user_id;

  v_streak  := COALESCE(v_streak, 0);
  v_freezes := COALESCE(v_freezes, 1);

  -- Case A: Already active today
  IF v_last_date = v_today THEN
    RETURN json_build_object(
      'streak', v_streak,
      'xp_earned', 0,
      'already_updated', true,
      'freeze_consumed', false,
      'streak_bonus', false
    );
  END IF;

  -- Case B: Consecutive day (yesterday)
  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_streak := v_streak + 1;

  -- Case C: Missed exactly 1 day, BUT has Streak Freeze available!
  ELSIF v_last_date = v_today - INTERVAL '2 days' AND v_freezes > 0 THEN
    v_freezes  := v_freezes - 1;
    v_streak   := v_streak + 1;
    v_consumed := TRUE;

    -- Log freeze consumption
    INSERT INTO public.streak_logs (user_id, log_date, action_type, streak_count)
    VALUES (p_user_id, v_today - INTERVAL '1 day', 'freeze_consumed', v_streak - 1)
    ON CONFLICT DO NOTHING;

  -- Case D: Streak broken -> Reset to 1
  ELSE
    v_streak := 1;
  END IF;

  -- Update Profile
  UPDATE public.profiles
  SET last_active_date         = v_today,
      streak_count             = v_streak,
      longest_streak           = GREATEST(COALESCE(longest_streak, 0), v_streak),
      streak_freezes_available = v_freezes
  WHERE id = p_user_id;

  -- Log Activity
  INSERT INTO public.streak_logs (user_id, log_date, action_type, streak_count)
  VALUES (p_user_id, v_today, CASE WHEN v_consumed THEN 'freeze_consumed' ELSE 'daily_active' END, v_streak)
  ON CONFLICT (user_id, log_date) DO UPDATE SET streak_count = EXCLUDED.streak_count;

  RETURN json_build_object(
    'streak',          v_streak,
    'xp_earned',       5,
    'already_updated', false,
    'freeze_consumed', v_consumed,
    'streak_bonus',    (v_streak % 7 = 0)
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Stored Procedure: check_and_award_badges
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.check_and_award_badges(UUID);

CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id UUID)
RETURNS TABLE(badge_id TEXT, badge_name TEXT, xp_bonus INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_xp    INTEGER;
  v_streak      INTEGER;
  v_lessons     INTEGER;
  v_quizzes     INTEGER;
  v_arena       INTEGER;
  v_badge       RECORD;
BEGIN
  -- Fetch user metrics
  SELECT total_xp, streak_count INTO v_total_xp, v_streak FROM public.profiles WHERE id = p_user_id;
  SELECT COUNT(*) INTO v_lessons FROM public.user_progress WHERE user_id = p_user_id;
  SELECT COUNT(*) INTO v_quizzes FROM public.quiz_submissions WHERE user_id = p_user_id AND passed = true;
  SELECT COUNT(*) INTO v_arena FROM public.problem_attempts WHERE user_id = p_user_id AND status = 'approved';

  v_total_xp := COALESCE(v_total_xp, 0);
  v_streak   := COALESCE(v_streak, 0);
  v_lessons  := COALESCE(v_lessons, 0);
  v_quizzes  := COALESCE(v_quizzes, 0);
  v_arena    := COALESCE(v_arena, 0);

  -- Evaluate Badge Rules
  FOR v_badge IN
    SELECT b.id, b.name, b.xp_bonus
    FROM public.badges b
    WHERE b.id NOT IN (SELECT ub.badge_id FROM public.user_badges ub WHERE ub.user_id = p_user_id)
      AND (
        (b.id = 'first_lesson' AND v_lessons >= 1) OR
        (b.id = 'quiz_whiz' AND v_quizzes >= 5) OR
        (b.id = 'arena_gladiator' AND v_arena >= 3) OR
        (b.id = 'streak_3' AND v_streak >= 3) OR
        (b.id = 'streak_7' AND v_streak >= 7) OR
        (b.id = 'streak_30' AND v_streak >= 30) OR
        (b.id = 'xp_1k' AND v_total_xp >= 1000) OR
        (b.id = 'xp_10k' AND v_total_xp >= 10000)
      )
  LOOP
    -- Insert into user_badges
    INSERT INTO public.user_badges (user_id, badge_id, unlocked_at)
    VALUES (p_user_id, v_badge.id, NOW())
    ON CONFLICT (user_id, badge_id) DO NOTHING;

    -- Award XP bonus if any
    IF v_badge.xp_bonus > 0 THEN
      PERFORM public.award_xp(
        p_user_id,
        'streak_bonus',
        'badge_' || v_badge.id,
        v_badge.xp_bonus,
        jsonb_build_object('badge_id', v_badge.id)
      );
    END IF;

    badge_id   := v_badge.id;
    badge_name := v_badge.name;
    xp_bonus   := v_badge.xp_bonus;
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Grant EXECUTE permissions
GRANT EXECUTE ON FUNCTION public.update_streak(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_and_award_badges(UUID) TO authenticated, service_role;
