-- ═══════════════════════════════════════════════════════════════
-- INSYT ACADEMY: Phase 4 — Community integrity
-- Vote de-duplication + fix the tautological upvote UPDATE policy.
-- Idempotent.
-- ═══════════════════════════════════════════════════════════════

-- 1. Per-user vote ledger (one upvote per user per post).
CREATE TABLE IF NOT EXISTS public.post_votes (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id    UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE public.post_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_votes_read_own" ON public.post_votes;
CREATE POLICY "post_votes_read_own" ON public.post_votes
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Replace the broken tautology `upvotes = upvotes + 1` (always FALSE).
--    Direct row UPDATEs are now author-only; upvote counts move exclusively
--    through the SECURITY DEFINER RPC below.
DROP POLICY IF EXISTS "Auth community posts update" ON public.community_posts;
CREATE POLICY "Auth community posts update" ON public.community_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- 3. Atomic, de-duplicated upvote. Returns the new count and whether the
--    caller had already voted.
CREATE OR REPLACE FUNCTION public.add_upvote(p_post_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid        UUID := auth.uid();
  v_did_insert BOOLEAN;
  v_count      INTEGER;
BEGIN
  IF v_uid IS NULL THEN
    RETURN json_build_object('error', 'unauthenticated');
  END IF;

  INSERT INTO public.post_votes (user_id, post_id)
  VALUES (v_uid, p_post_id)
  ON CONFLICT (user_id, post_id) DO NOTHING;
  v_did_insert := FOUND;

  IF v_did_insert THEN
    UPDATE public.community_posts
    SET upvotes = upvotes + 1
    WHERE id = p_post_id
    RETURNING upvotes INTO v_count;
  ELSE
    SELECT upvotes INTO v_count FROM public.community_posts WHERE id = p_post_id;
  END IF;

  RETURN json_build_object('upvotes', COALESCE(v_count, 0), 'already_voted', NOT v_did_insert);
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_upvote(UUID) TO authenticated;
