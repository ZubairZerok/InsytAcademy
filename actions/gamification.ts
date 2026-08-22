'use server'
// actions/gamification.ts
//
// CRITICAL SAFETY RULES:
//  1. Every XP award calls the DB-side `award_xp()` function via .rpc().
//     The DB function owns idempotency — it will return { success: false } on
//     duplicate claims. Never award XP directly via .insert() on profiles.
//  2. All writes use the SERVICE ROLE client (supabaseAdmin), which bypasses
//     RLS. The anon/user client CANNOT write to xp_events or profiles.xp.
//  3. These Server Actions run in the Next.js server context — never expose
//     SUPABASE_SERVICE_ROLE_KEY to the browser.

import { createClient } from '@/lib/supabase/server'        // auth-scoped client
import { createAdminClient } from '@/lib/supabase/admin'    // service-role client
import { revalidatePath } from 'next/cache'
import { unstable_cache } from 'next/cache'
import type {
  XPAwardResult,
  StreakUpdateResult,
  LeaderboardData,
} from '@/types/gamification'
import { XP } from '@/lib/gamification/constants'
import { isStaffRole, normalizeRole } from '@/lib/auth/assert-role'

// ---------------------------------------------------------------------------
// awardLessonXP
// ---------------------------------------------------------------------------
// Call this from the lesson completion Server Action or middleware.
// source_id should be the lesson UUID to prevent re-awarding.

export async function awardLessonXP(lessonId: string): Promise<XPAwardResult> {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthenticated')

  const admin = createAdminClient()
  const { data, error } = await admin.rpc('award_xp', {
    p_user_id:   user.id,
    p_event:     'lesson_complete',
    p_source_id: lessonId,
    p_xp:        XP.LESSON_COMPLETE,
    p_meta:      { lesson_id: lessonId },
  })

  if (error) throw new Error(`award_xp failed: ${error.message}`)

  // Async — do not block the response
  triggerLeaderboardRefresh()

  return data as XPAwardResult
}

// ---------------------------------------------------------------------------
// updateUserStreak
// ---------------------------------------------------------------------------
// Call this on every authenticated page load (e.g., in the dashboard layout
// Server Component, wrapped in try/catch so it never breaks the page).

export async function updateUserStreak(): Promise<StreakUpdateResult | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const admin = createAdminClient()

    // Update streak in the DB
    const { data: streakData, error } = await admin.rpc('update_streak', {
      p_user_id: user.id,
    })
    if (error) throw error

    const result = streakData as StreakUpdateResult

    // Award daily login XP if streak was updated
    if (!result.already_updated && result.xp_earned > 0) {
      const today = new Date().toISOString().split('T')[0]
      await admin.rpc('award_xp', {
        p_user_id:   user.id,
        p_event:     'daily_login',
        p_source_id: `login_${today}`,        // idempotent per day
        p_xp:        XP.DAILY_LOGIN,
        p_meta:      { streak: result.streak },
      })
    }

    // Award 7-day streak bonus
    if (result.streak_bonus && result.streak % 7 === 0) {
      const weekNumber = Math.floor(result.streak / 7)
      await admin.rpc('award_xp', {
        p_user_id:   user.id,
        p_event:     'streak_bonus',
        p_source_id: `streak_week_${weekNumber}`,  // idempotent per milestone
        p_xp:        XP.STREAK_BONUS_7DAY,
        p_meta:      { streak: result.streak, week: weekNumber },
      })
    }

    // Check and award badges automatically
    try {
      await admin.rpc('check_and_award_badges', { p_user_id: user.id });
    } catch (e) {
      console.error('[check_and_award_badges error]', e);
    }

    revalidatePath('/academy', 'layout')

    return result
  } catch (e) {
    // Non-fatal: streak errors should never crash the page
    console.error('[updateUserStreak]', e)
    return null
  }
}

// ---------------------------------------------------------------------------
// getLeaderboardData
// ---------------------------------------------------------------------------
// Cached with Next.js unstable_cache for 5 minutes.
// The cache is tagged with 'leaderboard' so it can be purged on XP award.

export async function getLeaderboardData(cohortId?: string): Promise<LeaderboardData> {
  // Fetch current user if logged in
  let currentUserId: string | null = null
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    currentUserId = user?.id || null
  } catch {
    // Non-fatal, e.g. during static pre-rendering
  }

  const admin = createAdminClient()

  // Query all profiles ordered by total_xp DESC, full_name ASC, id ASC.
  // We fetch `role` (not email) so the client can render a staff badge without
  // ever receiving PII.
  const { data: profiles, error } = await admin
    .from('profiles')
    .select('id, total_xp, level, full_name, avatar_url, streak_count, role')
    .order('total_xp', { ascending: false })
    .order('full_name', { ascending: true })
    .order('id', { ascending: true })
    .limit(100)

  if (error) {
    console.error('Error fetching leaderboard directly from profiles:', error)
    return {
      entries: [],
      last_updated: new Date().toISOString(),
    }
  }

  const entries = (profiles || []).map((row, index) => ({
    user_id: row.id,
    rank: index + 1,
    total_xp: row.total_xp || 0,
    level: row.level || 1,
    display_name: row.full_name || 'Learner',
    avatar_url: row.avatar_url || null,
    streak_count: row.streak_count || 0,
    is_staff: isStaffRole(normalizeRole(row.role)),
    is_current_user: row.id === currentUserId,
  }))

  const currentUserEntry = entries.find((e) => e.is_current_user)

  return {
    entries,
    current_user_rank: currentUserEntry?.rank,
    last_updated: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// triggerLeaderboardRefresh (fire-and-forget)
// ---------------------------------------------------------------------------

async function triggerLeaderboardRefresh() {
  try {
    revalidatePath('/leaderboard', 'page')
  } catch (e) {
    console.error('[leaderboardRefresh]', e)
  }
}

// ---------------------------------------------------------------------------
// getUserGamificationProfile
// ---------------------------------------------------------------------------

export async function getUserGamificationProfile() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  const { data } = await supabase
    .from('profiles')
    .select('total_xp, level, streak_count, longest_streak, streak_freezes_available, last_active_date, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return data
}

// ---------------------------------------------------------------------------
// getCourseXP
// ---------------------------------------------------------------------------
export async function getCourseXP(courseId: string): Promise<{ earned_xp: number; total_possible_xp: number } | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const admin = createAdminClient()
    const { data, error } = await admin.rpc('get_course_xp_summary', {
      p_user_id: user.id,
      p_course_id: courseId,
    })

    if (error) throw error
    return data as { earned_xp: number; total_possible_xp: number }
  } catch (e) {
    console.error('[getCourseXP] error:', e)
    return null
  }
}
