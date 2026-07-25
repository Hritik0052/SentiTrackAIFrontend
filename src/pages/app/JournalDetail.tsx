import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pencil, Save, Sparkles, Trash2, X } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { SentimentBadge } from "../../components/ui/SentimentBadge"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { journalService } from "../../services/journalService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { Journal, Sentiment } from "../../types/journal"

const CONTENT_MAX = 10000
const TITLE_MAX = 200

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function JournalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const journalId = Number(id)
  const navigate = useNavigate()

  const [journal, setJournal] = useState<Journal | null>(null)
  const [sentiment, setSentiment] = useState<Sentiment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [analyzing, setAnalyzing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  usePageMeta(journal ? `${journal.title?.trim() || "Untitled entry"} — SentiTrack AI` : "Journal Entry — SentiTrack AI")

  useEffect(() => {
    if (!Number.isFinite(journalId)) return
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const [journalData, sentimentData] = await Promise.all([
          journalService.get(journalId),
          journalService.getSentiment(journalId),
        ])
        if (cancelled) return
        setJournal(journalData)
        setTitle(journalData.title ?? "")
        setContent(journalData.content)
        setSentiment(sentimentData)
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Couldn't load this journal entry.")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [journalId])

  async function handleSave() {
    if (!journal) return
    if (!content.trim()) {
      setSaveError("Content can't be empty.")
      return
    }
    setSaveError(null)
    setSaving(true)
    try {
      const updated = await journalService.update(journal.id, {
        title: title.trim() || undefined,
        content: content.trim(),
      })
      setJournal(updated)
      setIsEditing(false)
      toast.success("Entry updated")
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Couldn't save your changes.")
    } finally {
      setSaving(false)
    }
  }

  async function handleAnalyze() {
    if (!journal) return
    setAnalyzing(true)
    try {
      const result = await journalService.analyze(journal.id)
      setSentiment(result)
      toast.success("Analysis complete")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "AI analysis failed. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleDelete() {
    if (!journal) return
    setDeleting(true)
    try {
      await journalService.remove(journal.id)
      toast.success("Entry deleted")
      navigate("/app/journals", { replace: true })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't delete this entry.")
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (loadError || !journal) {
    return (
      <Container className="py-16 text-center">
        <p className="text-slate-600 dark:text-slate-400">{loadError ?? "Entry not found."}</p>
        <Button to="/app/journals" variant="secondary" className="mt-6">
          Back to journals
        </Button>
      </Container>
    )
  }

  const inputBase =
    "w-full rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"

  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/app/journals")}
          className="focus-ring mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to journals
        </button>

        <div className="card-surface p-6 sm:p-8">
          {!isEditing ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {journal.title?.trim() || "Untitled entry"}
                  </h1>
                  <p className="mt-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                    {formatDateTime(journal.created_at)}
                    {journal.updated_at !== journal.created_at && " · edited"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit entry"
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-slate-300"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    aria-label="Delete entry"
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-red-400 hover:text-red-600 dark:border-white/10 dark:text-slate-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {journal.content}
              </p>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  maxLength={TITLE_MAX}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="mt-5">
                <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Content
                </label>
                <textarea
                  id="content"
                  rows={12}
                  value={content}
                  maxLength={CONTENT_MAX}
                  onChange={(e) => setContent(e.target.value)}
                  className={`${inputBase} resize-none leading-relaxed`}
                />
              </div>

              {saveError && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {saveError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  type="button"
                  icon={<X className="h-4 w-4" />}
                  onClick={() => {
                    setIsEditing(false)
                    setTitle(journal.title ?? "")
                    setContent(journal.content)
                    setSaveError(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" disabled={saving} icon={<Save className="h-4 w-4" />} onClick={handleSave}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="card-surface mt-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Sentiment analysis</h2>
              <Button
                variant="secondary"
                onClick={handleAnalyze}
                disabled={analyzing}
                icon={<Sparkles className="h-4 w-4" />}
              >
                {analyzing ? "Analyzing..." : sentiment ? "Re-analyze" : "Analyze"}
              </Button>
            </div>

            {analyzing && (
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <Spinner size="sm" />
                Reading your entry and detecting mood...
              </div>
            )}

            {!analyzing && sentiment && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Sentiment</p>
                  <SentimentBadge sentiment={sentiment.sentiment} className="mt-2" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Mood</p>
                  <p className="mt-2 text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {sentiment.mood}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Emotion</p>
                  <p className="mt-2 text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {sentiment.emotion}
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Confidence</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-brand"
                      style={{ width: `${Math.round(sentiment.confidence * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {Math.round(sentiment.confidence * 100)}% confident
                  </p>
                </div>
              </div>
            )}

            {!analyzing && !sentiment && (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                This entry hasn't been analyzed yet. Run analysis to see its mood, emotion, and sentiment.
              </p>
            )}
          </div>
        )}
      </Container>

      {confirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="card-surface w-full max-w-sm bg-white p-6 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete this entry?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This action can't be undone. The entry and its analysis will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
