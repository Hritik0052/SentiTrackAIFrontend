import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Plus, Save, Star, X } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { adminService } from "../../services/adminService"
import { usePageMeta } from "../../hooks/usePageMeta"
import type { PlanCreatePayload, PlanSummary } from "../../types/billing"

function limitLabel(n: number | null): string {
  return n == null ? "∞" : String(n)
}

function emptyForm(): PlanCreatePayload {
  return {
    code: "",
    name: "",
    description: "",
    features: [
      "Journal entries",
      "AI sentiment analysis",
      "Weekly summaries",
      "Insights",
    ],
    daily_journal_limit: 3,
    weekly_summary_limit: 1,
    daily_analyze_limit: 5,
    weekly_insights_limit: 1,
    is_active: true,
    sort_order: 0,
    price_inr: 0,
    billing_period: "monthly",
    duration_days: 30,
  }
}

function featuresToText(features: string[] | null | undefined): string {
  return (features ?? []).join("\n")
}

function textToFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"

const labelCls = "mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400"

const LIMIT_FIELDS = [
  ["daily_journal_limit", "Journals / day"],
  ["daily_analyze_limit", "Analyze / day"],
  ["weekly_summary_limit", "Summaries / week"],
  ["weekly_insights_limit", "Insights / week"],
] as const

