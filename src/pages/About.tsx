import { motion } from "framer-motion"
import { Heart, Lock, ShieldCheck, Sparkles, UserCheck } from "lucide-react"
import { Button } from "../components/ui/Button"
import { PageHeader } from "../components/ui/PageHeader"
import { Section, SectionHeading } from "../components/ui/Section"
import { usePageMeta } from "../hooks/usePageMeta"

const VALUES = [
  {
    icon: Heart,
    title: "Reflection first",
    description:
      "Journaling is a practice of self-compassion. SentiTrack is built to make that practice feel warm, safe, and yours.",
  },
  {
    icon: Sparkles,
    title: "AI as a mirror",
    description:
      "Our AI never judges. It simply reflects your moods and patterns back to you, so you can notice what you might have missed.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by design",
    description:
      "Every entry, sentiment, and insight is scoped to your account and protected behind authentication. Your reflections are yours alone.",
  },
]

const PRIVACY_POINTS = [
  {
    icon: Lock,
    title: "User-scoped data",
    description:
      "Journals, analyses, and summaries are always tied to your account. No one else can read or query your entries.",
  },
  {
    icon: UserCheck,
    title: "Protected routes",
    description:
      "Every feature endpoint requires a valid access token. Sessions use short-lived tokens with secure refresh rotation.",
  },
  {
    icon: ShieldCheck,
    title: "No raw AI exposure",
    description:
      "We store only the structured signal from analysis — mood, sentiment, emotion — and never surface raw model payloads.",
  },
]

export default function AboutPage() {
  usePageMeta(
    "About — SentiTrack AI",
    "SentiTrack AI is private, reflective journaling with AI-assisted self-awareness.",
  )

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Journaling that helps you know yourself"
        description="SentiTrack AI exists for one reason: to make private, reflective journaling more insightful — without ever compromising your trust."
      />

      <Section className="pt-4">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          <p>
            We believe the simple act of writing down how you feel is one of the most powerful tools
            for mental clarity. But it's easy to lose track of the bigger picture — the slow shifts
            in mood, the patterns behind good weeks and hard ones.
          </p>
          <p>
            SentiTrack AI bridges that gap. You write naturally, and our AI gently analyzes each
            entry for sentiment, mood, and emotion. Over time, those signals become
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {" "}
              weekly summaries, analytics, and personal insights
            </span>{" "}
            that help you understand your inner world — and grow.
          </p>
        </div>
      </Section>

      <Section id="values" className="bg-white/50 pt-4 dark:bg-white/[0.02]">
        <SectionHeading eyebrow="Our values" title="What we care about" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-surface p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white">
                <value.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="privacy">
        <SectionHeading
          eyebrow="Privacy"
          title="Built to protect your reflections"
          description="Privacy isn't a feature we bolted on — it's the foundation the whole product stands on."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PRIVACY_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-slate-200/70 p-6 dark:border-white/10"
            >
              <point.icon className="h-6 w-6 text-brand-500 dark:text-brand-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Ready to start reflecting with a little help from AI?
          </p>
          <Button to="/register" size="lg">
            Get Started Free
          </Button>
        </div>
      </Section>
    </>
  )
}
