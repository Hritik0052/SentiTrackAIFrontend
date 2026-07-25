import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, Mail, Save, Trash2, User as UserIcon } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { ApiError } from "../../lib/apiClient"
import { useAuth } from "../../hooks/useAuth"
import { userService } from "../../services/userService"
import { usePageMeta } from "../../hooks/usePageMeta"

export default function ProfilePage() {
  usePageMeta("Profile — SentiTrack AI")

  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!user) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const payload: { name?: string; email?: string; password?: string } = {}
    if (name.trim() && name.trim() !== user!.name) payload.name = name.trim()
    if (email.trim() && email.trim() !== user!.email) payload.email = email.trim()
    if (password) payload.password = password

    if (Object.keys(payload).length === 0) {
      toast("Nothing to update", { icon: "ℹ️" })
      return
    }

    setSaving(true)
    try {
      const updated = await userService.updateMe(payload)
      updateUser(updated)
      setPassword("")
      toast.success("Profile updated")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update your profile.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await userService.deleteMe()
      toast.success("Account deleted")
      await logout()
      navigate("/", { replace: true })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't delete your account.")
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  const inputBase =
    "w-full rounded-xl border border-slate-200 bg-white/60 py-3 pl-11 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"

  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage your account details.
        </p>

        <form onSubmit={handleSubmit} noValidate className="card-surface mt-6 p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Name
            </label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              New password <span className="font-normal text-slate-400">(leave blank to keep current)</span>
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputBase}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving} icon={<Save className="h-4 w-4" />}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-500/20 dark:bg-red-500/5">
          <h2 className="text-base font-semibold text-red-700 dark:text-red-400">Danger zone</h2>
          <p className="mt-1.5 text-sm text-red-600/90 dark:text-red-400/80">
            Deleting your account permanently removes all journals, analyses, and insights. This can't be
            undone.
          </p>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </div>
      </Container>

      {confirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="card-surface w-full max-w-sm bg-white p-6 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete your account?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This permanently deletes your account and all journal data. This action can't be undone.
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
                {deleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
