-- =============================================================================
-- INSYT ACADEMY — GAMIFICATION REPAIR SCRIPT
-- Run this script in your Supabase SQL Editor.
-- It safely adds missing gamification functions, tables, and fixes courses visibility.
-- =============================================================================

-- 1. Ensure courses are published so they appear on the frontend
UPDATE public.courses SET is_published = TRUE;

-- 2. Ensure profiles has all gamification columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS total_xp        INTEGER      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level           INTEGER      NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS streak_count    INTEGER      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak  INTEGER      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date DATE,
  ADD COLUMN IF NOT EXISTS streak_claimed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email           TEXT;

-- 3. XP EVENTS
CREATE TABLE IF NOT EXISTS public.xp_events (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type   TEXT         NOT NULL,
  source_id    TEXT,
  xp_awarded   INTEGER      NOT NULL,
  metadata     JSONB        NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT xp_events_dedup UNIQUE (user_id, event_type, source_id)
);

-- 4. QUIZ SUBMISSIONS (if missing)
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id             UUID    NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  answers             JSONB   NOT NULL,
  results             JSONB   NOT NULL DEFAULT '{}',
  score               INTEGER NOT NULL,
  xp_earned           INTEGER NOT NULL DEFAULT 0,
  passed              BOOLEAN NOT NULL DEFAULT FALSE,
  time_taken_seconds  INTEGER,
  attempt_number      INTEGER NOT NULL DEFAULT 1,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. LEADERBOARD CACHE
