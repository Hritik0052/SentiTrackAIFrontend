import { Link } from "react-router-dom"
import { Container } from "../components/ui/Container"
import { PageHeader } from "../components/ui/PageHeader"
import { env } from "../config/env"
import { usePageMeta } from "../hooks/usePageMeta"

const LAST_UPDATED = "10 September 2026"

export default function RefundCancellationPage() {
  usePageMeta(
    "Refund & Cancellation — SentiTrack AI",
    "Refund and cancellation policy for SentiTrack AI membership plans.",
  )

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Refund & Cancellation"
        description="How memberships renew, cancel, and when refunds may apply."
      />

      <section className="pb-24">
        <Container>
          <article className="mx-auto max-w-3xl space-y-8 text-slate-600 dark:text-slate-400">
            <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">1. Overview</h2>
              <p>
                SentiTrack AI sells digital membership access for a fixed validity period (for
                example 30 days for monthly plans, or another duration shown on the Plans page).
                This policy explains cancellations and refunds for those purchases.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">2. Free / trial access</h2>
              <p>
                If a Free or trial plan is offered, it is limited in time and features. When the
                trial ends, paid features stop until you choose a paid plan. Free trials are not
                refundable because no payment is collected.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">3. Cancellation</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Memberships are period-based. Access continues until the end of the paid validity
                  window shown after purchase.
                </li>
                <li>
                  We do not auto-charge again unless you start a new checkout for a new period
                  (unless a recurring subscription product is explicitly offered later).
                </li>
                <li>
                  You can stop using paid features by simply not renewing when the period ends.
                </li>
                <li>
                  To request account closure or help canceling access early, contact us via{" "}
                  <Link to="/contact" className="font-medium text-brand-600 dark:text-brand-400">
                    Contact Us
                  </Link>{" "}
                  or email{" "}
                  <a
                    href={`mailto:${env.contactEmail}`}
                    className="font-medium text-brand-600 dark:text-brand-400"
                  >
                    {env.contactEmail}
                  </a>
                  .
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">4. Refunds</h2>
              <p>
                Because memberships are digital and activated immediately after successful payment,
                all sales are generally <strong className="font-semibold text-slate-800 dark:text-slate-200">final</strong>.
              </p>
              <p>We may consider a refund or credit in good faith when:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>You were charged twice for the same order due to a technical error</li>
                <li>Payment succeeded but membership was not activated within a reasonable time</li>
                <li>A purchase was made fraudulently without your authorization (with proof)</li>
              </ul>
              <p>
                Refund requests should be emailed to{" "}
                <a
                  href={`mailto:${env.contactEmail}?subject=Refund%20request`}
                  className="font-medium text-brand-600 dark:text-brand-400"
                >
                  {env.contactEmail}
                </a>{" "}
                within <strong className="font-semibold text-slate-800 dark:text-slate-200">7 days</strong> of
                payment, with your account email, order / payment reference (Cashfree order id if
                available), and a short explanation.
              </p>
              <p>
                Approved refunds are processed via the original payment method through our payment
                partner and may take several business days depending on your bank.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">5. Non-refundable cases</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Change of mind after successful activation and use of the Service</li>
                <li>Partial unused days within an active validity period (unless required by law)</li>
                <li>Issues caused by incorrect account details you provided</li>
                <li>Violation of our Terms leading to suspension</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">6. Payment failures</h2>
              <p>
                If a payment fails or is abandoned in checkout, no membership is activated and no
                charge should apply. If your bank shows a pending hold that later reverses, that is
                handled by the payment provider / bank — contact us if a hold becomes a completed
                charge without access.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">7. Related policies</h2>
              <p>
                See also our{" "}
                <Link to="/terms" className="font-medium text-brand-600 dark:text-brand-400">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/contact" className="font-medium text-brand-600 dark:text-brand-400">
                  Contact Us
                </Link>{" "}
                page.
              </p>
            </section>
          </article>
        </Container>
      </section>
    </>
  )
}
