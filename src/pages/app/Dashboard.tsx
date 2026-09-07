import { useEffect, useMemo, useState } from "react"
import {
  Award,
  BookOpen,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  Gauge,
  Sparkles,
} from "lucide-react"
import { Container } from "../../components/ui/Container"
import { EmptyState } from "../../components/ui/EmptyState"
import { Spinner } from "../../components/ui/Spinner"
import { StatTile } from "../../components/charts/StatTile"
import { SentimentSplitBar } from "../../components/charts/SentimentSplitBar"
import { RankedBarList } from "../../components/charts/RankedBarList"
import { MonthlyTrendChart } from "../../components/charts/MonthlyTrendChart"
import {
  MoodTrendLineChart,
  type TrendSeriesMode,
} from "../../components/charts/MoodTrendLineChart"
import { EmotionAreaChart } from "../../components/charts/EmotionAreaChart"
import { Button } from "../../components/ui/Button"
import { ExportButton } from "../../components/ui/ExportButton"
import { ApiError } from "../../lib/apiClient"
import { analyticsService } from "../../services/analyticsService"
import { exportService } from "../../services/exportService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type {
  DashboardAnalytics,
  MonthlyAnalytics,
  MoodDistribution,
  MoodTrends,
  YearlyAnalytics,
} from "../../types/analytics"

const CURRENT_YEAR = new Date().getFullYear()

function toIsoDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function startOfWeek(d: Date): Date {
  const copy = new Date(d)
  const day = (copy.getDay() + 6) % 7 // Monday=0
  copy.setDate(copy.getDate() - day)
  copy.setHours(12, 0, 0, 0)
  return copy
}

function shiftAnchor(anchor: Date, period: "week" | "month", direction: -1 | 1): Date {
  const next = new Date(anchor)
  if (period === "week") {
    next.setDate(next.getDate() + direction * 7)
  } else {
    next.setMonth(next.getMonth() + direction)
  }
  return next
}

function formatRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  const from = new Date(`${start}T00:00:00`).toLocaleDateString(undefined, opts)
  const to = new Date(`${end}T00:00:00`).toLocaleDateString(undefined, opts)
  return `${from} – ${to}`
}