export default function AdminPlansPage() {
  usePageMeta("Admin — Plans")

  const [plans, setPlans] = useState<PlanSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<PlanCreatePayload>(emptyForm)
  const [formFeaturesText, setFormFeaturesText] = useState(featuresToText(emptyForm().features))
  const [editingPlan, setEditingPlan] = useState<PlanSummary | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<PlanSummary>>({})
  const [editFeaturesText, setEditFeaturesText] = useState("")
  const [busyId, setBusyId] = useState<number | null>(null)

  async function reload() {
    const data = await adminService.listPlans()
    setPlans(data)
  }

  useEffect(() => {
    let cancelled = false
    adminService
      .listPlans()
      .then((data) => {
        if (!cancelled) setPlans(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load plans.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      await adminService.createPlan({
        ...form,
        code: form.code.trim().toLowerCase(),
        name: form.name.trim(),
        description: form.description?.trim() || null,
        features: textToFeatures(formFeaturesText),
      })
      toast.success("Plan created")
      setForm(emptyForm())
      setFormFeaturesText(featuresToText(emptyForm().features))
      await reload()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't create plan.")
    } finally {
      setCreating(false)
    }
  }

  function openEditModal(plan: PlanSummary) {
    setEditingPlan(plan)
    setEditDraft({ ...plan })
    setEditFeaturesText(featuresToText(plan.features))
  }

  function closeEditModal() {
    if (busyId != null) return
    setEditingPlan(null)
    setEditDraft({})
    setEditFeaturesText("")
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault()
    if (editingPlan == null) return
    setBusyId(editingPlan.id)
    try {
      await adminService.updatePlan(editingPlan.id, {
        name: editDraft.name?.trim(),
        description: editDraft.description?.trim() || null,
        features: textToFeatures(editFeaturesText),
        daily_journal_limit: editDraft.daily_journal_limit,
        weekly_summary_limit: editDraft.weekly_summary_limit,
        daily_analyze_limit: editDraft.daily_analyze_limit,
        weekly_insights_limit: editDraft.weekly_insights_limit,
        is_active: editDraft.is_active,
        sort_order: editDraft.sort_order,
        price_inr: editDraft.price_inr,
        billing_period: editDraft.billing_period,
        duration_days: editDraft.duration_days,
      })
      toast.success("Plan updated")
      setEditingPlan(null)
      setEditDraft({})
      setEditFeaturesText("")
      await reload()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update plan.")
    } finally {
      setBusyId(null)
    }
  }

  async function makeDefault(planId: number) {
    setBusyId(planId)
    try {
      await adminService.setDefaultPlan(planId)
      toast.success("Default plan updated")
      await reload()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't set default.")
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
  }

  const saving = editingPlan != null && busyId === editingPlan.id

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Plans</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Limits control OpenRouter cost. Leave a limit empty (∞) for unlimited.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Days</th>
              <th className="px-4 py-3">Journals/day</th>
              <th className="px-4 py-3">Analyze/day</th>
              <th className="px-4 py-3">Summaries/wk</th>
              <th className="px-4 py-3">Insights/wk</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {plans.map((plan) => (
              <tr key={plan.id} className="bg-white dark:bg-slate-900/40">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {plan.name}
                    {plan.is_default && (
                      <span className="ml-2 inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                        <Star className="h-3 w-3" /> Default
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">{plan.code}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {(plan.features ?? []).length} features · {plan.billing_period ?? "—"}
                  </p>
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {(plan.price_inr ?? 0) > 0 ? `₹${plan.price_inr}` : "Free"}
                </td>
                <td className="px-4 py-3 tabular-nums">{plan.duration_days ?? "—"}</td>
                <td className="px-4 py-3 tabular-nums">{limitLabel(plan.daily_journal_limit)}</td>
                <td className="px-4 py-3 tabular-nums">{limitLabel(plan.daily_analyze_limit)}</td>
                <td className="px-4 py-3 tabular-nums">{limitLabel(plan.weekly_summary_limit)}</td>
                <td className="px-4 py-3 tabular-nums">{limitLabel(plan.weekly_insights_limit)}</td>
                <td className="px-4 py-3">
                  {plan.is_active ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Active</span>
                  ) : (
                    <span className="text-slate-400">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="secondary" onClick={() => openEditModal(plan)}>
                      Edit
                    </Button>
                    {!plan.is_default && (
                      <Button
                        variant="ghost"
                        disabled={busyId === plan.id}
                        onClick={() => makeDefault(plan.id)}
                      >
                        Set default
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingPlan && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-plan-title"
          onClick={closeEditModal}
        >
          <form
            className="card-surface max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
            onSubmit={saveEdit}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id="edit-plan-title"
                  className="text-lg font-semibold text-slate-900 dark:text-white"
                >
                  Edit plan
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  Code: <span className="font-mono text-slate-700 dark:text-slate-300">{editingPlan.code}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                aria-label="Close"
                disabled={saving}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="edit-plan-name">
                  Plan name
                </label>
                <input
                  id="edit-plan-name"
                  required
                  className={inputCls}
                  value={editDraft.name ?? ""}
                  disabled={saving}
                  onChange={(e) => setEditDraft((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="edit-plan-description">
                  Description
                </label>
                <textarea
                  id="edit-plan-description"
                  rows={2}
                  className={inputCls}
                  value={editDraft.description ?? ""}
                  disabled={saving}
                  onChange={(e) =>
                    setEditDraft((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="edit-plan-price">
                  Price (INR)
                </label>
                <input
                  id="edit-plan-price"
                  type="number"
                  min={0}
                  className={inputCls}
                  value={editDraft.price_inr ?? 0}
                  disabled={saving}
                  onChange={(e) =>
                    setEditDraft((prev) => ({ ...prev, price_inr: Number(e.target.value) }))
                  }
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="edit-plan-days">
                  Validity (days)
                </label>
                <input
                  id="edit-plan-days"
                  type="number"
                  min={1}
                  required
                  className={inputCls}
                  value={editDraft.duration_days ?? ""}
                  disabled={saving}
                  onChange={(e) =>
                    setEditDraft((prev) => ({
                      ...prev,
                      duration_days: e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="edit-plan-period">
                  Billing period
                </label>
                <select
                  id="edit-plan-period"
                  className={inputCls}
                  value={editDraft.billing_period ?? "monthly"}
                  disabled={saving}
                  onChange={(e) =>
                    setEditDraft((prev) => ({ ...prev, billing_period: e.target.value }))
                  }
                >
                  <option value="trial">trial (free)</option>
                  <option value="monthly">monthly</option>
                  <option value="yearly">yearly</option>
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor="edit-plan-sort">
                  Sort order
                </label>
                <input
                  id="edit-plan-sort"
                  type="number"
                  className={inputCls}
                  value={editDraft.sort_order ?? 0}
                  disabled={saving}
                  onChange={(e) =>
                    setEditDraft((prev) => ({ ...prev, sort_order: Number(e.target.value) }))
                  }
                />
              </div>

              {LIMIT_FIELDS.map(([key, label]) => (
                <div key={key}>
                  <label className={labelCls} htmlFor={`edit-plan-${key}`}>
                    {label}
                  </label>
                  <input
                    id={`edit-plan-${key}`}
                    type="number"
                    min={0}
                    className={inputCls}
                    placeholder="blank = unlimited"
                    value={editDraft[key] ?? ""}
                    disabled={saving}
                    onChange={(e) =>
                      setEditDraft((prev) => ({
                        ...prev,
                        [key]: e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="edit-plan-features">
                  Features (one per line — shown on Explore Plans)
                </label>
                <textarea
                  id="edit-plan-features"
                  rows={5}
                  className={inputCls}
                  value={editFeaturesText}
                  disabled={saving}
                  onChange={(e) => setEditFeaturesText(e.target.value)}
                  placeholder={"Unlimited journals\nUnlimited AI analysis"}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={Boolean(editDraft.is_active)}
                    disabled={saving}
                    onChange={(e) =>
                      setEditDraft((prev) => ({ ...prev, is_active: e.target.checked }))
                    }
                  />
                  Active (visible for checkout / assignment)
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="secondary" disabled={saving} onClick={closeEditModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} icon={<Save className="h-3.5 w-3.5" />}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <form onSubmit={handleCreate} className="card-surface mt-8 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Create plan</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelCls}>Code</label>
            <input
              required
              className={inputCls}
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="starter"
            />
          </div>
          <div>
            <label className={labelCls}>Name</label>
            <input
              required
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Starter"
            />
          </div>
          <div>
            <label className={labelCls}>Price (INR)</label>
            <input
              type="number"
              min={0}
              className={inputCls}
              value={form.price_inr ?? 0}
              onChange={(e) => setForm((f) => ({ ...f, price_inr: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className={labelCls}>Validity (days)</label>
            <input
              type="number"
              min={1}
              required
              className={inputCls}
              value={form.duration_days ?? 30}
              onChange={(e) => setForm((f) => ({ ...f, duration_days: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className={labelCls}>Billing period</label>
            <select
              className={inputCls}
              value={form.billing_period ?? "monthly"}
              onChange={(e) => setForm((f) => ({ ...f, billing_period: e.target.value }))}
            >
              <option value="trial">trial (free)</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
            </select>
          </div>
          {LIMIT_FIELDS.map(([key, label]) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                type="number"
                min={0}
                className={inputCls}
                placeholder="blank = unlimited"
                value={form[key] ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    [key]: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
              />
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelCls}>Features (one per line — shown on Explore Plans)</label>
            <textarea
              className={inputCls}
              rows={5}
              value={formFeaturesText}
              onChange={(e) => setFormFeaturesText(e.target.value)}
              placeholder={"Unlimited journals\nUnlimited AI analysis"}
            />
          </div>
        </div>
        <div className="mt-5">
          <Button type="submit" disabled={creating} icon={<Plus className="h-4 w-4" />}>
            {creating ? "Creating..." : "Create plan"}
          </Button>
        </div>
      </form>
    </div>
  )
}
