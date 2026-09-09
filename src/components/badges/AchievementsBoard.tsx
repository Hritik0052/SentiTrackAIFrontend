import { useEffect, useState } from "react"
import { Award, Flame, Snowflake, Target } from "lucide-react"
import { Spinner } from "../ui/Spinner"
import { ImageBadge } from "./ImageBadge"
import { BadgeDetailModal } from "./BadgeDetailModal"
import { ApiError } from "../../lib/apiClient"
import { gamificationService } from "../../services/gamificationService"
import type { BadgeList, ChallengeList, StreakStatus, UserBadge, XpStatus } from "../../types/gamification"

/** Achievements page: full badge wall + challenges, click badge for task modal */
export function AchievementsBoard() {
  const [streaks, setStreaks] = useState<StreakStatus | null>(null)
  const [xp, setXp] = useState<XpStatus | null>(null)
  const [badges, setBadges] = useState<BadgeList | null>(null)
  const [challenges, setChallenges] = useState<ChallengeList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<UserBadge | null>(null)

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
          setError(err instanceof ApiError ? err.message : "Couldn't load achievements.")
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
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !streaks || !xp || !badges || !challenges) {
    return <p className="text-sm text-rose-600 dark:text-rose-400">{error ?? "No data"}</p>
  }

  const unlocked = badges.badges.filter((b) => b.unlocked)
  const locked = badges.badges.filter((b) => !b.unlocked)

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            Streak
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {streaks.current_streak}d
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <Snowflake className="h-3 w-3 text-sky-500" />
            {streaks.freeze_tokens} freezes · best {streaks.longest_streak}d
          </p>
          {streaks.near_milestone_hint && (
            <p className="mt-2 text-xs font-medium text-brand-600 dark:text-brand-400">
              {streaks.near_milestone_hint}
            </p>
          )}
        </div>
        <div className="card-surface p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            Level
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{xp.level_name}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${xp.progress_percent}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">{xp.total_xp} XP</p>
        </div>
        <div className="card-surface p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Target className="h-3.5 w-3.5 text-emerald-500" />
            Badges
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {badges.unlocked_count}
            <span className="text-sm font-medium text-slate-500"> / {badges.total_count}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">Tap a badge to see the task</p>
        </div>
      </div>

      <div className="card-surface p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">This week’s challenges</h2>
        <ul className="mt-4 space-y-4">
          {challenges.challenges.map((ch) => {
            const pct = Math.min(100, Math.round((ch.progress / Math.max(ch.target, 1)) * 100))
            return (
              <li key={ch.key}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{ch.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{ch.description}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-slate-500">
                    {ch.progress}/{ch.target}
                    {ch.completed ? " · Done" : ` · +${ch.xp_reward} XP`}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
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

      {unlocked.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Unlocked</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Glossy medals you’ve earned</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {unlocked.map((badge) => (
              <ImageBadge key={badge.key} badge={badge} onClick={() => setSelected(badge)} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Locked</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Greyscale + lock — tap to see how to unlock
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {locked.map((badge) => (
            <ImageBadge key={badge.key} badge={badge} onClick={() => setSelected(badge)} />
          ))}
        </div>
        {locked.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">You’ve unlocked every badge. Impressive.</p>
        )}
      </div>

      {selected && <BadgeDetailModal badge={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
