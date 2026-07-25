import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { ApiError } from "../../lib/apiClient"
import { journalService } from "../../services/journalService"
import { usePageMeta } from "../../hooks/usePageMeta"

const CONTENT_MAX = 10000
const TITLE_MAX = 200

export default function JournalEditorPage() {
  usePageMeta("New Entry — SentiTrack AI")

  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!content.trim()) {
      setError("Write something before saving.")
      return
    }

    setSubmitting(true)
    try {
      const journal = await journalService.create({
        title: title.trim() || undefined,
        content: content.trim(),
      })
      toast.success("Entry saved")
      navigate(`/app/journals/${journal.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save your entry. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="focus-ring mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          New Entry
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Write freely — you can analyze the sentiment once you save.
        </p>

        <form onSubmit={handleSubmit} noValidate className="card-surface mt-6 p-6 sm:p-8">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Title <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title"
              className="w-full rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                What's on your mind?
              </label>
              <span className="text-xs text-slate-400">
                {content.length}/{CONTENT_MAX}
              </span>
            </div>
            <textarea
              id="content"
              rows={12}
              value={content}
              maxLength={CONTENT_MAX}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Today I felt..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-sm leading-relaxed text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} icon={<Save className="h-4 w-4" />}>
              {submitting ? "Saving..." : "Save entry"}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  )
}
