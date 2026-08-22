// types/gamification.ts
// Shared types for the Insyt Academy gamification engine.
// Import these anywhere you need gamification data shapes.

// ---------------------------------------------------------------------------
// XP & Levels
// ---------------------------------------------------------------------------

export interface XPAwardResult {
  success: boolean
  reason?: 'already_claimed' | 'error'
  new_total_xp: number
  new_level: number
  leveled_up: boolean
  xp_awarded?: number
}

export interface LevelInfo {
  level: number
  title: string
  xpRequired: number     // Total XP to reach this level
  xpForNext: number      // Total XP needed for next level
  xpIntoLevel: number    // XP earned within current level
  xpNeededInLevel: number // XP remaining within level to level up
  progressPercent: number
  color: string          // Tailwind gradient class for this tier
}

// ---------------------------------------------------------------------------
// Streaks
// ---------------------------------------------------------------------------

export interface StreakUpdateResult {
  streak: number
  xp_earned: number
  streak_bonus: boolean
  already_updated: boolean
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------

export interface QuizOption {
  id: string   // 'a' | 'b' | 'c' | 'd'
  text: string
}

export interface QuizQuestion {
  id: string
  question_text: string
  options: QuizOption[]
  explanation?: string
  points: number
  order_index: number
  // NOTE: correct_option is NEVER sent to the client. Server validates only.
}

export interface Quiz {
  id: string
  lesson_id: string | null
  title: string
  description: string | null
  time_limit_seconds: number | null
  pass_threshold: number
  max_xp: number
  questions: QuizQuestion[]
}

export interface QuizAnswers {
  [questionId: string]: string   // questionId -> selected option id
}

export interface QuizResult {
  submission_id: string
  score: number           // 0–100 percentage
  xp_earned: number
  passed: boolean
  results: { [questionId: string]: boolean }
  explanations: { [questionId: string]: string | null }
  correct_answers: { [questionId: string]: string }
  leveled_up: boolean
  new_level: number
  new_total_xp: number
}

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

export type ChallengeStatus = 'pending' | 'correct' | 'incorrect'
export type ChallengeType = 'text' | 'code'

export interface ChallengeSubmissionResult {
  status: ChallengeStatus
  xp_earned: number
  feedback: string
  current_streak: number
  leveled_up: boolean
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type ProjectStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested'
export type ReviewType = 'instructor' | 'peer'

export interface ProjectSubmission {
  id: string
  user_id: string
  project_id: string
  submission_url: string | null
  submission_notes: string | null
  status: ProjectStatus
  review_type: ReviewType
  xp_earned: number
  reviewer_id: string | null
  review_notes: string | null
  reviewed_at: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------

export interface LeaderboardEntry {
  user_id: string
  rank: number
  total_xp: number
  level: number
  display_name: string
  avatar_url: string | null
  streak_count: number
  is_current_user?: boolean
  /** Server-derived staff flag (admin/instructor) for the badge. No PII (email) is sent to the client. */
  is_staff?: boolean
}

export interface LeaderboardData {
  entries: LeaderboardEntry[]
  current_user_rank?: number
  last_updated: string
}

// ---------------------------------------------------------------------------
// XP Event Types (mirrors DB event_type column)
// ---------------------------------------------------------------------------

export type XPEventType =
  | 'lesson_complete'
  | 'daily_login'
  | 'streak_bonus'
  | 'quiz_pass'
  | 'challenge_solved'
  | 'project_approved'
  | 'problem_solve'

// ---------------------------------------------------------------------------
// Problem Arena
// ---------------------------------------------------------------------------

export type ProblemTag = 'R' | 'GIS' | 'Statistics' | 'Python' | 'Machine Learning' | 'Data Analysis'

export type ProblemSubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface Problem {
  id: string
  title: string
  slug: string
  description: string
  difficulty: number
  tags: string[]
  hints: string[]
  xp_reward: number
  time_limit_seconds: number | null
  is_published: boolean
  created_at: string
  // NOTE: expected_answer is NEVER sent to the client
}

export interface ProblemSubmission {
  id: string
  user_id: string
  problem_id: string
  code_submission: string
  status: ProblemSubmissionStatus
  xp_earned: number
  time_taken_seconds: number | null
  admin_feedback: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  started_at: string
  submitted_at: string
  // Joined from problems
  problem?: Pick<Problem, 'title' | 'slug' | 'difficulty' | 'tags' | 'xp_reward'>
}

export interface ProblemWithAttempt extends Problem {
  user_submission?: Pick<ProblemSubmission, 'id' | 'status' | 'xp_earned' | 'submitted_at'> | null
  attempted_today: boolean
  attempts_left_today?: number
  is_locked_by_penalty?: boolean
}

// ---------------------------------------------------------------------------
// Badges Engine
// ---------------------------------------------------------------------------

export type BadgeCategory = 'learning' | 'streak' | 'arena' | 'xp' | 'special'
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Badge {
  id: string
  slug: string
  name: string
  description: string
  category: BadgeCategory
  icon: string
  rarity: BadgeRarity
  xp_bonus: number
  secret: boolean
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  unlocked_at: string
  meta?: Record<string, any>
  badge?: Badge
}

export interface UserBadgeDisplay extends Badge {
  unlocked: boolean
  unlocked_at?: string
}

export interface StreakLog {
  id: string
  user_id: string
  log_date: string
  action_type: 'daily_active' | 'freeze_consumed' | 'reset'
  streak_count: number
  created_at: string
}

