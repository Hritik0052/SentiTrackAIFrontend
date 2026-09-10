import { useEffect, useState } from "react"
import { BookOpen, Sparkles, Users } from "lucide-react"
import { StatTile } from "../../components/charts/StatTile"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { adminService } from "../../services/adminService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { AdminStats } from "../../types/billing"

export default function AdminOverviewPage() {
  usePageMeta("Admin — Overview")

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    adminService
      .getStats()
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load stats.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !stats) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error ?? "No data"}</p>
  }

  const planEntries = Object.entries(stats.plan_counts)

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Platform activity and subscription mix.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile icon={Users} label="Total users" value={stats.total_users} hint={`${stats.admin_users} admins`} />
        <StatTile icon={BookOpen} label="Journals today" value={stats.journals_today} />
        <StatTile icon={Sparkles} label="AI actions today" value={stats.analyze_today + stats.weekly_summaries_today + stats.insights_today} hint={`Analyze ${stats.analyze_today} · Summaries ${stats.weekly_summaries_today} · Insights ${stats.insights_today}`} />
      </div>

      <div className="card-surface mt-8 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Users by plan</h2>
        {planEntries.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No plan assignments yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {planEntries.map(([code, count]) => (
              <li key={code} className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize text-slate-700 dark:text-slate-200">{code}</span>
                <span className="tabular-nums text-slate-500">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
