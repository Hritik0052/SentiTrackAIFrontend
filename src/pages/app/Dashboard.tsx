import { useEffect, useState } from "react"
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
import { Button } from "../../components/ui/Button"
import { ApiError } from "../../lib/apiClient"
import { analyticsService } from "../../services/analyticsService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type {
  DashboardAnalytics,
  MonthlyAnalytics,
  MoodDistribution,
  YearlyAnalytics,
} from "../../types/analytics"

const CURRENT_YEAR = new Date().getFullYear()

export default function DashboardPage() {
  usePageMeta("Dashboard — SentiTrack AI")

  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null)
  const [mood, setMood] = useState<MoodDistribution | null>(null)
  const [monthly, setMonthly] = useState<MonthlyAnalytics | null>(null)
  const [yearly, setYearly] = useState<YearlyAnalytics | null>(null)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Your journaling activity and mood trends at a glance.
        </p>

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
