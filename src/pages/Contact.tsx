import { motion } from "framer-motion"
import { Clock, Mail, MessageSquare, Send } from "lucide-react"
import { useState } from "react"
import type { FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"
import { PageHeader } from "../components/ui/PageHeader"
import { env } from "../config/env"
import { usePageMeta } from "../hooks/usePageMeta"

interface FormState {
  name: string
  email: string
  message: string
}

const EMPTY: FormState = { name: "", email: "", message: "" }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CONTACT_INFO = [
  { icon: Mail, label: "Email us", value: env.contactEmail },
  { icon: Clock, label: "Response time", value: "Within 1–2 business days" },
  { icon: MessageSquare, label: "Support", value: "Product help & feedback" },
]

export default function ContactPage() {
  usePageMeta("Contact — SentiTrack AI", "Get in touch with the SentiTrack AI team.")

  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = "Please tell us your name."
    if (!form.email.trim()) next.email = "An email is required."
    else if (!EMAIL_RE.test(form.email)) next.email = "That doesn't look like a valid email."
    if (!form.message.trim()) next.message = "Please write a short message."
    else if (form.message.trim().length < 10)
      next.message = "A little more detail helps us help you."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    // Frontend-only for now: no backend contact endpoint exists yet.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSubmitting(false)
    toast.success("Thanks for reaching out! We'll be in touch soon.")
    setForm(EMPTY)
    setErrors({})
  }

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const inputBase =
    "w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:bg-white/5 dark:text-white"

  function fieldClass(field: keyof FormState) {
    return `${inputBase} ${
      errors[field]
        ? "border-red-400 dark:border-red-500/60"
        : "border-slate-200 dark:border-white/10"
    }`
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions, feedback, or just want to say hi? Send us a note and we'll get back to you."
      />

      <section className="pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Get in touch
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Reach us through the form or the details below. We read every message.
              </p>

              <div className="mt-8 space-y-5">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              noValidate
              className="card-surface p-6 sm:p-8 lg:col-span-3"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Ada Lovelace"
                    className={fieldClass("name")}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="ada@example.com"
                    className={fieldClass("email")}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="How can we help?"
                  className={`${fieldClass("message")} resize-none`}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                  icon={<Send className="h-4 w-4" />}
                >
                  {submitting ? "Sending..." : "Send message"}
                </Button>
              </div>
            </motion.form>
          </div>
        </Container>
      </section>
    </>
  )
}
