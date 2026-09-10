import { useCallback, useEffect, useState } from "react"
import { Search, Shield } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { adminService } from "../../services/adminService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { AdminUserDetail, AdminUserListItem, PlanSummary } from "../../types/billing"

function formatLimit(n: number | null | undefined): string {
  return n == null ? "∞" : String(n)
}

export default function AdminUsersPage() {
  usePageMeta("Admin — Users")

  const [q, setQ] = useState("")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<AdminUserListItem[]>([])
  const [total, setTotal] = useState(0)
  const [plans, setPlans] = useState<PlanSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<AdminUserDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const pageSize = 20

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.listUsers({ q: query || undefined, page, page_size: pageSize })
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load users.")
    } finally {
      setLoading(false)
    }
  }, [page, query])

  useEffect(() => {
    adminService.listPlans().then(setPlans).catch(() => undefined)
  }, [])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  async function openUser(userId: number) {
    setDetailLoading(true)
    try {
      const detail = await adminService.getUser(userId)
      setSelected(detail)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't load user.")
    } finally {
      setDetailLoading(false)
    }
  }

  async function saveUser(patch: {
    plan_id?: number
    is_admin?: boolean
    notes?: string
  }) {
    if (!selected) return
    setSaving(true)
    try {
      const updated = await adminService.updateUser(selected.id, patch)
      setSelected(updated)
      toast.success("User updated")
      await loadUsers()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update user.")
    } finally {
      setSaving(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Users</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Search, assign plans, and toggle admin access.
      </p>

      <form
        className="mt-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          setPage(1)
          setQuery(q.trim())
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by email or name"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {items.map((user) => (
                <tr key={user.id} className="bg-white dark:bg-slate-900/40">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">
                    {user.plan?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {user.is_admin ? (
                      <span className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400">
                        <Shield className="h-3.5 w-3.5" /> Admin
                      </span>
                    ) : (
                      <span className="text-slate-400">Member</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="secondary" onClick={() => openUser(user.id)}>
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {page} of {totalPages} · {total} users
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {(selected || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center">
          <div className="card-surface max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 dark:bg-slate-900">
            {detailLoading || !selected ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.email}</p>

                <div className="mt-5">
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Plan</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                    value={selected.plan?.id ?? ""}
                    disabled={saving}
                    onChange={(e) => saveUser({ plan_id: Number(e.target.value) })}
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.code})
                      </option>
                    ))}
                  </select>
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={selected.is_admin}
                    disabled={saving}
                    onChange={(e) => saveUser({ is_admin: e.target.checked })}
                  />
                  Admin access
                </label>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Admin notes</label>
                  <textarea
                    rows={3}
                    defaultValue={selected.notes ?? ""}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                    id="admin-notes"
                  />
                  <Button
                    className="mt-2"
                    variant="secondary"
                    disabled={saving}
                    onClick={() => {
                      const el = document.getElementById("admin-notes") as HTMLTextAreaElement | null
                      void saveUser({ notes: el?.value ?? "" })
                    }}
                  >
                    Save notes
                  </Button>
                </div>

                {selected.usage && (
                  <div className="mt-5 rounded-xl border border-slate-200/80 p-4 text-sm dark:border-white/10">
                    <p className="font-medium text-slate-800 dark:text-slate-200">Usage</p>
                    <ul className="mt-2 space-y-1 text-slate-500 dark:text-slate-400">
                      <li>
                        Journals today: {selected.usage.journals_today.used} /{" "}
                        {formatLimit(selected.usage.journals_today.limit)}
                      </li>
                      <li>
                        Analyze today: {selected.usage.analyze_today.used} /{" "}
                        {formatLimit(selected.usage.analyze_today.limit)}
                      </li>
                      <li>
                        Summaries week: {selected.usage.weekly_summaries_this_week.used} /{" "}
                        {formatLimit(selected.usage.weekly_summaries_this_week.limit)}
                      </li>
                      <li>
                        Insights week: {selected.usage.insights_this_week.used} /{" "}
                        {formatLimit(selected.usage.insights_this_week.limit)}
                      </li>
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button variant="secondary" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
