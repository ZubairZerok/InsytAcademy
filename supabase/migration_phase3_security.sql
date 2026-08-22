-- ═══════════════════════════════════════════════════════════════
-- INSYT ACADEMY: Phase 3 — Security Remediation
-- Role model normalization, admin seeding, proctoring purge.
-- Idempotent: safe to run multiple times.
-- ═══════════════════════════════════════════════════════════════

-- ---------------------------------------------------------------------------
-- 1. NORMALIZE profiles.role to canonical lowercase values
--    Historical values: 'Cadet' (default), 'Admin', 'Instructor', etc.
--    Canonical going forward: 'admin' | 'instructor' | 'student'
-- ---------------------------------------------------------------------------
UPDATE public.profiles
SET role = CASE
  WHEN lower(coalesce(role, '')) = 'admin'      THEN 'admin'
  WHEN lower(coalesce(role, '')) = 'instructor' THEN 'instructor'
  ELSE 'student'
END;

-- Default for new rows should be the canonical student role.
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'student';

-- ---------------------------------------------------------------------------
-- 2. SEED the initial admin (replaces the old hardcoded email check).
--    The previously hardcoded super-admin email becomes a real admin role.
--    Change/extend this list as needed; it is the ONLY place admin is granted.
-- ---------------------------------------------------------------------------
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE lower(email) = 'z65gt9@gmail.com'
);

-- ---------------------------------------------------------------------------
-- 3. PROCTORING PURGE — drop columns that backed the removed (fake) proctoring.
-- ---------------------------------------------------------------------------
ALTER TABLE public.problem_attempts DROP COLUMN IF EXISTS proctoring_active;
ALTER TABLE public.problem_attempts DROP COLUMN IF EXISTS violation_count;

-- ---------------------------------------------------------------------------
-- 4. CASE-INSENSITIVE role checks in legacy RLS policies.
--    schema.sql / phase1 / phase2 defined these with exact-case 'Admin'/'Instructor'.
--    After lowercasing the data above, those would never match — recreate them
--    using lower(role) so instructor/admin access keeps working (defense-in-depth).
-- ---------------------------------------------------------------------------

-- Modules
DROP POLICY IF EXISTS "Public modules" ON public.modules;
CREATE POLICY "Public modules" ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = modules.course_id AND (courses.is_published = TRUE OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND lower(profiles.role) IN ('admin', 'instructor')
      ))
    )
  );

-- Lessons
DROP POLICY IF EXISTS "Public lessons" ON public.lessons;
CREATE POLICY "Public lessons" ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.modules
      JOIN public.courses ON courses.id = modules.course_id
      WHERE modules.id = lessons.module_id AND (courses.is_published = TRUE OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND lower(profiles.role) IN ('admin', 'instructor')
      ))
    )
  );

-- Quiz questions (normalized schema policy)
DROP POLICY IF EXISTS "Public questions" ON public.quiz_questions;
CREATE POLICY "Public questions" ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.lessons l ON l.id = q.lesson_id
      JOIN public.modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE q.id = quiz_questions.quiz_id AND (c.is_published = TRUE OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND lower(profiles.role) IN ('admin', 'instructor')
      ))
    )
  );

-- Course pricing (phase1)
DROP POLICY IF EXISTS "Admin pricing insert" ON public.course_pricing;
CREATE POLICY "Admin pricing insert" ON public.course_pricing
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND lower(profiles.role) IN ('admin', 'instructor'))
  );
DROP POLICY IF EXISTS "Admin pricing update" ON public.course_pricing;
CREATE POLICY "Admin pricing update" ON public.course_pricing
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND lower(profiles.role) IN ('admin', 'instructor'))
  );

-- Research papers (phase2)
DROP POLICY IF EXISTS "Auth research insert" ON public.research_papers;
CREATE POLICY "Auth research insert" ON public.research_papers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND lower(profiles.role) IN ('admin', 'instructor'))
  );

-- ---------------------------------------------------------------------------
-- 5. COURSES write policies (defense-in-depth for createCourse/updateCourse).
--    Writes go through the service client after a server-side role check, but
--    these policies ensure RLS also rejects non-staff writes.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff courses insert" ON public.courses;
CREATE POLICY "Staff courses insert" ON public.courses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND lower(profiles.role) IN ('admin', 'instructor'))
  );
DROP POLICY IF EXISTS "Staff courses update" ON public.courses;
CREATE POLICY "Staff courses update" ON public.courses
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND lower(profiles.role) IN ('admin', 'instructor'))
  );

