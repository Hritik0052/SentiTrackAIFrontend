import { Construction } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"
import { GradientBlobs } from "../components/ui/GradientBlobs"
import { usePageMeta } from "../hooks/usePageMeta"

export default function ComingSoonPage({ feature }: { feature: string }) {
  usePageMeta(`${feature} — SentiTrack AI`)
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <GradientBlobs />
      <Container className="text-center">
        <div className="mx-auto max-w-xl">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-brand-500/30">
            <Construction className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {feature} is coming soon
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            The public experience is ready. The authenticated app — journaling, analytics,
            summaries, and insights — is the next phase on our roadmap.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/" size="lg">
              Back to Home
            </Button>
            <Button to="/about" variant="secondary" size="lg">
              Learn more
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
