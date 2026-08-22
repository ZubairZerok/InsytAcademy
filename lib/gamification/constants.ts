// lib/gamification/constants.ts
// Single source of truth for ALL XP values and level configuration.
// Edit this file to tune the economy — no other files need to change.

// ---------------------------------------------------------------------------
// XP VALUES
// ---------------------------------------------------------------------------

export const XP = {
  LESSON_COMPLETE:      50,   // Completing any lesson
  DAILY_LOGIN:          5,    // First visit of the day
  STREAK_BONUS_7DAY:    100,  // Awarded at every 7-day streak milestone
  STREAK_BONUS_30DAY:   500,  // Awarded at 30-day streak
  QUIZ_PASS_BASE:       25,   // Minimum XP for passing a quiz
  QUIZ_PASS_MAX:        75,   // Maximum XP for a perfect quiz score
  CHALLENGE_SOLVED:     100,  // Text or coding challenge correct submission
  PROJECT_INSTRUCTOR:   500,  // Instructor-approved project
  PROJECT_PEER:         300,  // Peer-reviewed project
  PROBLEM_SOLVE_MIN:    100,  // Minimum XP an admin can set for a problem
  PROBLEM_SOLVE_MAX:    500,  // Maximum XP an admin can set for a problem
  PROBLEM_SOLVE_DEFAULT:150,  // Default XP for a new problem
} as const

// Compute dynamic quiz XP: scale linearly between base and max based on score.
// score: 70–100 (pass threshold to perfect)
export function calcQuizXP(score: number, maxXP: number): number {
  if (score < 70) return 0
  const scaled = (score - 70) / 30  // 0 at threshold, 1 at 100%
  return Math.round(XP.QUIZ_PASS_BASE + scaled * (maxXP - XP.QUIZ_PASS_BASE))
}

// ---------------------------------------------------------------------------
// LEVEL SYSTEM
// ---------------------------------------------------------------------------
// Formula: level = FLOOR(SQRT(total_xp / 100)) + 1, capped at MAX_LEVEL.
// This produces an asymptotic curve — early levels are fast, later slow.
// Level 1:  0 XP       Level 5:  1600 XP    Level 10:  8100 XP
// Level 2:  100 XP     Level 6:  2500 XP    Level 20: 36100 XP
// Level 3:  400 XP     Level 7:  3600 XP    Level 50: ~245k XP
// Level 4:  900 XP     Level 8:  4900 XP

export const MAX_LEVEL = 50

export function calcLevel(totalXP: number): number {
  return Math.min(Math.floor(Math.sqrt(totalXP / 100)) + 1, MAX_LEVEL)
}

/** Total XP required to REACH a given level */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.pow(level - 1, 2) * 100
}

/** XP required to reach the NEXT level from a given level */
export function xpForNextLevel(level: number): number {
  return xpRequiredForLevel(level + 1)
}

// ---------------------------------------------------------------------------
// LEVEL TIERS & METADATA
// ---------------------------------------------------------------------------

export interface LevelTier {
  minLevel: number
  maxLevel: number
  title: string
  colorClass: string   // Tailwind CSS gradient class — maps to design tokens
  badgeEmoji: string
}

export const LEVEL_TIERS: LevelTier[] = [
  { minLevel: 1,  maxLevel: 4,  title: 'Seedling',   colorClass: 'from-agri-deep to-cyber-gray',           badgeEmoji: '🌱' },
  { minLevel: 5,  maxLevel: 9,  title: 'Sprout',     colorClass: 'from-neon-green-muted to-neon-green-dim', badgeEmoji: '🌿' },
  { minLevel: 10, maxLevel: 14, title: 'Cultivator', colorClass: 'from-neon-green-dim to-neon-green',       badgeEmoji: '🌾' },
  { minLevel: 15, maxLevel: 19, title: 'Harvester',  colorClass: 'from-info-cyan to-neon-green',            badgeEmoji: '⚡' },
  { minLevel: 20, maxLevel: 29, title: 'Agrologist',  colorClass: 'from-alert-amber to-info-cyan',          badgeEmoji: '🔬' },
  { minLevel: 30, maxLevel: 39, title: 'Specialist',  colorClass: 'from-alert-amber to-neon-green',         badgeEmoji: '🏆' },
  { minLevel: 40, maxLevel: 49, title: 'Maestro',    colorClass: 'from-bkash-pink to-alert-amber',          badgeEmoji: '🔥' },
  { minLevel: 50, maxLevel: 50, title: 'Legend',     colorClass: 'from-bkash-pink to-neon-green',           badgeEmoji: '⭐' },
]

export function getTierForLevel(level: number): LevelTier {
  return (
    LEVEL_TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) ??
    LEVEL_TIERS[0]
  )
}
