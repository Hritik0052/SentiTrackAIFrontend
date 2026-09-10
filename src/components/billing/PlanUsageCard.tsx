import { useEffect, useState } from "react"
import { CreditCard } from "lucide-react"
import { ApiError } from "../../lib/apiClient"
import { billingService } from "../../services/billingService"
import type { QuotaBucket, UsageSnapshot } from "../../types/billing"
import { Spinner } from "../ui/Spinner"

function formatLimit(limit: number | null): string {
  return limit == null ? "Unlimited" : String(limit)
}

function QuotaBar({ label, bucket }: { label: string; bucket: QuotaBucket }) {
  const unlimited = bucket.limit == null
  let pct = 0
  if (!unlimited) {
    const limit = bucket.limit as number
    pct = limit === 0 ? 100 : Math.min(100, Math.round((bucket.used / limit) * 100))
  }
  const nearLimit = !unlimited && pct >= 80

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="tabular-nums text-slate-500 dark:text-slate-400">
          {bucket.used} / {formatLimit(bucket.limit)}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        {!unlimited && (
          <div
            className={`h-full rounded-full transition-all ${
              nearLimit ? "bg-amber-500" : "bg-brand-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        )}
        {unlimited && <div className="h-full w-1/3 rounded-full bg-emerald-500/70" />}
      </div>
    </div>
  )
}

export function PlanUsageCard({ className = "" }: { className?: string }) {
  const [usage, setUsage] = useState<UsageSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    billingService
      .getMyUsage()
      .then((data) => {
        if (!cancelled) {
          setUsage(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Couldn't load plan usage.")
        }
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
      <div className={`card-surface flex items-center justify-center p-8 ${className}`}>
        <Spinner />
      </div>
    )
  }

  if (error || !usage) {
    return (
      <div className={`card-surface p-5 text-sm text-slate-500 ${className}`}>
        {error ?? "No usage data"}
      </div>
    )
  }

  const planName = usage.plan?.name ?? "Free"

  return (
    <div className={`card-surface p-5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Your plan</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {planName}
              {usage.plan?.is_default ? " · default" : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => undefined}
          disabled
          title="Self-serve upgrades coming soon"
          className="cursor-not-allowed rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-400 dark:border-white/10"
        >
          Upgrade · Coming soon
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <QuotaBar label="Journals today" bucket={usage.journals_today} />
        <QuotaBar label="Analyze today" bucket={usage.analyze_today} />
        <QuotaBar label="Weekly summaries" bucket={usage.weekly_summaries_this_week} />
        <QuotaBar label="Insights this week" bucket={usage.insights_this_week} />
      </div>
    </div>
  )
}
