import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Lock, Mail, User, UserPlus } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { GradientBlobs } from "../../components/ui/GradientBlobs"
import { Logo } from "../../components/layout/Logo"
import { ApiError } from "../../lib/apiClient"
import { useAuth } from "../../hooks/useAuth"
import { usePageMeta } from "../../hooks/usePageMeta"

interface FormState {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const EMPTY: FormState = { name: "", email: "", password: "", confirmPassword: "" }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  usePageMeta("Sign up — SentiTrack AI", "Create your SentiTrack AI account.")

  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = "Please tell us your name."
    if (!form.email.trim()) next.email = "An email is required."
    else if (!EMAIL_RE.test(form.email)) next.email = "That doesn't look like a valid email."
    if (!form.password) next.password = "A password is required."
    else if (form.password.length < 8) next.password = "Use at least 8 characters."
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match."
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      toast.success("Account created. Welcome to SentiTrack AI!")
      navigate("/app/journals", { replace: true })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase =
    "w-full rounded-xl border bg-white/60 py-3 pl-11 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:bg-white/5 dark:text-white"

  function fieldClass(field: keyof FormState) {
    return `${inputBase} ${
      fieldErrors[field] ? "border-red-400 dark:border-red-500/60" : "border-slate-200 dark:border-white/10"
    }`
  }

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden py-16">
      <GradientBlobs />
      <Container className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <div className="card-surface p-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Start reflecting with a little help from AI.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Ada Lovelace"
                    className={fieldClass("name")}
                    aria-invalid={Boolean(fieldErrors.name)}
                  />
                </div>
                {fieldErrors.name && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="ada@example.com"
                    className={fieldClass("email")}
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                </div>
                {fieldErrors.email && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="At least 8 characters"
                    className={fieldClass("password")}
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                </div>
                {fieldErrors.password && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.password}</p>}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className={fieldClass("confirmPassword")}
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full"
                icon={<UserPlus className="h-4 w-4" />}
              >
                {submitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
              Log in
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