CREATE TABLE IF NOT EXISTS public.leaderboard_cache (
  user_id       UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cohort_id     UUID,
  rank          INTEGER NOT NULL,
  total_xp      INTEGER NOT NULL,
  level         INTEGER NOT NULL,
  display_name  TEXT    NOT NULL,
  avatar_url    TEXT,
  streak_count  INTEGER NOT NULL DEFAULT 0,
  last_updated  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uidx_leaderboard_cache_user_cohort
  ON public.leaderboard_cache (user_id, COALESCE(cohort_id, '00000000-0000-0000-0000-000000000000'::UUID));

-- 6. ATOMIC XP AWARD FUNCTION
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
  v_old_xp    INTEGER;
  v_new_xp    INTEGER;
  v_level     INTEGER;
BEGIN
  -- Check for existing row in profiles before proceeding
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
     RETURN json_build_object('success', false, 'reason', 'profile_not_found');
  END IF;

  -- Guard: duplicate event check via INSERT (unique constraint)
  BEGIN
    INSERT INTO public.xp_events (user_id, event_type, source_id, xp_awarded, metadata)
    VALUES (p_user_id, p_event, p_source_id, p_xp, p_meta);
  EXCEPTION WHEN unique_violation THEN
    SELECT total_xp, level INTO v_new_xp, v_level
    FROM public.profiles WHERE id = p_user_id;
    RETURN json_build_object(
      'success', false,
      'reason', 'already_claimed',
      'new_total_xp', v_new_xp,
      'new_level', v_level,
      'leveled_up', false
    );
  END;

  -- Get old values
  SELECT total_xp, level INTO v_old_xp, v_level
  FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  v_new_xp := COALESCE(v_old_xp, 0) + p_xp;

  -- Atomic profile update
  UPDATE public.profiles
  SET total_xp = v_new_xp
  WHERE id = p_user_id;

  RETURN json_build_object(
    'success',      true,
    'new_total_xp', v_new_xp,
    'new_level',    v_level,
    'leveled_up',   false,
    'xp_awarded',   p_xp
  );
END;
$$;

-- 7. RECALCULATE LEVEL FUNCTION
CREATE OR REPLACE FUNCTION public.recalculate_user_level(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course_record RECORD;
  v_total_level   INTEGER := 0;
  v_total_lessons INTEGER;
  v_done_lessons  INTEGER;
  v_percent       FLOAT;
  v_course_level  INTEGER;
BEGIN
  FOR v_course_record IN SELECT id FROM public.courses LOOP
    SELECT COUNT(*) INTO v_total_lessons FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id WHERE m.course_id = v_course_record.id;

    IF v_total_lessons > 0 THEN
      SELECT COUNT(*) INTO v_done_lessons FROM public.user_progress up
      JOIN public.lessons l ON l.id = up.lesson_id
      JOIN public.modules m ON m.id = l.module_id
      WHERE up.user_id = p_user_id AND m.course_id = v_course_record.id;

      v_percent      := (v_done_lessons::FLOAT / v_total_lessons) * 100.0;
      v_course_level := FLOOR(v_percent / 10.0);
      v_total_level  := v_total_level + v_course_level;
    END IF;
  END LOOP;

  v_total_level := GREATEST(1, v_total_level);
  UPDATE public.profiles SET level = v_total_level WHERE id = p_user_id;
  RETURN v_total_level;
END;
$$;

-- 8. TRIGGER FOR USER PROGRESS
CREATE OR REPLACE FUNCTION public.tr_user_progress_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM public.recalculate_user_level(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS tr_user_progress_insert ON public.user_progress;
CREATE TRIGGER tr_user_progress_insert
  AFTER INSERT OR DELETE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.tr_user_progress_after_insert();

-- 9. STREAK UPDATE
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_date    DATE;
  v_claimed_at   TIMESTAMPTZ;
  v_streak       INTEGER;
  v_today        DATE := CURRENT_DATE;
  v_xp_earned    INTEGER := 0;
  v_streak_bonus BOOLEAN := FALSE;
BEGIN
  SELECT last_active_date, streak_count, streak_claimed_at
  INTO v_last_date, v_streak, v_claimed_at
  FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  IF v_last_date = v_today THEN
    RETURN json_build_object('streak', v_streak, 'xp_earned', 0, 'already_updated', true);
  END IF;

  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSE
    v_streak := 1;
  END IF;

  IF v_streak % 7 = 0 THEN v_streak_bonus := TRUE; END IF;
  v_xp_earned := 5;

  UPDATE public.profiles
  SET last_active_date  = v_today,
      streak_count      = v_streak,
      longest_streak    = GREATEST(COALESCE(longest_streak, 0), v_streak),
      streak_claimed_at = NOW()
  WHERE id = p_user_id;

  RETURN json_build_object('streak', v_streak, 'xp_earned', v_xp_earned, 'streak_bonus', v_streak_bonus, 'already_updated', false);
END;
$$;

-- 10. GET COURSE XP
CREATE OR REPLACE FUNCTION public.get_course_xp_summary(p_user_id UUID, p_course_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lesson_xp INTEGER := 0;
  v_quiz_xp   INTEGER := 0;
  v_total_lessons INTEGER := 0;
  v_total_quizzes_xp INTEGER := 0;
BEGIN
  SELECT COALESCE(SUM(xp_awarded), 0) INTO v_lesson_xp
  FROM public.xp_events e
  JOIN public.lessons l ON (e.metadata->>'lesson_id' = l.id::text OR e.source_id = l.id::text)
  JOIN public.modules m ON l.module_id = m.id
  WHERE e.user_id = p_user_id AND e.event_type = 'lesson_complete' AND m.course_id = p_course_id;

  SELECT COALESCE(SUM(xp_awarded), 0) INTO v_quiz_xp
  FROM public.xp_events e
  JOIN public.quizzes q ON (e.metadata->>'quiz_id' = q.id::text OR e.source_id LIKE 'quiz_pass_' || q.id::text || '%')
  JOIN public.lessons l ON q.lesson_id = l.id
  JOIN public.modules m ON l.module_id = m.id
  WHERE e.user_id = p_user_id AND e.event_type = 'quiz_pass' AND m.course_id = p_course_id;

  SELECT COUNT(*) * 50 INTO v_total_lessons
  FROM public.lessons l JOIN public.modules m ON l.module_id = m.id WHERE m.course_id = p_course_id;

  SELECT COALESCE(SUM(q.max_xp), 0) INTO v_total_quizzes_xp
  FROM public.quizzes q JOIN public.lessons l ON q.lesson_id = l.id JOIN public.modules m ON l.module_id = m.id
  WHERE m.course_id = p_course_id;

  RETURN json_build_object('earned_xp', v_lesson_xp + v_quiz_xp, 'total_possible_xp', v_total_lessons + v_total_quizzes_xp);
END;
$$;

-- 11. REFRESH LEADERBOARD CACHE
CREATE OR REPLACE FUNCTION public.refresh_leaderboard_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.leaderboard_cache WHERE cohort_id IS NULL;
  INSERT INTO public.leaderboard_cache
    (user_id, cohort_id, rank, total_xp, level, display_name, avatar_url, streak_count, last_updated)
  SELECT p.id, NULL, ROW_NUMBER() OVER (ORDER BY p.total_xp DESC), p.total_xp, p.level,
    COALESCE(p.full_name, 'Learner'), p.avatar_url, p.streak_count, NOW()
  FROM public.profiles p WHERE p.total_xp > 0 ORDER BY p.total_xp DESC LIMIT 100;
END;
$$;

-- 12. RUN INITIAL SYNC
SELECT public.refresh_leaderboard_cache();
