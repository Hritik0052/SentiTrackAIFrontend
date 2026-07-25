import { motion } from "framer-motion"
import { PenLine, Sparkles, TrendingUp } from "lucide-react"
import { Section, SectionHeading } from "../../components/ui/Section"

const STEPS = [
  {
    icon: PenLine,
    step: "01",
    title: "Write your entry",
    description:
      "Open a fresh page and jot down whatever's on your mind. No structure required — just be honest with yourself.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Let AI analyze",
    description:
      "With one click, SentiTrack detects the sentiment, mood, and emotion behind your words in seconds.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Grow with insights",
    description:
      "Watch your streaks build, review weekly summaries, and discover patterns that help you understand yourself.",
  },
]

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="bg-white/50 dark:bg-white/[0.02]">
      <SectionHeading
        eyebrow="How it works"
        title="Three simple steps to self-awareness"
        description="No learning curve. Start reflecting today and let the insights come to you."
      />
      <div className="relative mt-16 grid gap-8 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lg shadow-brand-500/30">
              <step.icon className="h-7 w-7" />
            </div>
            <span className="mt-5 block text-sm font-bold tracking-widest text-brand-500 dark:text-brand-400">
              {step.step}
            </span>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              {step.title}
            </h3>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
