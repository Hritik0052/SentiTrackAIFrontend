import { useEffect, useState } from "react"
import { Lightbulb, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { EmptyState } from "../../components/ui/EmptyState"
import { Pagination } from "../../components/ui/Pagination"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { insightsService } from "../../services/insightsService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { Insight } from "../../types/insights"
import type { PaginatedResponse } from "../../types/journal"

const PAGE_SIZE = 20

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

export default function InsightsPage() {
  usePageMeta("Insights — SentiTrack AI")

  const [data, setData] = useState<PaginatedResponse<Insight> | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const result = await insightsService.list(page, PAGE_SIZE)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load your insights.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page])

  async function handleGenerate() {
    setGenerating(true)
    try {
      await insightsService.generate()
      const result = await insightsService.list(1, PAGE_SIZE)
      setPage(1)
      setData(result)
      toast.success("New insights generated")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't generate insights. Please try again.")
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
              Insights
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Patterns AI notices across your journaling history.
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={generating} icon={<Sparkles className="h-4 w-4" />}>
            {generating ? "Generating..." : "Generate insights"}
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
              Looking for patterns across your entries...
            </div>
          )}

          {!isLoading && error && (
            <EmptyState icon={Lightbulb} title="Couldn't load your insights" description={error} />
          )}

          {!isLoading && !error && data && data.items.length === 0 && (
            <EmptyState
              icon={Lightbulb}
              title="No insights yet"
              description="Generate insights once you've written a few journal entries."
              action={
                <Button onClick={handleGenerate} disabled={generating} icon={<Sparkles className="h-4 w-4" />}>
                  Generate insights
                </Button>
              }
            />
          )}

          {!isLoading && !error && data && data.items.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.items.map((insight, i) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05 }}
                    className="card-surface p-5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-md shadow-brand-500/30">
                      <Lightbulb className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {insight.content}
                    </p>
                    <p className="mt-3 text-xs font-medium text-slate-400">{formatDate(insight.created_at)}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10">
                <Pagination page={data.page} totalPages={data.total_pages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  )
}
