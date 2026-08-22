-- =============================================================================
-- INSYT ACADEMY — SEEDS COMPATIBILITY CLEANUP
-- File: supabase/seeds_compatibility_cleanup.sql
-- =============================================================================

-- 1. Restore strict NOT NULL constraints for production database integrity
ALTER TABLE public.quiz_questions ALTER COLUMN quiz_id SET NOT NULL;
ALTER TABLE public.quiz_questions ALTER COLUMN question_text SET NOT NULL;
ALTER TABLE public.quiz_questions ALTER COLUMN correct_option SET NOT NULL;

-- 2. Clean up temporary/legacy columns
ALTER TABLE public.quiz_questions DROP COLUMN IF EXISTS lesson_id;
ALTER TABLE public.quiz_questions DROP COLUMN IF EXISTS question;
ALTER TABLE public.quiz_questions DROP COLUMN IF EXISTS correct_answer;

-- 3. Drop the compatibility trigger and function
DROP TRIGGER IF EXISTS tr_legacy_quiz_insert ON public.quiz_questions;
DROP FUNCTION IF EXISTS public.handle_legacy_quiz_insert();
