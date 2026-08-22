// lib/gamification/levels.ts
// Pure utility functions for level/XP calculations.
// These are isomorphic — safe on both server and client.

import {
  calcLevel,
  xpRequiredForLevel,
  xpForNextLevel,
  getTierForLevel,
  MAX_LEVEL,
} from './constants'
import type { LevelInfo } from '@/types/gamification'

/**
 * Returns a complete LevelInfo object for a given total XP value.
 * Use this in UI components to drive the XP progress bar and level display.
 */
export function getLevelInfo(totalXP: number): LevelInfo {
  const level        = calcLevel(totalXP)
  const tier         = getTierForLevel(level)
  const xpRequired   = xpRequiredForLevel(level)
  const xpForNext    = level >= MAX_LEVEL ? xpRequired : xpForNextLevel(level)

  const xpIntoLevel       = totalXP - xpRequired
  const xpNeededInLevel   = xpForNext - xpRequired
  const progressPercent   = level >= MAX_LEVEL
    ? 100
    : Math.min(100, Math.round((xpIntoLevel / xpNeededInLevel) * 100))

  return {
    level,
    title:             tier.title,
    xpRequired,
    xpForNext,
    xpIntoLevel,
    xpNeededInLevel,
    progressPercent,
    color:             tier.colorClass,
  }
}

/**
 * Given old and new XP totals, returns whether a level-up occurred
 * and from which level to which level.
 */
export function detectLevelUp(
  oldXP: number,
  newXP: number
): { leveled_up: boolean; from_level: number; to_level: number } {
  const from_level = calcLevel(oldXP)
  const to_level   = calcLevel(newXP)
  return { leveled_up: to_level > from_level, from_level, to_level }
}

/**
 * Formats an XP number for display (e.g., 1500 → "1.5K")
 */
export function formatXP(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`
  if (xp >= 1_000)     return `${(xp / 1_000).toFixed(1)}K`
  return xp.toString()
}
