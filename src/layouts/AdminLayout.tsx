import {
  ArrowLeft,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react"
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Logo } from "../components/layout/Logo"
import { ThemeToggle } from "../components/layout/ThemeToggle"
import { ScrollManager } from "../components/layout/ScrollManager"
import { useAuth } from "../hooks/useAuth"

const LINKS = [
  { label: "Overview", to: "/admin", end: true, icon: LayoutDashboard },
  { label: "Plans", to: "/admin/plans", end: false, icon: CreditCard },
  { label: "Users", to: "/admin/users", end: false, icon: Users },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    toast.success("Logged out")
    navigate("/", { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <ScrollManager />
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200/80 bg-white/90 px-4 py-5 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 lg:flex">
        <Logo />
        <p className="mt-4 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Admin
        </p>
        <nav className="mt-2 flex flex-1 flex-col gap-0.5">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                }`
              }
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-slate-200/80 pt-3 dark:border-white/10">
          <Link
            to="/app"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to app
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/80 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Logo />
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/10 dark:text-slate-400">
              Admin
            </span>
          </div>
          <p className="hidden text-sm text-slate-500 dark:text-slate-400 lg:block">
            Signed in as <span className="font-medium text-slate-800 dark:text-slate-200">{user?.email}</span>
          </p>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1 lg:hidden">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  title={link.label}
                  className={({ isActive }) =>
                    `flex h-9 w-9 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`
                  }
                >
                  <link.icon className="h-4 w-4" />
                </NavLink>
              ))}
            </nav>
            <ThemeToggle />
            <Link
              to="/app"
              className="hidden rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex dark:border-white/10 dark:text-slate-300"
            >
              App
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
