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
import type { DashboardAnalytics, MonthlyAnalytics, MoodDistribution } from "../../types/analytics"

const CURRENT_YEAR = new Date().getFullYear()

export default function DashboardPage() {
  usePageMeta("Dashboard — SentiTrack AI")

  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null)
  const [mood, setMood] = useState<MoodDistribution | null>(null)
  const [monthly, setMonthly] = useState<MonthlyAnalytics | null>(null)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const [dashboardData, moodData, monthlyData] = await Promise.all([
          analyticsService.dashboard(),
          analyticsService.moodDistribution(),
          analyticsService.monthly(year),
        ])
        if (cancelled) return
        setDashboard(dashboardData)
        setMood(moodData)
        setMonthly(monthlyData)
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

  if (error || !dashboard || !mood || !monthly) {
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
          </>
        )}
      </Container>
    </section>
  )
}
