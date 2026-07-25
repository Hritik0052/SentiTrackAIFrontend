import type { ReactNode } from "react"
import { Container } from "./Container"

interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
  containerClassName?: string
}

export function Section({ children, id, className = "", containerClassName = "" }: SectionProps) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  align?: "center" | "left"
}) {
  return (
    <div className={`mx-auto max-w-2xl ${align === "center" ? "text-center" : "text-left mx-0"}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-400">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{description}</p>
      )}
    </div>
  )
}
