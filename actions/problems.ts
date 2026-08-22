'use server'
// actions/problems.ts
// Student-facing server actions for the Problem Arena.
//
// Security invariants:
//   1. expected_answer is NEVER returned to the client — ever.
//   2. Admin validates submissions; XP is awarded only upon admin approval.
//   3. Per-day attempt limit is enforced server-side before INSERT.
//   4. All writes use the admin client to bypass RLS cleanly.

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaffRole, normalizeRole } from '@/lib/auth/assert-role'
import { revalidatePath } from 'next/cache'
import type { Problem, ProblemWithAttempt, ProblemSubmission } from '@/types/gamification'

// ---------------------------------------------------------------------------
// getPublishedProblems
// Returns all published problems (no expected_answer field).
// ---------------------------------------------------------------------------

export async function getPublishedProblems(tag?: string): Promise<ProblemWithAttempt[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const admin = createAdminClient()

  let query = admin
    .from('problems')
    .select('id, title, slug, description, difficulty, tags, hints, xp_reward, time_limit_seconds, is_published, created_at')
    .eq('is_published', true)
    .order('difficulty', { ascending: true })

  if (tag && tag !== 'All') {
    query = query.contains('tags', [tag])
  }

  const { data: problems, error } = await query
  if (error || !problems) return []

  // Fetch today's attempts for this user
  const today = new Date().toISOString().split('T')[0]
  const { data: todayAttempts } = await admin
    .from('problem_attempts')
    .select('problem_id, id, status, xp_earned, submitted_at')
    .eq('user_id', user.id)
    .gte('started_at', `${today}T00:00:00.000Z`)

  // Fetch most recent submission per problem (any day)
  const { data: allAttempts } = await admin
    .from('problem_attempts')
    .select('problem_id, id, status, xp_earned, submitted_at')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })

  const attemptsTodayByProblem = new Map<string, number>()
  for (const attempt of (todayAttempts ?? [])) {
    const pid = attempt.problem_id
    attemptsTodayByProblem.set(pid, (attemptsTodayByProblem.get(pid) ?? 0) + 1)
  }

  // Latest submission per problem
  const latestByProblem = new Map<string, { problem_id: string; id: string; status: string; xp_earned: number; submitted_at: string }>()
  for (const attempt of (allAttempts ?? [])) {
    if (!latestByProblem.has(attempt.problem_id)) {
      latestByProblem.set(attempt.problem_id, attempt as any)
    }
  }

  const { data: roleRow } = await admin.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = isStaffRole(normalizeRole(roleRow?.role))

  return problems.map(p => {
    const countToday = attemptsTodayByProblem.get(p.id) ?? 0
    const attemptsLeftToday = isAdmin ? 5 : Math.max(0, 5 - countToday)
    const attemptedToday = countToday > 0

    return {
      ...(p as Problem),
      hints: (p.hints as string[]) ?? [],
      user_submission: latestByProblem.get(p.id) ?? null,
      attempted_today: attemptedToday,
      attempts_left_today: attemptsLeftToday,
      is_locked_by_penalty: false,
    }
  }) as ProblemWithAttempt[]
}

// ---------------------------------------------------------------------------
// getProblemForSolving
// Returns a single problem for the solve UI. Never includes expected_answer.
// ---------------------------------------------------------------------------

