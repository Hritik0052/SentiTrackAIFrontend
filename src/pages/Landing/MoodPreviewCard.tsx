import { motion } from "framer-motion"
import { Sparkles, TrendingUp } from "lucide-react"

const SENTIMENTS = [
  { label: "Positive", value: 62, color: "bg-emerald-500" },
  { label: "Neutral", value: 26, color: "bg-amber-400" },
  { label: "Negative", value: 12, color: "bg-rose-500" },
]

export function MoodPreviewCard() {
  return (
    <div className="relative">
      <div className="card-surface animate-float p-6 shadow-xl shadow-brand-500/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Today</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              Morning reflection
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Content
          </span>
        </div>

        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-300">
          "Woke up early and went for a walk. Felt grateful and energized — a good start to the
          week ahead."
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400">
          <Sparkles className="h-4 w-4" />
          AI Analysis
        </div>

        <div className="mt-3 space-y-3">
          {SENTIMENTS.map((s, i) => (
            <div key={s.label}>
              <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{s.label}</span>
                <span>{s.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                  className={`h-full rounded-full ${s.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-surface absolute -bottom-6 -left-6 hidden items-center gap-3 p-4 shadow-lg sm:flex"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white">
          <TrendingUp className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Current streak</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">7 days</p>
        </div>
      </motion.div>
    </div>
  )
}
