import { useEffect, useState } from "react"
import { CalendarRange, ListChecks, RefreshCw, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { EmptyState } from "../../components/ui/EmptyState"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { summaryService } from "../../services/summaryService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { WeeklySummary } from "../../types/summary"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

export default function WeeklySummaryPage() {
  usePageMeta("Weekly Summaries — SentiTrack AI")

  const [summaries, setSummaries] = useState<WeeklySummary[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await summaryService.list()
        if (!cancelled) {
          setSummaries([...data].sort((a, b) => b.week_start.localeCompare(a.week_start)))
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load your summaries.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleGenerate() {
    setGenerating(true)
    try {
      const created = await summaryService.generate({})
      setSummaries((prev) => {
        const rest = (prev ?? []).filter((s) => s.week_start !== created.week_start)
        return [created, ...rest].sort((a, b) => b.week_start.localeCompare(a.week_start))
      })
      toast.success("Weekly summary generated")
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't generate a summary. Please try again.",
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Weekly Summaries
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              AI-generated recaps of your week, with gentle suggestions.
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            icon={generating ? undefined : <Sparkles className="h-4 w-4" />}
          >
            {generating ? "Generating..." : "Generate this week"}
          </Button>
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && generating && (
            <div className="card-surface mb-6 flex items-center gap-3 p-5 text-sm text-slate-500 dark:text-slate-400">
              <Spinner size="sm" />
              Reviewing your entries and writing a summary...
            </div>
          )}

          {!isLoading && error && (
            <EmptyState icon={RefreshCw} title="Couldn't load your summaries" description={error} />
          )}

          {!isLoading && !error && summaries && summaries.length === 0 && (
            <EmptyState
              icon={CalendarRange}
              title="No summaries yet"
              description="Generate your first weekly summary once you've journaled a bit this week."
            />
          )}

          {!isLoading && !error && summaries && summaries.length > 0 && (
            <div className="space-y-6">
              {summaries.map((summary) => (
                <div key={summary.id} className="card-surface p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                      <CalendarRange className="h-4 w-4 text-brand-500 dark:text-brand-400" />
                      {formatDate(summary.week_start)} – {formatDate(summary.week_end)}
                    </h2>
                    <span className="text-xs font-medium text-slate-400">
                      {summary.entry_count} {summary.entry_count === 1 ? "entry" : "entries"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {summary.summary}
                  </p>

                  {summary.suggestions.length > 0 && (
                    <div className="mt-5 border-t border-slate-200/70 pt-4 dark:border-white/10">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <ListChecks className="h-3.5 w-3.5" />
                        Suggestions
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {summary.suggestions.map((suggestion, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
