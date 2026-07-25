import { motion } from "framer-motion"
import { Container } from "./Container"
import { GradientBlobs } from "./GradientBlobs"

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <section className="relative overflow-hidden pt-20 pb-14 sm:pt-28">
      <GradientBlobs />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-400">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  )
}
