import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"
import { GradientBlobs } from "../components/ui/GradientBlobs"
import { usePageMeta } from "../hooks/usePageMeta"

export default function NotFoundPage() {
  usePageMeta("Page not found — SentiTrack AI")
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <GradientBlobs />
      <Container className="text-center">
        <p className="text-7xl font-bold text-gradient sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-white">
          This page wandered off
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-8">
          <Button to="/" size="lg">
            Back to Home
          </Button>
        </div>
      </Container>
    </section>
  )
}
