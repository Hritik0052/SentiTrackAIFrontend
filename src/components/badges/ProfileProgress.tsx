import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Award, Flame, Snowflake, Target } from "lucide-react"
import { Spinner } from "../ui/Spinner"
import { ImageBadge } from "./ImageBadge"
import { BadgeDetailModal } from "./BadgeDetailModal"
import { ApiError } from "../../lib/apiClient"
import { gamificationService } from "../../services/gamificationService"
import type { BadgeList, ChallengeList, StreakStatus, UserBadge, XpStatus } from "../../types/gamification"

/** Profile: analytics + unlocked badges only */
export function ProfileProgress() {
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
          setError(err instanceof ApiError ? err.message : "Couldn't load your progress.")
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
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (error || !streaks || !xp || !badges || !challenges) {
    return <p className="text-sm text-rose-600 dark:text-rose-400">{error ?? "No data"}</p>
  }

  const unlocked = badges.badges.filter((b) => b.unlocked)
  const challengeDone = challenges.challenges.filter((c) => c.completed).length

  return (
    <div className="space-y-6">
      <div className="card-surface overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600/90 via-brand-500 to-fuchsia-500 px-6 py-7 text-white sm:px-8">
          <p className="text-sm font-medium text-white/80">Current level</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{xp.level_name}</h2>
          <p className="mt-1 text-sm text-white/85">
            Level {xp.level} · {xp.total_xp} XP total
          </p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white shadow-sm"
              style={{ width: `${xp.progress_percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/80">
            {xp.xp_for_next_level == null
              ? "Max level reached"
              : `${xp.xp_into_level} / ${xp.xp_for_next_level} XP to next level`}
          </p>
        </div>

        <div className="grid gap-px bg-slate-200/70 sm:grid-cols-3 dark:bg-white/10">
          <div className="bg-white p-5 dark:bg-slate-950">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              Streak
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {streaks.current_streak}
              <span className="ml-1 text-sm font-medium text-slate-500">days</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Best {streaks.longest_streak}d</p>
          </div>
          <div className="bg-white p-5 dark:bg-slate-950">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Snowflake className="h-3.5 w-3.5 text-sky-500" />
              Freezes
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {streaks.freeze_tokens}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {streaks.is_paused ? "Freeze covering a missed day" : "Ready if you miss a day"}
            </p>
          </div>
          <div className="bg-white p-5 dark:bg-slate-950">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Target className="h-3.5 w-3.5 text-emerald-500" />
              Challenges
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {challengeDone}
              <span className="ml-1 text-sm font-medium text-slate-500">
                / {challenges.challenges.length}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Completed this week</p>
          </div>
        </div>
      </div>

      <div className="card-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <Award className="h-4 w-4 text-amber-500" />
              Unlocked badges
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {unlocked.length} earned · locked badges live on Achievements
            </p>
          </div>
          <Link
            to="/app/achievements"
            className="focus-ring text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            View all
          </Link>
        </div>

        {unlocked.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            No badges yet. Journal, analyze, and complete challenges to start collecting.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {unlocked.map((badge) => (
              <ImageBadge key={badge.key} badge={badge} size={96} onClick={() => setSelected(badge)} />
            ))}
          </div>
        )}
      </div>

      {selected && <BadgeDetailModal badge={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
