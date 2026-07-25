import { Frown, Meh, Smile } from "lucide-react"
import type { SentimentLabel } from "../../types/journal"

const STYLES: Record<SentimentLabel, string> = {
  positive:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  neutral:
    "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300 border-slate-200 dark:border-white/10",
  negative:
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
}

const ICONS: Record<SentimentLabel, typeof Smile> = {
  positive: Smile,
  neutral: Meh,
  negative: Frown,
}

export function SentimentBadge({
  sentiment,
  className = "",
}: {
  sentiment: SentimentLabel
  className?: string
}) {
  const Icon = ICONS[sentiment]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${STYLES[sentiment]} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {sentiment}
    </span>
  )
}
