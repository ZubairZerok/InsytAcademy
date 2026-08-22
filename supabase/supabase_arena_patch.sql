-- =============================================================================
-- PROBLEM ARENA — Schema Patch & RLS
-- Paste this entire file into Supabase SQL Editor and run it.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Patch problem_attempts: drop all-time unique, add status + admin fields
-- ---------------------------------------------------------------------------

-- Drop old "one attempt ever per problem" constraint
ALTER TABLE public.problem_attempts
  DROP CONSTRAINT IF EXISTS one_attempt_per_problem;

-- Add status / review columns (safe to run multiple times with IF NOT EXISTS pattern)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'problem_attempts' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.problem_attempts
      ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';  -- 'pending' | 'approved' | 'rejected'
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'problem_attempts' AND column_name = 'admin_feedback'
  ) THEN
    ALTER TABLE public.problem_attempts
      ADD COLUMN admin_feedback TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'problem_attempts' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE public.problem_attempts
      ADD COLUMN reviewed_by UUID REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'problem_attempts' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE public.problem_attempts
      ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;

  -- Rename submitted_answer -> code_submission for clarity (skip if already renamed)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'problem_attempts' AND column_name = 'submitted_answer'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'problem_attempts' AND column_name = 'code_submission'
  ) THEN
    ALTER TABLE public.problem_attempts RENAME COLUMN submitted_answer TO code_submission;
  END IF;
END;
$$;

-- Add unique index for ONE attempt per (user, problem) PER DAY
-- We enforce this in application layer; DB stores all daily attempts with started_at date
CREATE INDEX IF NOT EXISTS idx_problem_attempts_user_problem
  ON public.problem_attempts (user_id, problem_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_problem_attempts_status
  ON public.problem_attempts (status, problem_id);

-- ---------------------------------------------------------------------------
-- 2. RLS for problems table
-- ---------------------------------------------------------------------------

ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Students can read published problems
DROP POLICY IF EXISTS "problems_read_published" ON public.problems;
CREATE POLICY "problems_read_published"
  ON public.problems FOR SELECT
  USING (is_published = true);

-- Admins/Instructors can read all problems
DROP POLICY IF EXISTS "problems_read_instructor" ON public.problems;
CREATE POLICY "problems_read_instructor"
  ON public.problems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin', 'Admin', 'Instructor')
    )
  );

-- Only admins/instructors can insert/update/delete problems
DROP POLICY IF EXISTS "problems_write_instructor" ON public.problems;
CREATE POLICY "problems_write_instructor"
  ON public.problems FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin', 'Admin', 'Instructor')
    )
  );

DROP POLICY IF EXISTS "problems_update_instructor" ON public.problems;
CREATE POLICY "problems_update_instructor"
  ON public.problems FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin', 'Admin', 'Instructor')
    )
  );

DROP POLICY IF EXISTS "problems_delete_instructor" ON public.problems;
CREATE POLICY "problems_delete_instructor"
  ON public.problems FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin', 'Admin', 'Instructor')
    )
  );

-- ---------------------------------------------------------------------------
-- 3. RLS for problem_attempts table
-- ---------------------------------------------------------------------------

ALTER TABLE public.problem_attempts ENABLE ROW LEVEL SECURITY;

-- Students can read their own attempts
DROP POLICY IF EXISTS "problem_attempts_read_own" ON public.problem_attempts;
CREATE POLICY "problem_attempts_read_own"
  ON public.problem_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Students can insert their own attempts
DROP POLICY IF EXISTS "problem_attempts_insert_own" ON public.problem_attempts;
CREATE POLICY "problem_attempts_insert_own"
  ON public.problem_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins/Instructors can read all attempts (for review queue)
DROP POLICY IF EXISTS "problem_attempts_read_instructor" ON public.problem_attempts;
CREATE POLICY "problem_attempts_read_instructor"
  ON public.problem_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin', 'Admin', 'Instructor')
    )
  );

-- Admins/Instructors can update attempts (to approve/reject)
DROP POLICY IF EXISTS "problem_attempts_update_instructor" ON public.problem_attempts;
CREATE POLICY "problem_attempts_update_instructor"
  ON public.problem_attempts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin', 'Admin', 'Instructor')
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Helper function: check if user already attempted a problem today
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.has_attempted_today(p_user_id UUID, p_problem_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.problem_attempts
    WHERE user_id = p_user_id
      AND problem_id = p_problem_id
      AND started_at::DATE = CURRENT_DATE
  );
END;
$$;
