import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LogIn, Mail, Lock } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"
import { GradientBlobs } from "../../components/ui/GradientBlobs"
import { Logo } from "../../components/layout/Logo"
import { ApiError } from "../../lib/apiClient"
import { useAuth } from "../../hooks/useAuth"
import { usePageMeta } from "../../hooks/usePageMeta"

export default function LoginPage() {
  usePageMeta("Login — SentiTrack AI", "Log in to your SentiTrack AI journal.")

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/app/journals"

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ email, password })
      toast.success("Welcome back!")
      navigate(from, { replace: true })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase =
    "w-full rounded-xl border border-slate-200 bg-white/60 py-3 pl-11 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-ring dark:border-white/10 dark:bg-white/5 dark:text-white"

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
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Log in to continue your reflection.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ada@example.com"
                    className={inputBase}
                  />
                </div>
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
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputBase}
                  />
                </div>
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
                icon={<LogIn className="h-4 w-4" />}
              >
                {submitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
              Get started
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
