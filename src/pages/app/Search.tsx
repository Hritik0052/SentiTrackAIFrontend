import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Search as SearchIcon, SearchX } from "lucide-react"
import { Container } from "../../components/ui/Container"
import { EmptyState } from "../../components/ui/EmptyState"
import { Pagination } from "../../components/ui/Pagination"
import { SentimentBadge } from "../../components/ui/SentimentBadge"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { searchService } from "../../services/searchService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { PaginatedResponse } from "../../types/journal"
import type { SearchParams, SearchResultItem } from "../../types/search"

const PAGE_SIZE = 10

interface FilterState {
  q: string
  date_from: string
  date_to: string
  mood: string
  emotion: string
  sentiment: "" | "positive" | "neutral" | "negative"
}

const EMPTY_FILTERS: FilterState = { q: "", date_from: "", date_to: "", mood: "", emotion: "", sentiment: "" }

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function excerpt(content: string): string {
  const trimmed = content.trim()
  return trimmed.length > 160 ? `${trimmed.slice(0, 160)}…` : trimmed
}

const selectClass =
  "rounded-xl border border-slate-200 bg-white/60 px-3 py-2.5 text-sm text-slate-900 transition-colors focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"

export default function SearchPage() {
  usePageMeta("Search — SentiTrack AI")

  const [form, setForm] = useState<FilterState>(EMPTY_FILTERS)
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<PaginatedResponse<SearchResultItem> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasFilters = Object.values(filters).some(Boolean)

  useEffect(() => {
    const handle = setTimeout(() => {
      setFilters(form)
      setPage(1)
    }, 400)
    return () => clearTimeout(handle)
  }, [form])

  useEffect(() => {
    if (!Object.values(filters).some(Boolean)) return

    let cancelled = false

    async function run() {
      setIsLoading(true)
      setError(null)
      try {
        const params: SearchParams = {
          page,
          page_size: PAGE_SIZE,
          sort_by: "created_at",
          order: "desc",
          q: filters.q || undefined,
          date_from: filters.date_from || undefined,
          date_to: filters.date_to || undefined,
          mood: filters.mood || undefined,
          emotion: filters.emotion || undefined,
          sentiment: filters.sentiment || undefined,
        }
        const result = await searchService.search(params)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Search failed. Please try again.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [filters, page])

  function update<K extends keyof FilterState>(field: K, value: FilterState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Search
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Find entries by keyword, mood, emotion, sentiment, or date.
        </p>

        <div className="card-surface mt-6 p-5">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={form.q}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Search title or content..."
              className="w-full rounded-xl border border-slate-200 bg-white/60 py-2.5 pl-11 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              type="date"
              value={form.date_from}
              onChange={(e) => update("date_from", e.target.value)}
              className={selectClass}
              aria-label="From date"
            />
            <input
              type="date"
              value={form.date_to}
              onChange={(e) => update("date_to", e.target.value)}
              className={selectClass}
              aria-label="To date"
            />
            <input
              type="text"
              value={form.mood}
              onChange={(e) => update("mood", e.target.value)}
              placeholder="Mood"
              className={selectClass}
            />
            <input
              type="text"
              value={form.emotion}
              onChange={(e) => update("emotion", e.target.value)}
              placeholder="Emotion"
              className={selectClass}
            />
            <select
              value={form.sentiment}
              onChange={(e) => update("sentiment", e.target.value as FilterState["sentiment"])}
              className={selectClass}
            >
              <option value="">Any sentiment</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && !hasFilters && (
            <EmptyState
              icon={SearchIcon}
              title="Search your journal"
              description="Use the filters above to find entries by keyword, mood, emotion, sentiment, or date range."
            />
          )}

          {!isLoading && hasFilters && error && (
            <EmptyState icon={SearchX} title="Search failed" description={error} />
          )}

          {!isLoading && hasFilters && !error && data && data.items.length === 0 && (
            <EmptyState
              icon={SearchX}
              title="No matching entries"
              description="Try broadening your filters or using a different keyword."
            />
          )}

          {!isLoading && hasFilters && !error && data && data.items.length > 0 && (
            <>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                {data.total} {data.total === 1 ? "result" : "results"}
              </p>
              <div className="space-y-4">
                {data.items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/app/journals/${item.id}`}
                    className="card-surface flex flex-col gap-3 p-5 transition-shadow hover:shadow-xl hover:shadow-brand-500/10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                        {item.title?.trim() || "Untitled entry"}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {excerpt(item.content)}
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-400">{formatDate(item.created_at)}</p>
                    </div>
                    {item.sentiment && (
                      <SentimentBadge sentiment={item.sentiment.sentiment} className="shrink-0 self-start" />
                    )}
                  </Link>
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
