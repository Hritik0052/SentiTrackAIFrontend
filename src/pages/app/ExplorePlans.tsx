import { useEffect, useState } from "react"
import { Check, CreditCard, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { openCashfreeCheckout } from "../../lib/cashfreeCheckout"
import { useAuth } from "../../hooks/useAuth"
import { usePageMeta } from "../../hooks/usePageMeta"
import { billingService } from "../../services/billingService"
import type { BillingMe, PlanSummary } from "../../types/billing"

function formatValidity(plan: PlanSummary): string {
  const days = plan.duration_days
  if (days == null || days <= 0) {
    if (plan.billing_period === "yearly") return "365 days"
    if (plan.billing_period === "trial") return "15 days"
    return "30 days"
  }
  return `${days} day${days === 1 ? "" : "s"}`
}

function formatPrice(plan: PlanSummary): string {
  const validity = formatValidity(plan)
  if (plan.price_inr == null || plan.price_inr <= 0) {
    return `Free · ${validity}`
  }
  return `₹${plan.price_inr} / ${validity}`
}

export default function ExplorePlansPage() {
  usePageMeta("Plans — SentiTrack AI")

  const { user } = useAuth()
  const [plans, setPlans] = useState<PlanSummary[]>([])
  const [billing, setBilling] = useState<BillingMe | null>(null)
  const [currentCode, setCurrentCode] = useState<string | null>(user?.plan?.code ?? null)
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgradingCode, setUpgradingCode] = useState<string | null>(null)
  const [phone, setPhone] = useState("")

  useEffect(() => {
    let cancelled = false
    Promise.all([billingService.listPlans(), billingService.getBillingMe()])
      .then(([list, me]) => {
        if (cancelled) return
        setPlans(list.filter((p) => p.is_active).sort((a, b) => a.sort_order - b.sort_order))
        setBilling(me)
        setConfigured(me.cashfree_configured)
        setCurrentCode(me.is_expired ? null : me.plan?.code ?? user?.plan?.code ?? null)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Couldn't load plans.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user?.plan?.code])

  async function handleUpgrade(plan: PlanSummary) {
    setUpgradingCode(plan.code)
    try {
      const order = await billingService.createCashfreeOrder({
        plan_code: plan.code,
        customer_phone: phone.trim() || undefined,
      })
      toast.success("Opening secure checkout…")
      await openCashfreeCheckout({
        paymentSessionId: order.payment_session_id,
        env: order.env,
      })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't start checkout.")
    } finally {
      setUpgradingCode(null)
    }
  }

  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            Explore
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Choose your plan
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Every plan has a price and a validity window (days). Free is a limited trial; paid plans renew after their period.
          </p>
          {billing && !billing.is_expired && billing.days_remaining != null && billing.plan && (
            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Current: {billing.plan.name} · {billing.days_remaining} day
              {billing.days_remaining === 1 ? "" : "s"} left
            </p>
          )}
          {billing?.is_expired && (
            <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">
              Your membership expired. Choose a plan below to continue.
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <p className="mt-8 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <>
            {plans.some((p) => (p.price_inr ?? 0) > 0) && (
              <div className="mt-8 max-w-sm">
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Mobile for paid checkout (10 digits)
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="9876543210"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {plans.map((plan) => {
                const isCurrent = currentCode === plan.code
                const isPaid = (plan.price_inr ?? 0) > 0
                const features = plan.features?.length
                  ? plan.features
                  : ["Core journaling features"]

                return (
                  <article
                    key={plan.id}
                    className={`card-surface relative flex flex-col p-6 sm:p-8 ${
                      isPaid ? "ring-1 ring-brand-400/40" : ""
                    }`}
                  >
                    {isPaid && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                        <Sparkles className="h-3 w-3" /> Popular
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                        <CreditCard className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h2>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {formatPrice(plan)}
                        </p>
                        <p className="text-xs text-slate-500">Valid for {formatValidity(plan)}</p>
                      </div>
                    </div>
                    {plan.description && (
                      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>
                    )}
                    <ul className="mt-6 flex-1 space-y-2.5">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      {isCurrent ? (
                        <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          Current plan
                        </span>
                      ) : isPaid && configured ? (
                        <Button
                          className="w-full"
                          disabled={upgradingCode === plan.code}
                          onClick={() => handleUpgrade(plan)}
                        >
                          {upgradingCode === plan.code ? "Starting…" : `Upgrade to ${plan.name}`}
                        </Button>
                      ) : isPaid ? (
                        <Button className="w-full" disabled>
                          Payments unavailable
                        </Button>
                      ) : (
                        <Button to="/app/profile" variant="secondary" className="w-full">
                          View usage
                        </Button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
