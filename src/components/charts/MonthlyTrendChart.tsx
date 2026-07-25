import type { PeriodAnalytics } from "../../types/analytics"

const SEGMENT_STYLES = [
  { key: "positive" as const, bar: "bg-emerald-500 dark:bg-emerald-400", label: "Positive" },
  { key: "neutral" as const, bar: "bg-slate-400 dark:bg-slate-500", label: "Neutral" },
  { key: "negative" as const, bar: "bg-rose-500 dark:bg-rose-400", label: "Negative" },
]

function formatMonth(period: string): string {
  const [year, month] = period.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, 1).toLocaleDateString(undefined, { month: "short" })
}

export function MonthlyTrendChart({ months }: { months: PeriodAnalytics[] }) {
  const totals = months.map(
    (m) => m.sentiment_counts.positive + m.sentiment_counts.neutral + m.sentiment_counts.negative,
  )
  const max = Math.max(1, ...totals)
  const hasData = totals.some((t) => t > 0)

  if (!hasData) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No entries recorded for this year yet.</p>
  }

  return (
    <div>
      <div className="flex h-48 items-stretch gap-2 border-b border-slate-200 dark:border-white/10 sm:gap-3">
        {months.map((month, i) => {
          const total = totals[i]
          const heightPct = (total / max) * 100
          return (
            <div key={month.period} className="flex flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{total || ""}</span>
              <div
                className="flex w-full max-w-9 flex-col-reverse overflow-hidden rounded-t-[4px]"
                style={{ height: `${Math.max(heightPct, total > 0 ? 3 : 0)}%` }}
                title={`${formatMonth(month.period)}: ${total} ${total === 1 ? "entry" : "entries"}`}
              >
                {SEGMENT_STYLES.map((segment, si) => {
                  const count = month.sentiment_counts[segment.key]
                  if (count === 0) return null
                  return (
                    <div
                      key={segment.key}
                      className={`w-full ${segment.bar} ${si > 0 ? "mb-[2px]" : ""}`}
                      style={{ height: `${(count / total) * 100}%` }}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-between px-0.5">
        {months.map((month) => (
          <span key={month.period} className="flex-1 text-center text-xs text-slate-400 dark:text-slate-500">
            {formatMonth(month.period)}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {SEGMENT_STYLES.map((segment) => (
          <div key={segment.key} className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${segment.bar}`} />
            <span className="text-slate-600 dark:text-slate-400">{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
