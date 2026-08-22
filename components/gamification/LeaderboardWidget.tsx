'use client'
// components/gamification/LeaderboardWidget.tsx
// Renders a scannable, beautiful leaderboard widget.
// Props accept the server-fetched LeaderboardData to keep this component pure.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Flame, Zap, Users, Globe, ChevronRight, Shield } from 'lucide-react'
import Link from 'next/link'
import type { LeaderboardData, LeaderboardEntry } from '@/types/gamification'
import { getTierForLevel } from '@/lib/gamification/constants'
import { formatXP } from '@/lib/gamification/levels'
import { cn } from '@/lib/utils'

interface LeaderboardWidgetProps {
  globalData: LeaderboardData
  cohortData?: LeaderboardData
  /** Show compact (sidebar) or full-page variant */
  variant?: 'widget' | 'full'
  className?: string
}

const RANK_MEDALS: Record<number, { icon: string; color: string }> = {
  1: { icon: '🥇', color: 'text-alert-amber' },
  2: { icon: '🥈', color: 'text-cyber-gray-light' },
  3: { icon: '🥉', color: 'text-nagad-orange' },
}

export function LeaderboardWidget({
  globalData,
  cohortData,
  variant = 'widget',
  className,
}: LeaderboardWidgetProps) {
  const [tab, setTab] = useState<'global' | 'cohort'>('global')
  const data = tab === 'cohort' && cohortData ? cohortData : globalData
  const displayEntries = variant === 'widget' ? data.entries.slice(0, 10) : data.entries

  return (
    <div className={cn('glass rounded-2xl overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-alert-amber" />
            <h3 className="text-sm font-bold text-white">Leaderboard</h3>
          </div>
          {variant === 'widget' && (
            <Link
              href="/leaderboard"
              className="flex items-center gap-1 text-xs text-neon-green hover:text-neon-green-dim transition-colors"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Tab toggle — only show if cohort data available */}
        {cohortData && (
          <div className="flex gap-1 p-0.5 bg-cyber-gray/40 rounded-lg">
            {(['global', 'cohort'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md text-xs font-medium transition-all duration-200',
                  tab === t
                    ? 'bg-neon-green/15 text-neon-green border border-neon-green/20'
                    : 'text-cyber-gray-light hover:text-white'
                )}
              >
                {t === 'global' ? <Globe className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                {t === 'global' ? 'Global' : 'Cohort'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entries list */}
      <div className="divide-y divide-white/[0.04]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {displayEntries.map((entry, index) => (
              <LeaderboardRow
                key={entry.user_id}
                entry={entry}
                index={index}
                compact={variant === 'widget'}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Current user rank (if not in top list) */}
      {data.current_user_rank && !data.entries.some((e) => e.is_current_user) && (
        <div className="border-t border-neon-green/10 bg-neon-green/[0.03]">
          <div className="px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-cyber-gray-light">Your rank:</span>
            <span className="text-neon-green font-bold text-sm font-mono">
              #{data.current_user_rank}
            </span>
          </div>
        </div>
      )}

      {/* Footer timestamp */}
      <div className="px-4 py-2 border-t border-white/[0.04]">
        <p className="text-[10px] text-cyber-gray-light text-right">
          Updated {new Date(data.last_updated).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Individual Row
// ---------------------------------------------------------------------------

function LeaderboardRow({
  entry,
  index,
  compact,
}: {
  entry: LeaderboardEntry
  index: number
  compact: boolean
}) {
  const tier = getTierForLevel(entry.level)
  const medal = RANK_MEDALS[entry.rank]
  const isMe = entry.is_current_user
  const isAdmin = entry.is_staff === true

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        'flex items-center gap-5 px-5 py-4 transition-colors duration-150 border-l-2',
        entry.rank === 1
          ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500 hover:from-amber-500/25 hover:via-yellow-500/15'
          : entry.rank === 2
            ? 'bg-gradient-to-r from-slate-400/20 via-slate-300/10 to-transparent border-slate-400 hover:from-slate-400/25 hover:via-slate-300/15'
            : isMe
              ? 'border-neon-green/50 hover:bg-white/[0.02]'
              : 'border-transparent hover:bg-white/[0.02]'
      )}
    >
      {/* Rank */}
      <div className="w-10 flex-shrink-0 text-center">
        {medal ? (
          <span className="text-3xl leading-none">{medal.icon}</span>
        ) : (
          <span
            className={cn(
              'text-xl font-bold font-mono',
              isMe ? 'text-neon-green' : 'text-cyber-gray-light'
            )}
          >
            {entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center text-xl',
            'bg-gradient-to-br from-cyber-gray to-agri-deep',
            isMe && 'ring-1 ring-neon-green'
          )}
        >
          {entry.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.avatar_url}
              alt={entry.display_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xl">{tier.badgeEmoji}</span>
          )}
        </div>
        {/* Level dot */}
        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-agri-black border border-cyber-gray flex items-center justify-center">
          <span className="text-xs font-bold text-neon-green-dim leading-none">
            {entry.level}
          </span>
        </div>
      </div>

      {/* Name + streak */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-1.5 leading-tight">
          <p
            className={cn(
              'text-lg font-bold truncate',
              isMe ? 'text-neon-green' : 'text-white/90'
            )}
          >
            {entry.display_name}
            {isMe && <span className="ml-1 text-neon-green/50 font-normal text-sm">(you)</span>}
          </p>
          {isAdmin && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-neon-green/20 text-neon-green text-[10px] font-bold tracking-tight">
              <Shield className="w-3 h-3 text-neon-green fill-neon-green/20 shrink-0" />
              ADMIN
            </span>
          )}
        </div>
        {!compact && entry.streak_count > 0 && (
          <p className="flex items-center gap-0.5 text-sm text-alert-amber mt-0.5">
            <Flame className="w-4 h-4" />
            {entry.streak_count}d streak
          </p>
        )}
      </div>

      {/* XP */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Zap className="w-6 h-6 text-neon-green/60" />
        <span className="text-xl font-mono font-bold text-white/80">
          {formatXP(entry.total_xp)}
        </span>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton loader — use while fetching
// ---------------------------------------------------------------------------

export function LeaderboardSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="px-4 py-3 border-b border-white/5">
        <div className="h-4 bg-cyber-gray/40 rounded w-28" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5">
          <div className="w-7 h-4 bg-cyber-gray/30 rounded" />
          <div className="w-7 h-7 rounded-full bg-cyber-gray/30" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-cyber-gray/30 rounded w-24" />
          </div>
          <div className="w-10 h-3 bg-cyber-gray/30 rounded" />
        </div>
      ))}
    </div>
  )
}
