'use client'
// components/gamification/XPProgressBar.tsx
// Animated XP progress bar that shows current level, tier title, and progress to next level.
// Compatible with Framer Motion (already in package.json) and the Insyt design system.

import { motion, AnimatePresence } from 'framer-motion'
import { Zap, TrendingUp } from 'lucide-react'
import { getLevelInfo } from '@/lib/gamification/levels'
import { getTierForLevel, MAX_LEVEL } from '@/lib/gamification/constants'
import { formatXP } from '@/lib/gamification/levels'
import { cn } from '@/lib/utils'

interface XPProgressBarProps {
  totalXP: number
  compact?: boolean   // Condensed form for sidebar/nav
  showDetails?: boolean
  className?: string
  animateOnMount?: boolean
}

export function XPProgressBar({
  totalXP,
  compact = false,
  showDetails = true,
  className,
  animateOnMount = true,
}: XPProgressBarProps) {
  const info = getLevelInfo(totalXP)
  const tier = getTierForLevel(info.level)
  const isMaxLevel = info.level >= MAX_LEVEL

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {/* Level badge */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-bold font-mono">
          {info.level}
        </div>

        {/* Mini progress bar */}
        <div className="flex-1 min-w-0">
          <div className="h-1.5 bg-cyber-gray rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-green-muted to-neon-green"
              initial={{ width: '0%' }}
              animate={{ width: `${info.progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </div>

        <span className="text-xs text-neon-green font-mono whitespace-nowrap">
          {formatXP(totalXP)} XP
        </span>
      </div>
    )
  }

  return (
    <div className={cn('glass rounded-2xl p-4 space-y-3', className)}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Tier badge */}
          <div className="relative">
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-xl',
              'bg-gradient-to-br border border-neon-green/20 text-lg',
            )}>
              <span>{tier.badgeEmoji}</span>
            </div>
            {/* Level number overlay */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neon-green flex items-center justify-center">
              <span className="text-[9px] font-black text-agri-black">{info.level}</span>
            </div>
          </div>

          <div>
            <p className="text-neon-green text-sm font-bold leading-none">
              Level {info.level} · {info.title}
            </p>
            <p className="text-cyber-gray-light text-xs mt-0.5">
              {formatXP(totalXP)} total XP
            </p>
          </div>
        </div>

        {/* XP pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neon-green/10 border border-neon-green/20">
          <Zap className="w-3 h-3 text-neon-green" />
          <span className="text-neon-green text-xs font-mono font-bold">
            {formatXP(totalXP)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 bg-cyber-gray/60 rounded-full overflow-hidden relative">
          {/* Shimmer background effect on the fill */}
          <motion.div
            className="h-full rounded-full relative overflow-hidden bg-gradient-to-r from-neon-green-muted to-neon-green"
            initial={animateOnMount ? { width: '0%' } : undefined}
            animate={{ width: `${info.progressPercent}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          </motion.div>

          {/* Glow effect at fill end */}
          {info.progressPercent > 0 && (
            <motion.div
              className="absolute top-0 h-full w-1 bg-neon-green/80 blur-sm"
              initial={animateOnMount ? { left: '0%' } : undefined}
              animate={{ left: `calc(${info.progressPercent}% - 2px)` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          )}
        </div>

        {/* XP sub-label */}
        {showDetails && !isMaxLevel && (
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-cyber-gray-light font-mono">
              {formatXP(info.xpIntoLevel)} / {formatXP(info.xpNeededInLevel)} XP
            </p>
            <p className="text-[11px] text-cyber-gray-light font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {formatXP(info.xpNeededInLevel - info.xpIntoLevel)} to Lv.{info.level + 1}
            </p>
          </div>
        )}

        {isMaxLevel && (
          <p className="text-center text-[11px] text-neon-green font-mono">
            ⭐ Maximum Level Reached
          </p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LevelUpBurst — shown briefly when a level-up occurs
// ---------------------------------------------------------------------------

interface LevelUpBurstProps {
  fromLevel: number
  toLevel: number
  onComplete?: () => void
}

export function LevelUpBurst({ fromLevel, toLevel, onComplete }: LevelUpBurstProps) {
  const tier = getTierForLevel(toLevel)

  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop radial glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(0,255,148,0.08) 0%, transparent 70%)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Card */}
        <motion.div
          className="glass-strong rounded-3xl p-8 text-center max-w-xs mx-4 border border-neon-green/30 relative overflow-hidden"
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onAnimationComplete={() => onComplete && setTimeout(onComplete, 2500)}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl border border-neon-green/60 animate-pulse" />

          <motion.div
            className="text-5xl mb-3"
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {tier.badgeEmoji}
          </motion.div>

          <p className="text-cyber-gray-light text-sm mb-1">LEVEL UP!</p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl font-bold font-mono text-cyber-gray-light">
              {fromLevel}
            </span>
            <motion.div
              className="text-neon-green"
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: 3, duration: 0.4 }}
            >
              →
            </motion.div>
            <span className="text-4xl font-black font-mono text-neon-green">
              {toLevel}
            </span>
          </div>
          <p className="text-neon-green font-bold text-lg">{tier.title}</p>
          <p className="text-cyber-gray-light text-xs mt-1">Unlocked: New rank achieved</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
