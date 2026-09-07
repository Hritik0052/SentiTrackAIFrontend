import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { MoodTrends } from "../../types/analytics"

const EMOTION_PALETTE = ["#0ea5e9", "#f59e0b", "#8b5cf6", "#14b8a6", "#ef4444", "#6366f1", "#ec4899", "#84cc16"]

function formatTick(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function EmotionAreaChart({ trends }: { trends: MoodTrends }) {
  if (trends.series.emotions.length === 0 || trends.totals.analyzed === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Emotion area chart appears once analyzed entries include emotion labels.
      </p>
    )
  }

  const data = trends.buckets.map((bucket) => {
    const row: Record<string, string | number> = {
      date: bucket.date,
      label: formatTick(bucket.date),
    }
    for (const key of trends.series.emotions) {
      row[key] = bucket.emotions[key] ?? 0
    }
    return row
  })

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-white/10" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            className="fill-slate-500"
            interval="preserveStartEnd"
          />
          <YAxis allowDecimals={false} width={28} tick={{ fontSize: 12 }} className="fill-slate-500" />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.35)",
              background: "rgba(255,255,255,0.96)",
            }}
          />
          <Legend />
          {trends.series.emotions.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stackId="emotions"
              stroke={EMOTION_PALETTE[index % EMOTION_PALETTE.length]}
              fill={EMOTION_PALETTE[index % EMOTION_PALETTE.length]}
              fillOpacity={0.35}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