export default function DashboardPage() {
  usePageMeta("Dashboard — SentiTrack AI")

  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null)
  const [mood, setMood] = useState<MoodDistribution | null>(null)
  const [monthly, setMonthly] = useState<MonthlyAnalytics | null>(null)
  const [yearly, setYearly] = useState<YearlyAnalytics | null>(null)
  const [moodTrends, setMoodTrends] = useState<MoodTrends | null>(null)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [trendPeriod, setTrendPeriod] = useState<"week" | "month">("week")
  const [trendAnchor, setTrendAnchor] = useState(() => startOfWeek(new Date()))
  const [seriesMode, setSeriesMode] = useState<TrendSeriesMode>("emotions")
  const [isLoading, setIsLoading] = useState(true)
  const [trendsLoading, setTrendsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trendsError, setTrendsError] = useState<string | null>(null)

  const exportMonth = useMemo(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const [dashboardData, moodData, monthlyData, yearlyData] = await Promise.all([
          analyticsService.dashboard(),
          analyticsService.moodDistribution(),
          analyticsService.monthly(year),
          analyticsService.yearly(),
        ])
        if (cancelled) return
        setDashboard(dashboardData)
        setMood(moodData)
        setMonthly(monthlyData)
        setYearly(yearlyData)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Couldn't load your analytics.")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [year])

  useEffect(() => {
    let cancelled = false

    async function loadTrends() {
      setTrendsLoading(true)
      setTrendsError(null)
      try {
        const data = await analyticsService.moodTrends({
          period: trendPeriod,
          anchor: toIsoDate(trendAnchor),
          top_emotions: 5,
        })
        if (!cancelled) setMoodTrends(data)
      } catch (err) {
        if (!cancelled) {
          setTrendsError(err instanceof ApiError ? err.message : "Couldn't load mood trends.")
          setMoodTrends(null)
        }
      } finally {
        if (!cancelled) setTrendsLoading(false)
      }
    }

    loadTrends()
    return () => {
      cancelled = true
    }
  }, [trendPeriod, trendAnchor])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !dashboard || !mood || !monthly || !yearly) {
    return (
      <Container className="py-16">
        <EmptyState icon={Gauge} title="Couldn't load your dashboard" description={error ?? undefined} />
      </Container>
    )
  }

  const hasEntries = dashboard.total_entries > 0
  const nextAnchor = shiftAnchor(trendAnchor, trendPeriod, 1)
  const nextPeriodStart =
    trendPeriod === "week"
      ? startOfWeek(nextAnchor)
      : new Date(nextAnchor.getFullYear(), nextAnchor.getMonth(), 1)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const canGoNext = nextPeriodStart <= todayStart

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Your journaling activity and mood trends at a glance.
            </p>
          </div>
          {hasEntries && (
            <ExportButton
              label="Export this month"
              onExport={() => exportService.monthlySummary(exportMonth)}
            />
          )}
        </div>

        {!hasEntries ? (
          <div className="mt-8">
            <EmptyState
              icon={BookOpen}
              title="No analytics yet"
              description="Write and analyze a few journal entries to see your mood trends here."
              action={
                <Button to="/app/journals/new" icon={<Sparkles className="h-4 w-4" />}>
                  Write your first entry
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile icon={BookOpen} label="Total entries" value={dashboard.total_entries} />
              <StatTile
                icon={Sparkles}
                label="Analyzed"
                value={dashboard.analyzed_entries}
                hint={`${Math.round(dashboard.average_confidence * 100)}% avg. confidence`}
              />
              <StatTile icon={Flame} label="Current streak" value={`${dashboard.current_streak}d`} />
              <StatTile icon={Award} label="Longest streak" value={`${dashboard.longest_streak}d`} />
              <StatTile icon={CalendarCheck} label="This week" value={dashboard.entries_this_week} />
              <StatTile icon={CalendarCheck} label="This month" value={dashboard.entries_this_month} />
              <StatTile
                icon={Gauge}
                label="Common mood"
                value={dashboard.most_common_mood ?? "—"}
                hint="Most frequent mood"
              />
              <StatTile
                icon={Gauge}
                label="Common emotion"
                value={dashboard.most_common_emotion ?? "—"}
                hint="Most frequent emotion"
              />
            </div>

            <div className="card-surface mt-6 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Mood trends</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Overlapping lines for sentiment and top emotions
                    {moodTrends ? ` · ${formatRange(moodTrends.start, moodTrends.end)}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-full border border-slate-200 p-0.5 dark:border-white/10">
                    {(["week", "month"] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setTrendPeriod(period)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                          trendPeriod === period
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        }`}
                      >
                        {period === "week" ? "This week" : "This month"}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setTrendAnchor((d) => shiftAnchor(d, trendPeriod, -1))}
                      aria-label="Previous period"
                      className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendAnchor((d) => shiftAnchor(d, trendPeriod, 1))}
                      disabled={!canGoNext}
                      aria-label="Next period"
                      className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex rounded-full border border-slate-200 p-0.5 dark:border-white/10">
                    {(
                      [
                        ["emotions", "Emotions"],
                        ["sentiment", "Sentiment"],
                        ["both", "Both"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSeriesMode(value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          seriesMode === value
                            ? "bg-brand-600 text-white"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                {trendsLoading && (
                  <div className="flex justify-center py-16">
                    <Spinner />
                  </div>
                )}
                {!trendsLoading && trendsError && (
                  <p className="text-sm text-rose-600 dark:text-rose-400">{trendsError}</p>
                )}
                {!trendsLoading && !trendsError && moodTrends && (
                  <div className="grid gap-8 lg:grid-cols-2">
                    <MoodTrendLineChart trends={moodTrends} mode={seriesMode} />
                    <EmotionAreaChart trends={moodTrends} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="card-surface p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Sentiment breakdown
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Across {mood.total_analyzed} analyzed {mood.total_analyzed === 1 ? "entry" : "entries"}
                </p>
                <div className="mt-6">
                  <SentimentSplitBar counts={mood.sentiment_counts} />
                </div>
              </div>

              <div className="card-surface p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top moods</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your most common moods</p>
                <div className="mt-6">
                  <RankedBarList items={mood.moods} />
                </div>
              </div>

              <div className="card-surface p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top emotions</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your most common emotions</p>
                <div className="mt-6">
                  <RankedBarList items={mood.emotions} />
                </div>
              </div>

              <div className="card-surface p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly trend</h2>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setYear((y) => y - 1)}
                      aria-label="Previous year"
                      className="focus-ring flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                      {year}
                    </span>
                    <button
                      type="button"
                      onClick={() => setYear((y) => Math.min(y + 1, CURRENT_YEAR))}
                      disabled={year >= CURRENT_YEAR}
                      aria-label="Next year"
                      className="focus-ring flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <MonthlyTrendChart months={monthly.months} />
                </div>
              </div>
            </div>

            {yearly.years.length > 0 && (
              <div className="card-surface mt-6 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Yearly overview</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Entries and sentiment split by year
                </p>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-white/10">
                        <th className="pb-3 pr-4 font-semibold">Year</th>
                        <th className="pb-3 pr-4 font-semibold">Entries</th>
                        <th className="pb-3 pr-4 font-semibold">Analyzed</th>
                        <th className="pb-3 pr-4 font-semibold">Positive</th>
                        <th className="pb-3 pr-4 font-semibold">Neutral</th>
                        <th className="pb-3 pr-4 font-semibold">Negative</th>
                        <th className="pb-3 pr-4 font-semibold">Avg. confidence</th>
                        <th className="pb-3 font-semibold">Top emotion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearly.years.map((row) => (
                        <tr
                          key={row.period}
                          className="border-b border-slate-100 text-slate-700 last:border-0 dark:border-white/5 dark:text-slate-300"
                        >
                          <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">
                            {row.period}
                          </td>
                          <td className="py-3 pr-4 tabular-nums">{row.entries}</td>
                          <td className="py-3 pr-4 tabular-nums">{row.analyzed}</td>
                          <td className="py-3 pr-4 tabular-nums text-emerald-600 dark:text-emerald-400">
                            {row.sentiment_counts.positive}
                          </td>
                          <td className="py-3 pr-4 tabular-nums text-slate-500 dark:text-slate-400">
                            {row.sentiment_counts.neutral}
                          </td>
                          <td className="py-3 pr-4 tabular-nums text-rose-600 dark:text-rose-400">
                            {row.sentiment_counts.negative}
                          </td>
                          <td className="py-3 pr-4 tabular-nums">
                            {Math.round(row.average_confidence * 100)}%
                          </td>
                          <td className="py-3 capitalize">{row.most_common_emotion ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  )
}
