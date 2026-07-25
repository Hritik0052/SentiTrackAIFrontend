import { env } from "../../config/env"
import { useHealthCheck } from "../../hooks/useHealthCheck"

const LABEL: Record<string, string> = {
  checking: "Checking API...",
  online: "All systems operational",
  offline: "API unreachable",
}

const DOT: Record<string, string> = {
  checking: "bg-amber-400",
  online: "bg-emerald-500",
  offline: "bg-red-500",
}

export function StatusPill() {
  const { status } = useHealthCheck()

  if (!env.enableHealthCheck) return null

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
      <span className="relative flex h-2 w-2">
        {status === "online" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${DOT[status]}`} />
      </span>
      {LABEL[status]}
    </span>
  )
}
