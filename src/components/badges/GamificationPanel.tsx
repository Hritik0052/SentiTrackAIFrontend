import { useEffect, useState } from "react"
import { Award, Flame, Snowflake, Target } from "lucide-react"
import { Spinner } from "../ui/Spinner"
import { ImageBadge } from "./ImageBadge"
import { ApiError } from "../../lib/apiClient"
import { gamificationService } from "../../services/gamificationService"
import type { BadgeList, ChallengeList, StreakStatus, XpStatus } from "../../types/gamification"

export function GamificationPanel({ compact = false }: { compact?: boolean }) {
  const [streaks, setStreaks] = useState<StreakStatus | null>(null)
  const [xp, setXp] = useState<XpStatus | null>(null)
  const [badges, setBadges] = useState<BadgeList | null>(null)
  const [challenges, setChallenges] = useState<ChallengeList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [s, x, b, c] = await Promise.all([
          gamificationService.streaks(),
          gamificationService.xp(),
          gamificationService.badges(),
          gamificationService.challenges(),
        ])
        if (cancelled) return
        setStreaks(s)
        setXp(x)
        setBadges(b)
        setChallenges(c)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Couldn't load gamification data.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    )
  }

  if (error || !streaks || !xp || !badges || !challenges) {
    return <p className="text-sm text-rose-600 dark:text-rose-400">{error ?? "No data"}</p>
  }

  return (
    <div className="space-y-6">
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        <div className="card-surface p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Flame className="h-4 w-4 text-orange-500" />
            Streak
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {streaks.current_streak}
            <span className="ml-1 text-sm font-medium text-slate-500">days</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Longest {streaks.longest_streak}d
            {streaks.is_paused ? " · freeze active" : ""}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Snowflake className="h-3.5 w-3.5 text-sky-500" />
            {streaks.freeze_tokens} freeze {streaks.freeze_tokens === 1 ? "token" : "tokens"}
          </p>
          {streaks.near_milestone_hint && (
            <p className="mt-2 text-xs font-medium text-brand-600 dark:text-brand-400">
              {streaks.near_milestone_hint}
            </p>
          )}
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Award className="h-4 w-4 text-amber-500" />
            Level
          </div>
          <p className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{xp.level_name}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Level {xp.level} · {xp.total_xp} XP
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-brand"
              style={{ width: `${xp.progress_percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            {xp.xp_for_next_level == null
              ? "Max level reached"
              : `${xp.xp_into_level} / ${xp.xp_for_next_level} XP to next level`}
          </p>
        </div>

        <div className={`card-surface p-5 ${compact ? "sm:col-span-2" : ""}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Target className="h-4 w-4 text-emerald-500" />
            This week’s challenges
          </div>
          <ul className="mt-3 space-y-3">
            {challenges.challenges.map((ch) => {
              const pct = Math.min(100, Math.round((ch.progress / Math.max(ch.target, 1)) * 100))
              return (
                <li key={ch.key}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{ch.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{ch.description}</p>
                    </div>
                    <span className="shrink-0 text-xs tabular-nums text-slate-500">
                      {ch.progress}/{ch.target}
                      {ch.completed ? " ✓" : ""}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full ${ch.completed ? "bg-emerald-500" : "bg-brand-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="card-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Badges</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {badges.unlocked_count} / {badges.total_count} unlocked
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {badges.badges.map((badge) => (
            <ImageBadge key={badge.key} badge={badge} size={compact ? 80 : 96} />
          ))}
        </div>
      </div>
    </div>
  )
}