export async function getProblemForSolving(slug: string): Promise<{
  problem: Problem | null
  already_attempted_today: boolean
  attempts_left_today: number
  is_locked_by_penalty: boolean
  existing_submission: Pick<ProblemSubmission, 'id' | 'status' | 'code_submission' | 'admin_feedback'> | null
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { problem: null, already_attempted_today: false, attempts_left_today: 0, is_locked_by_penalty: false, existing_submission: null }

  const admin = createAdminClient()

  // Fetch problem WITHOUT expected_answer
  const { data: problem, error } = await admin
    .from('problems')
    .select('id, title, slug, description, difficulty, tags, hints, xp_reward, time_limit_seconds, is_published, created_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !problem) return { problem: null, already_attempted_today: false, attempts_left_today: 0, is_locked_by_penalty: false, existing_submission: null }

  const today = new Date().toISOString().split('T')[0]

  // Check today's attempts
  const { data: todayAttempts } = await admin
    .from('problem_attempts')
    .select('id, status, code_submission, admin_feedback')
    .eq('user_id', user.id)
    .eq('problem_id', problem.id)
    .gte('started_at', `${today}T00:00:00.000Z`)
    .order('started_at', { ascending: false })

  const { data: roleRow } = await admin.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = isStaffRole(normalizeRole(roleRow?.role))
  const countToday = todayAttempts?.length ?? 0
  const latestTodayAttempt = todayAttempts?.[0] ?? null

  const attemptsLeftToday = isAdmin ? 5 : Math.max(0, 5 - countToday)
  const alreadyAttemptedToday = isAdmin ? false : (
    attemptsLeftToday <= 0 ||
    latestTodayAttempt?.status === 'pending' ||
    latestTodayAttempt?.status === 'approved'
  )

  return {
    problem: { ...(problem as Problem), hints: (problem.hints as string[]) ?? [] },
    already_attempted_today: alreadyAttemptedToday,
    attempts_left_today: attemptsLeftToday,
    is_locked_by_penalty: false,
    existing_submission: latestTodayAttempt ?? null,
  }
}

// ---------------------------------------------------------------------------
// submitProblemCode
// Records a student's code submission. Status starts as 'pending'.
// Admin will later approve/reject via admin-problems.ts.
// ---------------------------------------------------------------------------

// Server-side answer grading. expected_answer NEVER leaves the server.
function gradeAnswer(
  submitted: string,
  expected: string,
  answerType: string,
  tolerance: number | null
): boolean {
  const s = (submitted ?? "").trim();
  const e = (expected ?? "").trim();
  if (!s) return false;

  if (answerType === "numeric_tolerance") {
    const a = parseFloat(s);
    const b = parseFloat(e);
    if (Number.isNaN(a) || Number.isNaN(b)) return false;
    return Math.abs(a - b) <= (tolerance ?? 0);
  }
  if (answerType === "regex") {
    try {
      return new RegExp(e).test(s);
    } catch {
      return false;
    }
  }
  // default: exact, case-insensitive
  return s.toLowerCase() === e.toLowerCase();
}

export async function submitProblemCode(data: {
  problem_id: string
  code_submission: string
  time_taken_seconds: number
  answer?: string
  violation_count?: number
  proctoring_active?: boolean
}): Promise<{ success: boolean; submission_id?: string; graded?: boolean; correct?: boolean; xp_awarded?: number; error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthenticated' }

  const admin = createAdminClient()

  // Fetch problem incl. grading fields (server-only — never returned to client).
  const { data: problem } = await admin
    .from('problems')
    .select('id, xp_reward, expected_answer, answer_type, answer_tolerance')
    .eq('id', data.problem_id)
    .eq('is_published', true)
    .single()

  if (!problem) return { success: false, error: 'Problem not found' }

  const { data: roleRow } = await admin.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = isStaffRole(normalizeRole(roleRow?.role))

  // started_at is derived SERVER-SIDE — never trust the client.
  const startedAt = new Date().toISOString()

  // Enforce the daily attempt limit for regular users (staff bypass for testing).
  if (!isAdmin) {
    const today = new Date().toISOString().split('T')[0]
    const { count } = await admin
      .from('problem_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('problem_id', data.problem_id)
      .gte('started_at', `${today}T00:00:00.000Z`)

    if ((count ?? 0) >= 5) {
      return { success: false, error: 'You have reached the maximum daily limit of 5 attempts for this problem.' }
    }
  }

  // Auto-grade when an answer is provided and the problem has an expected answer.
  const canAutoGrade = typeof data.answer === 'string' && data.answer.trim().length > 0 && !!problem.expected_answer
  const isCorrect = canAutoGrade
    ? gradeAnswer(data.answer!, problem.expected_answer as string, (problem.answer_type as string) ?? 'exact', (problem.answer_tolerance as number) ?? null)
    : false

  const status = canAutoGrade ? (isCorrect ? 'approved' : 'rejected') : 'pending'

  const { data: submission, error: insertError } = await admin
    .from('problem_attempts')
    .insert({
      user_id: user.id,
      problem_id: data.problem_id,
      code_submission: data.code_submission,
      is_correct: isCorrect,
      xp_earned: 0,
      time_taken_seconds: data.time_taken_seconds,
      started_at: startedAt,
      status,
      violation_count: data.violation_count ?? 0,
      proctoring_active: data.proctoring_active ?? false,
    })
    .select('id')
    .single()

  if (insertError) return { success: false, error: 'Could not record your submission. Please try again.' }

  // Award XP instantly on a correct auto-graded answer (idempotent per problem).
  let xpAwarded = 0
  if (canAutoGrade && isCorrect) {
    const { data: xpResult } = await admin.rpc('award_xp', {
      p_user_id: user.id,
      p_event: 'problem_solve',
      p_source_id: `problem_${data.problem_id}`,
      p_xp: problem.xp_reward ?? 150,
      p_meta: { problem_id: data.problem_id, attempt_id: submission.id },
    })
    xpAwarded = (xpResult as { xp_awarded?: number })?.xp_awarded ?? 0
    await admin.from('problem_attempts').update({ xp_earned: xpAwarded }).eq('id', submission.id)
  }

  revalidatePath('/academy/arena')
  return {
    success: true,
    submission_id: submission.id,
    graded: canAutoGrade,
    correct: canAutoGrade ? isCorrect : undefined,
    xp_awarded: xpAwarded,
  }
}


// ---------------------------------------------------------------------------
// getUserProblemHistory
// Returns all the user's submissions across all problems.
// ---------------------------------------------------------------------------

export async function getUserProblemHistory(): Promise<ProblemSubmission[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('problem_attempts')
    .select(`
      id, user_id, problem_id, code_submission, status,
      xp_earned, time_taken_seconds, admin_feedback, reviewed_by,
      reviewed_at, started_at, submitted_at,
      problems (
        title, slug, difficulty, tags, xp_reward
      )
    `)
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })

  if (error) return []

  return (data ?? []).map(row => {
    const probRaw = row.problems;
    const prob = (Array.isArray(probRaw) ? probRaw[0] : probRaw) as unknown as Problem | null;
    return {
      ...row,
      problem: prob ?? undefined,
    };
  }) as unknown as ProblemSubmission[]
}
