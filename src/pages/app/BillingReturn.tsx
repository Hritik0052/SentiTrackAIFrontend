import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { CheckCircle2, Clock3, XCircle } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { Spinner } from "../../components/ui/Spinner"
import { ApiError } from "../../lib/apiClient"
import { usePageMeta } from "../../hooks/usePageMeta"
import { billingService } from "../../services/billingService"
import { useAuth } from "../../hooks/useAuth"

export default function BillingReturnPage() {
  usePageMeta("Payment status — SentiTrack AI")

  const [params] = useSearchParams()
  const orderId = params.get("order_id")
  const { updateUser } = useAuth()
  const [status, setStatus] = useState<"checking" | "success" | "pending" | "error">("checking")
  const [message, setMessage] = useState("Confirming your payment…")

  useEffect(() => {
    let cancelled = false
    let attempts = 0

    async function poll() {
      attempts += 1
      try {
        const billing = await billingService.getBillingMe()
        if (cancelled) return
        if (billing.plan?.code === "pro") {
          // Refresh /users/me so nav/profile see new plan.
          const { authService } = await import("../../services/authService")
          const me = await authService.me()
          updateUser(me)
          setStatus("success")
          setMessage("Payment successful. Your Pro plan is active.")
          return
        }
        if (attempts >= 8) {
          setStatus("pending")
          setMessage(
            orderId
              ? `Payment is processing for order ${orderId}. If Pro doesn’t appear soon, refresh Profile in a minute.`
              : "Payment is still processing. Refresh Profile in a minute.",
          )
          return
        }
        window.setTimeout(() => {
          void poll()
        }, 2000)
      } catch (err) {
        if (cancelled) return
        setStatus("error")
        setMessage(err instanceof ApiError ? err.message : "Couldn't confirm payment status.")
      }
    }

    void poll()
    return () => {
      cancelled = true
    }
  }, [orderId, updateUser])

  const Icon =
    status === "success" ? CheckCircle2 : status === "error" ? XCircle : status === "pending" ? Clock3 : Clock3

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-lg text-center">
        <div className="card-surface p-8">
          {status === "checking" ? (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <Icon
              className={`mx-auto h-12 w-12 ${
                status === "success"
                  ? "text-emerald-500"
                  : status === "error"
                    ? "text-red-500"
                    : "text-amber-500"
              }`}
            />
          )}
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            {status === "success"
              ? "You're on Pro"
              : status === "error"
                ? "Something went wrong"
                : status === "pending"
                  ? "Almost there"
                  : "Confirming payment"}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{message}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/app/profile">Go to Profile</Button>
            <Button to="/app/dashboard" variant="secondary">
              Dashboard
            </Button>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            <Link to="/app/journals" className="underline-offset-2 hover:underline">
              Back to journals
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
