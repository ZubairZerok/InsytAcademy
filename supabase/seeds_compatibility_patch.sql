-- =============================================================================
-- INSYT ACADEMY — SEEDS COMPATIBILITY PATCH
-- File: supabase/seeds_compatibility_patch.sql
-- =============================================================================

-- 1. Add legacy/compatibility columns to quiz_questions table
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS lesson_id UUID;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS question TEXT;
ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS correct_answer INTEGER;

-- 2. Temporarily drop NOT NULL constraints to allow trigger parsing and insertion
ALTER TABLE public.quiz_questions ALTER COLUMN quiz_id DROP NOT NULL;
ALTER TABLE public.quiz_questions ALTER COLUMN question_text DROP NOT NULL;
ALTER TABLE public.quiz_questions ALTER COLUMN correct_option DROP NOT NULL;

-- 3. Create BEFORE INSERT trigger function to auto-create quizzes and map columns
CREATE OR REPLACE FUNCTION public.handle_legacy_quiz_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_quiz_id UUID;
  v_lesson_title TEXT;
BEGIN
  -- Check if this is a legacy seed insert containing lesson_id
  IF NEW.lesson_id IS NOT NULL THEN
    -- 1. Check if the quiz already exists for this lesson
    SELECT id INTO v_quiz_id FROM public.quizzes WHERE lesson_id = NEW.lesson_id LIMIT 1;
    
    -- 2. If it does not exist, create a new quiz for it
    IF v_quiz_id IS NULL THEN
      SELECT title INTO v_lesson_title FROM public.lessons WHERE id = NEW.lesson_id LIMIT 1;
      
      INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold)
      VALUES (
        NEW.lesson_id, 
        COALESCE(v_lesson_title, 'Quiz for ' || COALESCE(v_lesson_title, NEW.lesson_id::text)), 
        TRUE, 
        75, 
        70
      )
      RETURNING id INTO v_quiz_id;
    END IF;
    
    -- 3. Map the legacy fields to the normalized fields
    NEW.quiz_id := v_quiz_id;
    NEW.question_text := COALESCE(NEW.question, NEW.question_text);
    NEW.correct_option := COALESCE(NEW.correct_answer::text, NEW.correct_option);
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Bind the BEFORE INSERT trigger
DROP TRIGGER IF EXISTS tr_legacy_quiz_insert ON public.quiz_questions;
CREATE TRIGGER tr_legacy_quiz_insert
  BEFORE INSERT ON public.quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_legacy_quiz_insert();
