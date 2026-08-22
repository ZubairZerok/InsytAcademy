-- ═══════════════════════════════════════════════════════════════
-- INSYT ACADEMY: Phase 5 — Performance
-- Replace the per-course PL/pgSQL loop in recalculate_user_level() with a
-- single set-based aggregate query. Same result, far less work per lesson
-- completion (was O(courses) sequential subqueries; now one grouped scan).
-- Idempotent (CREATE OR REPLACE).
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.recalculate_user_level(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_level INTEGER;
BEGIN
  SELECT COALESCE(SUM(FLOOR(LEAST(done::float / total, 1.0) * 10.0)), 0)::int
  INTO v_total_level
  FROM (
    SELECT m.course_id,
           COUNT(l.id) AS total,
           COUNT(up.lesson_id) AS done
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    LEFT JOIN public.user_progress up
      ON up.lesson_id = l.id AND up.user_id = p_user_id
    GROUP BY m.course_id
    HAVING COUNT(l.id) > 0
  ) per_course;

  v_total_level := GREATEST(1, COALESCE(v_total_level, 1));

  UPDATE public.profiles SET level = v_total_level WHERE id = p_user_id;
  RETURN v_total_level;
END;
$$;
