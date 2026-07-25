import type { LabelCount } from "../../types/analytics"

export function RankedBarList({ items, limit = 6 }: { items: LabelCount[]; limit?: number }) {
  const top = [...items].sort((a, b) => b.count - a.count).slice(0, limit)
  const max = top.length > 0 ? Math.max(...top.map((i) => i.count)) : 0

  if (top.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Not enough data yet.</p>
  }

  return (
    <div className="space-y-3">
      {top.map((item) => {
        const pct = max > 0 ? (item.count / max) * 100 : 0
        return (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
              {item.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
              <div
                className="h-full rounded-full bg-brand-500 dark:bg-brand-400"
                style={{ width: `${Math.max(pct, 4)}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-sm font-medium text-slate-500 dark:text-slate-400">
              {item.count}
            </span>
          </div>
        )
      })}
    </div>
  )
}
