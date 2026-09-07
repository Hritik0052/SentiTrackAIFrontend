import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { MoodTrends } from "../../types/analytics"

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "#10b981",
  neutral: "#94a3b8",
  negative: "#f43f5e",
}

const EMOTION_PALETTE = ["#0ea5e9", "#f59e0b", "#8b5cf6", "#14b8a6", "#ef4444", "#6366f1", "#ec4899", "#84cc16"]

export type TrendSeriesMode = "sentiment" | "emotions" | "both"

function formatTick(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function buildChartRows(trends: MoodTrends) {
  return trends.buckets.map((bucket) => {
    const row: Record<string, string | number> = {
      date: bucket.date,
      label: formatTick(bucket.date),
    }
    for (const key of trends.series.sentiment) {
      row[key] = bucket.sentiment[key] ?? 0
    }
    for (const key of trends.series.emotions) {
      row[key] = bucket.emotions[key] ?? 0
    }
    return row
  })
}

export function MoodTrendLineChart({
  trends,
  mode = "emotions",
}: {
  trends: MoodTrends
  mode?: TrendSeriesMode
}) {
  const showSentiment = mode === "sentiment" || mode === "both"
  const showEmotions = mode === "emotions" || mode === "both"
  const hasSeries =
    (showSentiment && trends.series.sentiment.length > 0) ||
    (showEmotions && trends.series.emotions.length > 0)

  if (!hasSeries || trends.totals.analyzed === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No analyzed entries in this range yet. Write and analyze journals to see overlapping mood lines.
      </p>
    )
  }

  const data = buildChartRows(trends)

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
          {showSentiment &&
            trends.series.sentiment.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={SENTIMENT_COLORS[key] ?? "#64748b"}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          {showEmotions &&
            trends.series.emotions.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={EMOTION_PALETTE[index % EMOTION_PALETTE.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
