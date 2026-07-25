import { Frown, Meh, Smile } from "lucide-react"
import type { SentimentCounts } from "../../types/analytics"

const SEGMENTS: {
  key: keyof SentimentCounts
  label: string
  icon: typeof Smile
  bar: string
  dot: string
  text: string
}[] = [
  {
    key: "positive",
    label: "Positive",
    icon: Smile,
    bar: "bg-emerald-500 dark:bg-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  {
    key: "neutral",
    label: "Neutral",
    icon: Meh,
    bar: "bg-slate-400 dark:bg-slate-500",
    dot: "bg-slate-400 dark:bg-slate-500",
    text: "text-slate-600 dark:text-slate-400",
  },
  {
    key: "negative",
    label: "Negative",
    icon: Frown,
    bar: "bg-rose-500 dark:bg-rose-400",
    dot: "bg-rose-500 dark:bg-rose-400",
    text: "text-rose-700 dark:text-rose-400",
  },
]

export function SentimentSplitBar({ counts }: { counts: SentimentCounts }) {
  const total = counts.positive + counts.neutral + counts.negative

  if (total === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No analyzed entries yet.</p>
  }

  return (
    <div>
      <div className="flex h-6 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
        {SEGMENTS.map((segment, i) => {
          const count = counts[segment.key]
          if (count === 0) return null
          const pct = (count / total) * 100
          return (
            <div
              key={segment.key}
              className={`h-full ${segment.bar} ${i > 0 ? "ml-[2px]" : ""}`}
              style={{ width: `${pct}%` }}
              title={`${segment.label}: ${count} (${Math.round(pct)}%)`}
            />
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {SEGMENTS.map((segment) => {
          const count = counts[segment.key]
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={segment.key} className="flex items-center gap-2 text-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${segment.dot}`} />
              <segment.icon className={`h-4 w-4 ${segment.text}`} />
              <span className="font-medium text-slate-700 dark:text-slate-300">{segment.label}</span>
              <span className="text-slate-400 dark:text-slate-500">
                {count} · {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
