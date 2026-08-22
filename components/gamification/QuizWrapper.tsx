'use client'
// components/gamification/QuizWrapper.tsx
// Full quiz experience: questions → timer → submit → results with XP reveal.
// Calls the `submitQuizAnswers` Server Action for secure server-side scoring.

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Zap, ChevronRight, Trophy, RotateCcw, AlertCircle } from 'lucide-react'
import { submitQuizAnswers } from '@/actions/quiz'
import type { Quiz, QuizResult, QuizAnswers } from '@/types/gamification'
import { LevelUpBurst } from './XPProgressBar'
import { cn } from '@/lib/utils'

interface QuizWrapperProps {
  quiz: Quiz
  onComplete?: (result: QuizResult) => void
  className?: string
}

type QuizPhase = 'answering' | 'submitting' | 'results'

export function QuizWrapper({ quiz, onComplete, className }: QuizWrapperProps) {
  const [phase, setPhase]               = useState<QuizPhase>('answering')
  const [answers, setAnswers]           = useState<QuizAnswers>({})
  const [activeQuestion, setActive]     = useState(0)
  const [result, setResult]             = useState<QuizResult | null>(null)
  const [error, setError]               = useState<string | null>(null)
  const [showLevelUp, setShowLevelUp]   = useState(false)
  const [timeLeft, setTimeLeft]         = useState<number | null>(quiz.time_limit_seconds)
  const startTimeRef                    = useRef<number>(Date.now())
  const timerRef                        = useRef<ReturnType<typeof setInterval> | null>(null)

  // ---------------------------------------------------------------------------
  // Timer
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!quiz.time_limit_seconds || phase !== 'answering') return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const selectAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (phase !== 'answering') return
    setPhase('submitting')
    setError(null)

    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)

    try {
      const res = await submitQuizAnswers(quiz.id, answers, elapsed)
      setResult(res)
      setPhase('results')
      if (res.leveled_up) setShowLevelUp(true)
      onComplete?.(res)
    } catch {
      setError('Something went wrong. Please try again.')
      setPhase('answering')
    }
  }, [phase, quiz.id, answers, onComplete])

  const handleRetry = useCallback(() => {
    setPhase('answering')
    setAnswers({})
    setActive(0)
    setResult(null)
    setError(null)
    setTimeLeft(quiz.time_limit_seconds)
    startTimeRef.current = Date.now()
  }, [quiz.time_limit_seconds])

  const answeredCount  = Object.keys(answers).length
  const totalQuestions = quiz.questions.length
  const allAnswered    = answeredCount === totalQuestions
  const currentQ       = quiz.questions[activeQuestion]

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  const timerPercent = quiz.time_limit_seconds
    ? ((timeLeft ?? 0) / quiz.time_limit_seconds) * 100
    : 100
  const timerColor = timerPercent > 50
    ? 'from-neon-green-muted to-neon-green'
    : timerPercent > 25
    ? 'from-alert-amber to-alert-amber'
    : 'from-alert-red to-alert-red'

  // ---------------------------------------------------------------------------
  // PHASE: answering
  // ---------------------------------------------------------------------------
  if (phase === 'answering' || phase === 'submitting') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Progress + Timer row */}
        <div className="flex items-center gap-3">
          {/* Question progress dots */}
          <div className="flex gap-1.5 flex-wrap flex-1">
            {quiz.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setActive(i)}
                className={cn(
                  'w-5 h-5 rounded-full text-[9px] font-bold transition-all duration-200',
                  i === activeQuestion
                    ? 'bg-neon-green text-agri-black scale-125 shadow-[0_0_8px_rgba(0,255,148,0.5)]'
                    : answers[q.id]
                    ? 'bg-neon-green/30 text-neon-green border border-neon-green/40'
                    : 'bg-cyber-gray/40 text-cyber-gray-light border border-white/10'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Timer */}
          {quiz.time_limit_seconds && timeLeft !== null && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="relative w-20 h-2 bg-cyber-gray/40 rounded-full overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full bg-gradient-to-r', timerColor)}
                  animate={{ width: `${timerPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <Clock className={cn('w-3.5 h-3.5', timerPercent < 25 ? 'text-alert-red animate-pulse' : 'text-cyber-gray-light')} />
              <span className={cn('text-xs font-mono font-bold tabular-nums',
                timerPercent < 25 ? 'text-alert-red' : 'text-white/80')}>
                {Math.floor((timeLeft ?? 0) / 60).toString().padStart(2, '0')}:
                {((timeLeft ?? 0) % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass rounded-2xl p-5 space-y-4"
          >
            {/* Q counter */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-cyber-gray-light font-mono uppercase tracking-widest">
                Question {activeQuestion + 1} / {totalQuestions}
              </span>
              <span className="text-[11px] text-neon-green/70 font-mono">
                {currentQ.points} pts
              </span>
            </div>

            {/* Question text */}
            <p className="text-white text-base font-medium leading-relaxed">
              {currentQ.question_text}
            </p>

            {/* Answer options */}
            <div className="space-y-2" role="radiogroup" aria-label="Answer options">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id] === option.id
                return (
                  <motion.button
                    key={option.id}
                    role="radio"
                    aria-checked={isSelected}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => selectAnswer(currentQ.id, option.id)}
                    className={cn(
                      'w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl',
                      'border transition-all duration-200 text-sm',
                      isSelected
                        ? 'bg-neon-green/10 border-neon-green/40 text-neon-green shadow-[0_0_12px_rgba(0,255,148,0.1)]'
                        : 'bg-cyber-gray/20 border-white/10 text-white/80 hover:border-neon-green/20 hover:bg-neon-green/[0.04]'
                    )}
                  >
                    {/* Option label */}
                    <span className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center',
                      'text-xs font-bold uppercase',
                      isSelected
                        ? 'bg-neon-green text-agri-black'
                        : 'bg-cyber-gray/40 text-cyber-gray-light'
                    )}>
                      {option.id}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation row */}
        <div className="flex items-center justify-between gap-3">
          {/* Prev / Next */}
          <div className="flex gap-2">
            <button
              onClick={() => setActive((p) => Math.max(0, p - 1))}
              disabled={activeQuestion === 0}
              className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/50 disabled:opacity-30 hover:border-neon-green/20 hover:text-white/80 transition-all"
            >
              ← Prev
            </button>
            <button
              onClick={() => setActive((p) => Math.min(totalQuestions - 1, p + 1))}
              disabled={activeQuestion === totalQuestions - 1}
              className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/50 disabled:opacity-30 hover:border-neon-green/20 hover:text-white/80 transition-all"
            >
              Next →
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || phase === 'submitting'}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300',
              allAnswered
                ? 'bg-neon-green text-agri-black hover:bg-neon-green-dim shadow-[0_0_16px_rgba(0,255,148,0.3)]'
                : 'bg-cyber-gray/30 text-white/30 cursor-not-allowed',
              phase === 'submitting' && 'animate-pulse'
            )}
          >
            {phase === 'submitting' ? (
              <>Submitting…</>
            ) : (
              <>
                Submit Quiz
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Answered counter */}
        <p className="text-center text-[11px] text-cyber-gray-light">
          {answeredCount} / {totalQuestions} answered
          {!allAnswered && ` · ${totalQuestions - answeredCount} remaining`}
        </p>

        {error && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-alert-red/10 border border-alert-red/20 text-alert-red text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // PHASE: results
  // ---------------------------------------------------------------------------
  if (phase === 'results' && result) {
    return (
      <>
        <div className={cn('space-y-4 animate-fade-up', className)}>
          {/* Score header */}
          <div className={cn(
            'glass rounded-2xl p-6 text-center relative overflow-hidden',
            result.passed ? 'border border-neon-green/20' : 'border border-alert-red/20'
          )}>
            {/* Background glow */}
            <div className={cn(
              'absolute inset-0 opacity-5',
              result.passed
                ? 'bg-gradient-radial from-neon-green to-transparent'
                : 'bg-gradient-radial from-alert-red to-transparent'
            )} />

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative"
            >
              {result.passed ? (
                <Trophy className="w-12 h-12 text-alert-amber mx-auto mb-3" />
              ) : (
                <XCircle className="w-12 h-12 text-alert-red/80 mx-auto mb-3" />
              )}

              <p className={cn(
                'text-3xl font-black font-mono mb-1',
                result.passed ? 'text-neon-green' : 'text-alert-red'
              )}>
                {result.score}%
              </p>

              <p className={cn(
                'text-sm font-bold mb-3',
                result.passed ? 'text-neon-green/80' : 'text-alert-red/80'
              )}>
                {result.passed ? 'Passed! Great work.' : `Not quite — you need ${quiz.pass_threshold}% to pass`}
              </p>

              {result.passed && result.xp_earned > 0 && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/20"
                >
                  <Zap className="w-4 h-4 text-neon-green" />
                  <span className="text-neon-green font-bold font-mono">
                    +{result.xp_earned} XP earned
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Per-question breakdown */}
          <div className="space-y-2">
            {quiz.questions.map((q, i) => {
              const correct = result.results[q.id]
              const userAns = Object.keys(result.results)[i] ? answers[q.id] : '—'
              const correctAns = result.correct_answers[q.id]
              const explanation = result.explanations[q.id]

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    'glass rounded-xl p-4 border',
                    correct ? 'border-neon-green/15' : 'border-alert-red/15'
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {correct ? (
                        <CheckCircle className="w-4 h-4 text-neon-green" />
                      ) : (
                        <XCircle className="w-4 h-4 text-alert-red" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-xs font-medium leading-snug mb-1">
                        Q{i + 1}. {q.question_text}
                      </p>
                      {!correct && (
                        <p className="text-[11px] text-alert-red/80 mb-0.5">
                          Your answer: <span className="font-mono uppercase">{userAns ?? '—'}</span>
                          {' · '}
                          Correct: <span className="font-mono uppercase text-neon-green">{correctAns}</span>
                        </p>
                      )}
                      {explanation && (
                        <p className="text-[11px] text-cyber-gray-light italic mt-1">
                          {explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Retry button */}
          {!result.passed && (
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                border border-neon-green/20 text-neon-green text-sm font-bold
                hover:bg-neon-green/[0.06] transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>

        {/* Level-up overlay */}
        {showLevelUp && result.leveled_up && (
          <LevelUpBurst
            fromLevel={result.new_level - 1}
            toLevel={result.new_level}
            onComplete={() => setShowLevelUp(false)}
          />
        )}
      </>
    )
  }

  return null
}
