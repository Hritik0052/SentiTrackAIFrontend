import { Link } from "react-router-dom"
import { Container } from "../components/ui/Container"
import { PageHeader } from "../components/ui/PageHeader"
import { env } from "../config/env"
import { usePageMeta } from "../hooks/usePageMeta"

const LAST_UPDATED = "10 September 2026"

export default function TermsPage() {
  usePageMeta(
    "Terms & Conditions — SentiTrack AI",
    "Terms and conditions for using SentiTrack AI journaling and membership plans.",
  )

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Please read these terms carefully before using SentiTrack AI."
      />

      <section className="pb-24">
        <Container>
          <article className="prose-legal mx-auto max-w-3xl space-y-8 text-slate-600 dark:text-slate-400">
            <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">1. Agreement</h2>
              <p>
                By accessing or using SentiTrack AI (“Service”, “we”, “us”), you agree to these Terms
                & Conditions. If you do not agree, do not use the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">2. The Service</h2>
              <p>
                SentiTrack AI provides private digital journaling with optional AI-assisted mood and
                sentiment insights, summaries, analytics, and related membership features. Features
                may change as we improve the product.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">3. Accounts</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>You must provide accurate registration details and keep your password secure.</li>
                <li>You are responsible for activity under your account.</li>
                <li>You must be legally able to enter this agreement in your jurisdiction.</li>
                <li>We may suspend or terminate accounts that abuse the Service or break these terms.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">4. Memberships & payments</h2>
              <p>
                Paid plans are sold for a fixed validity period (for example monthly or yearly days
                configured on the plan). Prices are shown in INR on the Plans page. Payments are
                processed by Cashfree or other payment partners. After a successful payment, access
                lasts for the plan’s validity window unless we state otherwise.
              </p>
              <p>
                Free / trial access, if offered, is limited in time and features and may expire
                without automatic renewal. Details are on the Plans page and in our{" "}
                <Link to="/refund-cancellation" className="font-medium text-brand-600 dark:text-brand-400">
                  Refund & Cancellation Policy
                </Link>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">5. Acceptable use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Attempt unauthorized access to other users’ data or our systems</li>
                <li>Abuse, overload, or reverse-engineer the Service beyond lawful limits</li>
                <li>Use the Service for illegal, harmful, or fraudulent purposes</li>
                <li>Resell or misuse API / AI quotas in ways that harm the platform</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">6. Your content</h2>
              <p>
                Journal entries and related content you create remain yours. You grant us a limited
                license to host, process, and display that content solely to provide the Service
                (including AI analysis you request). We do not sell your journal content.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">7. AI & health disclaimer</h2>
              <p>
                AI mood, sentiment, and insight features are informational tools for reflection.
                They are <strong className="font-semibold text-slate-800 dark:text-slate-200">not</strong>{" "}
                medical, psychiatric, or crisis advice. If you are in distress, contact local
                emergency services or a qualified professional.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">8. Privacy</h2>
              <p>
                How we handle account and journal data is described on our{" "}
                <Link to="/about#privacy" className="font-medium text-brand-600 dark:text-brand-400">
                  About / Privacy
                </Link>{" "}
                page. Payment card data is handled by the payment provider, not stored on our servers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">9. Availability & changes</h2>
              <p>
                We aim for reliable uptime but do not guarantee uninterrupted access. We may update
                features, plans, or these Terms. Continued use after changes means you accept the
                updated Terms. Material changes may be noted by updating the “Last updated” date.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">10. Limitation of liability</h2>
              <p>
                To the fullest extent permitted by law, SentiTrack AI and its operators are not
                liable for indirect, incidental, or consequential damages arising from use of the
                Service. Our total liability for any claim relating to a paid plan is limited to the
                amount you paid for that plan period.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">11. Contact</h2>
              <p>
                Questions about these Terms:{" "}
                <a
                  href={`mailto:${env.contactEmail}`}
                  className="font-medium text-brand-600 dark:text-brand-400"
                >
                  {env.contactEmail}
                </a>{" "}
                or our{" "}
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
