-- =============================================================================
-- INSYT ACADEMY — GAMIFICATION ENGINE COMPLETE MIGRATION
-- File: supabase_gamification_complete.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. EXTEND PROFILES TABLE
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS total_xp        INTEGER      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level           INTEGER      NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS streak_count    INTEGER      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak  INTEGER      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date DATE,
  ADD COLUMN IF NOT EXISTS streak_claimed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email           TEXT;

-- ---------------------------------------------------------------------------
-- 1. DROP LEGACY AND CONFLICTING GAMIFICATION TABLES (CLEAN SLATE)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS public.leaderboard_cache CASCADE;
DROP TABLE IF EXISTS public.project_submissions CASCADE;
DROP TABLE IF EXISTS public.challenge_submissions CASCADE;
DROP TABLE IF EXISTS public.quiz_submissions CASCADE;
DROP TABLE IF EXISTS public.quiz_questions CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;
DROP TABLE IF EXISTS public.xp_events CASCADE;

-- ---------------------------------------------------------------------------
-- 2. XP EVENTS — Immutable audit log (the idempotency core)
-- ---------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_xp_events_user_id    ON public.xp_events (user_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_created_at ON public.xp_events (created_at DESC);

-- ---------------------------------------------------------------------------
-- 3. QUIZZES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id           UUID    REFERENCES public.lessons(id) ON DELETE CASCADE,
  title               TEXT    NOT NULL,
  description         TEXT,
  time_limit_seconds  INTEGER,                   -- NULL = no time limit
  pass_threshold      INTEGER NOT NULL DEFAULT 70, -- percentage 0–100
  max_xp              INTEGER NOT NULL DEFAULT 75,
  is_published        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id         UUID    NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text   TEXT    NOT NULL,
  options         JSONB   NOT NULL,
  correct_option  TEXT    NOT NULL,
  explanation     TEXT,
  points          INTEGER NOT NULL DEFAULT 10,
  order_index     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions (quiz_id, order_index);

-- ---------------------------------------------------------------------------
-- 4. QUIZ SUBMISSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id             UUID    NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  answers             JSONB   NOT NULL,
  results             JSONB   NOT NULL DEFAULT '{}',
  score               INTEGER NOT NULL, -- 0–100 percentage
  xp_earned           INTEGER NOT NULL DEFAULT 0,
  passed              BOOLEAN NOT NULL DEFAULT FALSE,
  time_taken_seconds  INTEGER,
  attempt_number      INTEGER NOT NULL DEFAULT 1,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_sub_user_quiz
  ON public.quiz_submissions (user_id, quiz_id);

-- ---------------------------------------------------------------------------
-- 5. CHALLENGE SUBMISSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id     UUID    NOT NULL,
  submission_text  TEXT    NOT NULL,
  submission_type  TEXT    NOT NULL DEFAULT 'text', -- 'text' | 'code'
  status           TEXT    NOT NULL DEFAULT 'pending',
  xp_earned        INTEGER NOT NULL DEFAULT 0,
  feedback         TEXT,
  current_streak   INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenge_sub_user
  ON public.challenge_submissions (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 6. PROJECT SUBMISSIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id        UUID    NOT NULL,
  submission_url    TEXT,
  submission_notes  TEXT,
  status            TEXT    NOT NULL DEFAULT 'pending',
  review_type       TEXT    NOT NULL DEFAULT 'instructor',
  xp_earned         INTEGER NOT NULL DEFAULT 0,
  reviewer_id       UUID    REFERENCES auth.users(id),
  review_notes      TEXT,
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_sub_user
  ON public.project_submissions (user_id, status);
CREATE INDEX IF NOT EXISTS idx_project_sub_status
  ON public.project_submissions (status, created_at);

-- ---------------------------------------------------------------------------
-- 7. LEADERBOARD CACHE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leaderboard_cache (
  user_id       UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cohort_id     UUID,   -- NULL = global leaderboard
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

CREATE INDEX IF NOT EXISTS idx_leaderboard_global
  ON public.leaderboard_cache (rank) WHERE cohort_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_leaderboard_cohort
  ON public.leaderboard_cache (cohort_id, rank) WHERE cohort_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_xp_desc
  ON public.profiles (total_xp DESC);

-- ---------------------------------------------------------------------------
-- 8. POSTGRESQL FUNCTIONS
-- ---------------------------------------------------------------------------

-- 8a. Atomic XP Award Function
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

  -- Atomic profile update (updates total_xp, level is updated by progress triggers)
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

-- 8b. Course Completion Based Level Recalculator Function
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
  -- For each course
  FOR v_course_record IN 
    SELECT id FROM public.courses
  LOOP
    -- Get total lessons in this course
    SELECT COUNT(*) INTO v_total_lessons 
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE m.course_id = v_course_record.id;

    IF v_total_lessons > 0 THEN
      -- Get completed lessons by this user in this course
      SELECT COUNT(*) INTO v_done_lessons
      FROM public.user_progress up
      JOIN public.lessons l ON l.id = up.lesson_id
      JOIN public.modules m ON m.id = l.module_id
      WHERE up.user_id = p_user_id AND m.course_id = v_course_record.id;

      v_percent      := (v_done_lessons::FLOAT / v_total_lessons) * 100.0;
      v_course_level := FLOOR(v_percent / 10.0);
      v_total_level  := v_total_level + v_course_level;
    END IF;
  END LOOP;

  -- Ensure minimum level is 1
  v_total_level := GREATEST(1, v_total_level);

  -- Update profiles table
  UPDATE public.profiles
  SET level = v_total_level
  WHERE id = p_user_id;

  RETURN v_total_level;
END;
$$;

-- 8c. User Progress Trigger Function
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

-- Create trigger on user_progress table
DROP TRIGGER IF EXISTS tr_user_progress_insert ON public.user_progress;
CREATE TRIGGER tr_user_progress_insert
  AFTER INSERT OR DELETE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.tr_user_progress_after_insert();

-- 8b. Streak Update Function
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
  FROM public.profiles
  WHERE id = p_user_id FOR UPDATE;

  -- Already updated today
  IF v_last_date = v_today THEN
    RETURN json_build_object('streak', v_streak, 'xp_earned', 0, 'already_updated', true);
  END IF;

  -- Continue streak (yesterday) or start new
  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSE
    v_streak := 1;
  END IF;

  -- Check for 7-day streak bonus
  IF v_streak % 7 = 0 THEN
    v_streak_bonus := TRUE;
  END IF;

  -- Award daily login XP (5 XP base)
  v_xp_earned := 5;

  UPDATE public.profiles
  SET last_active_date  = v_today,
      streak_count      = v_streak,
      longest_streak    = GREATEST(COALESCE(longest_streak, 0), v_streak),
      streak_claimed_at = NOW()
  WHERE id = p_user_id;

  RETURN json_build_object(
    'streak',        v_streak,
    'xp_earned',     v_xp_earned,
    'streak_bonus',  v_streak_bonus,
    'already_updated', false
  );
END;
$$;

-- 8c. Course XP Summary Function
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
  -- Sum XP from lesson completions (checks metadata lesson_id and source_id fallback)
  SELECT COALESCE(SUM(xp_awarded), 0) INTO v_lesson_xp
  FROM public.xp_events e
  JOIN public.lessons l ON (e.metadata->>'lesson_id' = l.id::text OR e.source_id = l.id::text)
  JOIN public.modules m ON l.module_id = m.id
  WHERE e.user_id = p_user_id 
    AND e.event_type = 'lesson_complete' 
    AND m.course_id = p_course_id;

  -- Sum XP from quiz completions
  SELECT COALESCE(SUM(xp_awarded), 0) INTO v_quiz_xp
  FROM public.xp_events e
  JOIN public.quizzes q ON (e.metadata->>'quiz_id' = q.id::text OR e.source_id LIKE 'quiz_pass_' || q.id::text || '%')
  JOIN public.lessons l ON q.lesson_id = l.id
  JOIN public.modules m ON l.module_id = m.id
  WHERE e.user_id = p_user_id 
    AND e.event_type = 'quiz_pass' 
    AND m.course_id = p_course_id;

  -- Calculate total possible lesson XP (50 XP per lesson)
  SELECT COUNT(*) * 50 INTO v_total_lessons
  FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  WHERE m.course_id = p_course_id;

  -- Calculate total possible quiz XP
  SELECT COALESCE(SUM(q.max_xp), 0) INTO v_total_quizzes_xp
  FROM public.quizzes q
  JOIN public.lessons l ON q.lesson_id = l.id
  JOIN public.modules m ON l.module_id = m.id
  WHERE m.course_id = p_course_id;

  RETURN json_build_object(
    'earned_xp', v_lesson_xp + v_quiz_xp,
    'total_possible_xp', v_total_lessons + v_total_quizzes_xp
  );
END;
$$;

-- 8c. Refresh Global Leaderboard Cache
CREATE OR REPLACE FUNCTION public.refresh_leaderboard_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete and rebuild global leaderboard (top 100)
  DELETE FROM public.leaderboard_cache WHERE cohort_id IS NULL;

  INSERT INTO public.leaderboard_cache
    (user_id, cohort_id, rank, total_xp, level, display_name, avatar_url, streak_count, last_updated)
  SELECT
    p.id,
    NULL,
    ROW_NUMBER() OVER (ORDER BY p.total_xp DESC) AS rank,
    p.total_xp,
    p.level,
    COALESCE(p.full_name, 'Learner') AS display_name,
    p.avatar_url,
    p.streak_count,
    NOW()
  FROM public.profiles p
  WHERE p.total_xp > 0
  ORDER BY p.total_xp DESC
  LIMIT 100;
END;
$$;

-- ---------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "xp_events_read_own"
  ON public.xp_events FOR SELECT
  USING (auth.uid() = user_id);

ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_sub_read_own"
  ON public.quiz_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "quiz_sub_insert_own"
  ON public.quiz_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenge_sub_read_own"
  ON public.challenge_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "challenge_sub_insert_own"
  ON public.challenge_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_sub_read_own"
  ON public.project_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "project_sub_insert_own"
  ON public.project_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_sub_instructor_update"
  ON public.project_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

ALTER TABLE public.leaderboard_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leaderboard_public_read"
  ON public.leaderboard_cache FOR SELECT
  USING (true);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quizzes_read_published"
  ON public.quizzes FOR SELECT
  USING (is_published = true);

CREATE POLICY "quizzes_read_instructor"
  ON public.quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_questions_read"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_questions.quiz_id AND q.is_published = true
    )
  );

-- ---------------------------------------------------------------------------
-- 10. MIGRATIONS AND INITIAL SEED
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  v_prof RECORD;
BEGIN
  -- Check if the legacy 'xp' column exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'xp'
  ) THEN
    -- Copy any existing points from xp → total_xp (take whichever is higher)
    UPDATE public.profiles
    SET total_xp = GREATEST(COALESCE(xp, 0), COALESCE(total_xp, 0))
    WHERE xp IS NOT NULL AND xp > 0;

    -- Safely drop the old column
    ALTER TABLE public.profiles DROP COLUMN xp;
  END IF;

  -- Recalculate level for EVERY user based on course completion
  FOR v_prof IN SELECT id FROM public.profiles LOOP
    PERFORM public.recalculate_user_level(v_prof.id);
  END LOOP;
