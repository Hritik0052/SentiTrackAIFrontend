import { AnimatePresence, motion } from "framer-motion"
import { BarChart3, BookOpen, CalendarRange, LogOut, Menu, Search, Sparkles, User, X } from "lucide-react"
import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Container } from "../ui/Container"
import { Logo } from "../layout/Logo"
import { ThemeToggle } from "../layout/ThemeToggle"
import { useAuth } from "../../hooks/useAuth"

const LINKS = [
  { label: "Journals", to: "/app/journals", icon: BookOpen },
  { label: "Dashboard", to: "/app/dashboard", icon: BarChart3 },
  { label: "Summaries", to: "/app/summaries", icon: CalendarRange },
  { label: "Search", to: "/app/search", icon: Search },
  { label: "Insights", to: "/app/insights", icon: Sparkles },
]

export function AppNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    toast.success("Logged out")
    navigate("/", { replace: true })
  }

  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?"

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/80">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            to="/app/profile"
            aria-label="Profile"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white"
          >
            {initial}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 dark:border-white/10 dark:text-slate-200"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-slate-200/70 bg-white/95 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-slate-950/95"
          >
            <Container className="flex flex-col gap-1 py-4">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                        : "text-slate-700 dark:text-slate-200"
                    }`
                  }
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/app/profile"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                      : "text-slate-700 dark:text-slate-200"
                  }`
                }
              >
                <User className="h-4 w-4" />
                Profile
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  handleLogout()
                }}
                className="mt-2 flex items-center gap-2 rounded-lg border-t border-slate-200/70 px-3 pt-4 text-sm font-medium text-red-600 dark:border-white/10 dark:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
