import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, Plus, Search } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { EmptyState } from "../../components/ui/EmptyState"
import { Pagination } from "../../components/ui/Pagination"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { journalService } from "../../services/journalService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { Journal, PaginatedResponse } from "../../types/journal"

const PAGE_SIZE = 12

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function excerpt(content: string): string {
  const trimmed = content.trim()
  return trimmed.length > 160 ? `${trimmed.slice(0, 160)}…` : trimmed
}

export default function JournalListPage() {
  usePageMeta("Your Journals — SentiTrack AI")

  const [data, setData] = useState<PaginatedResponse<Journal> | null>(null)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryTick, setRetryTick] = useState(0)

  useEffect(() => {
    const handle = setTimeout(() => {
      setQuery(searchInput.trim())
      setPage(1)
    }, 350)
    return () => clearTimeout(handle)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const result = await journalService.list({
          page,
          page_size: PAGE_SIZE,
          sort_by: "created_at",
          order: "desc",
          q: query || undefined,
        })
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load your journals.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [page, query, retryTick])

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Your Journals
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {data ? `${data.total} ${data.total === 1 ? "entry" : "entries"}` : "Loading your entries..."}
            </p>
          </div>
          <Button to="/app/journals/new" icon={<Plus className="h-4 w-4" />}>
            New Entry
          </Button>
        </div>

        <div className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search your entries..."
            className="w-full rounded-xl border border-slate-200 bg-white/60 py-2.5 pl-11 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && error && (
            <EmptyState
              icon={BookOpen}
              title="Couldn't load your journals"
              description={error}
              action={
                <Button variant="secondary" onClick={() => setRetryTick((t) => t + 1)}>
                  Try again
                </Button>
              }
            />
          )}

          {!isLoading && !error && data && data.items.length === 0 && query && (
            <EmptyState
              icon={Search}
              title="No entries match your search"
              description="Try a different keyword, or clear the search to see all your entries."
            />
          )}

          {!isLoading && !error && data && data.items.length === 0 && !query && (
            <EmptyState
              icon={BookOpen}
              title="Your journal is empty"
              description="Write your first entry to start tracking your mood and thoughts over time."
              action={
                <Button to="/app/journals/new" icon={<Plus className="h-4 w-4" />}>
                  Write your first entry
                </Button>
              }
            />
          )}

          {!isLoading && !error && data && data.items.length > 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((journal) => (
                  <Link
                    key={journal.id}
                    to={`/app/journals/${journal.id}`}
                    className="card-surface group flex flex-col p-5 transition-shadow hover:shadow-xl hover:shadow-brand-500/10"
                  >
                    <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-white">
                      {journal.title?.trim() || "Untitled entry"}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {excerpt(journal.content)}
                    </p>
                    <p className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                      {formatDate(journal.created_at)}
                    </p>
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
