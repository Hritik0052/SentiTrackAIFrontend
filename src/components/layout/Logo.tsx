import { NotebookPen } from "lucide-react"
import { Link } from "react-router-dom"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`focus-ring flex items-center gap-2 rounded-lg ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-md shadow-brand-500/30">
        <NotebookPen className="h-4.5 w-4.5" strokeWidth={2.25} />
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        SentiTrack <span className="text-gradient">AI</span>
      </span>
    </Link>
  )
}
