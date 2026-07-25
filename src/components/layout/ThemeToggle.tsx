import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../hooks/useTheme"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="focus-ring relative flex h-9 w-16 items-center rounded-full border border-slate-200 bg-slate-100 px-1 transition-colors dark:border-white/10 dark:bg-white/5"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-900"
        style={{ marginLeft: isDark ? "auto" : 0 }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-brand-400" strokeWidth={2} />
        ) : (
          <Sun className="h-4 w-4 text-accent-500" strokeWidth={2} />
        )}
      </motion.span>
    </button>
  )
}
