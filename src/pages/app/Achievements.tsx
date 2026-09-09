import { Container } from "../../components/ui/Container"
import { AchievementsBoard } from "../../components/badges/AchievementsBoard"
import { usePageMeta } from "../../hooks/usePageMeta"

export default function AchievementsPage() {
  usePageMeta("Achievements — SentiTrack AI")

  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Achievements
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Unlock medals by journaling. Tap any badge to see the task.
        </p>
        <div className="mt-8">
          <AchievementsBoard />
        </div>
      </Container>
    </section>
  )
}
