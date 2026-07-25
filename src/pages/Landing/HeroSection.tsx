import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { GradientBlobs } from "../../components/ui/GradientBlobs"
import { MoodPreviewCard } from "./MoodPreviewCard"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <GradientBlobs />
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
            >
              <Sparkles className="h-4 w-4" />
              AI-powered self-awareness
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
            >
              Understand your mind, <span className="text-gradient">one entry at a time.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400"
            >
              SentiTrack AI turns your daily journaling into meaningful insight. Write freely, and
              let AI reveal your moods, patterns, and progress over time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button to="/register" size="lg" icon={<ArrowRight className="h-4.5 w-4.5" />}>
                Get Started Free
              </Button>
              <Button to="/login" variant="secondary" size="lg">
                Login
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-5 text-sm text-slate-500 dark:text-slate-500"
            >
              Private by design · Your data stays yours · No credit card required
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <MoodPreviewCard />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
