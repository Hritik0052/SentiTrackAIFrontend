import { Container } from "../../components/ui/Container"
import { GamificationPanel } from "../../components/badges/GamificationPanel"
import { usePageMeta } from "../../hooks/usePageMeta"

export default function BadgePreviewPage() {
  usePageMeta("Achievements — SentiTrack AI")

  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Achievements
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Streaks, levels, weekly challenges, and medal badges earned from real journaling.
        </p>
        <div className="mt-8">
          <GamificationPanel />
        </div>
      </Container>
    </section>
  )
}