END;
$$;

-- Populate initial leaderboard cache
SELECT public.refresh_leaderboard_cache();

-- ---------------------------------------------------------------------------
-- 11. PROBLEMS AND PROBLEM ATTEMPTS (COMPETITIVE ARENA)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.problems (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT NOT NULL,          -- Markdown problem statement
  difficulty    INTEGER NOT NULL DEFAULT 1300,  -- Codeforces-style rating
  tags          TEXT[] NOT NULL DEFAULT '{}',    -- e.g., {'R', 'GIS', 'statistics'}
  expected_answer TEXT NOT NULL,         -- The correct answer (compared server-side only)
  answer_type   TEXT NOT NULL DEFAULT 'exact',  -- 'exact' | 'numeric_tolerance' | 'regex'
  answer_tolerance FLOAT,               -- For numeric answers (e.g., 0.01)
  hints         JSONB DEFAULT '[]',     -- Optional hints array
  xp_reward     INTEGER NOT NULL DEFAULT 150,
  time_limit_seconds INTEGER DEFAULT 1800,  -- 30 min default
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.problem_attempts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id     UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  code_submission TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  is_correct     BOOLEAN NOT NULL DEFAULT FALSE,
  xp_earned      INTEGER NOT NULL DEFAULT 0,
  time_taken_seconds INTEGER,
  admin_feedback TEXT,
  reviewed_by    UUID REFERENCES auth.users(id),
  reviewed_at    TIMESTAMPTZ,
  started_at     TIMESTAMPTZ NOT NULL,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_attempt_per_problem UNIQUE (user_id, problem_id)
);

-- Enable RLS
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_attempts ENABLE ROW LEVEL SECURITY;

-- Problems Policies
CREATE POLICY "problems_read_published"
  ON public.problems FOR SELECT
  USING (is_published = true);

CREATE POLICY "problems_read_admin"
  ON public.problems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "problems_write_admin"
  ON public.problems FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

-- Problem Attempts Policies
CREATE POLICY "problem_attempts_read_own"
  ON public.problem_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "problem_attempts_read_admin"
  ON public.problem_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "problem_attempts_insert_own"
  ON public.problem_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "problem_attempts_update_admin"
  ON public.problem_attempts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );
