import { motion } from "framer-motion"
import { Container } from "../../components/ui/Container"

const STATS = [
  { value: "6", label: "AI-powered features" },
  { value: "3", label: "Sentiment dimensions" },
  { value: "100%", label: "Private & user-scoped" },
  { value: "∞", label: "Entries, always free" },
]

export function StatsSection() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 rounded-3xl border border-slate-200/70 bg-white/60 p-10 backdrop-blur-sm md:grid-cols-4 dark:border-white/10 dark:bg-white/[0.03]">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-gradient sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
