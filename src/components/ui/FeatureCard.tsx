import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}: {
  icon: LucideIcon
  title: string
  description: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="card-surface group p-6 transition-shadow hover:shadow-xl hover:shadow-brand-500/10"
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-md shadow-brand-500/30 transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </motion.div>
  )
}
