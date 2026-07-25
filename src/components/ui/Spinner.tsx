import { Loader2 } from "lucide-react"

type Size = "sm" | "md" | "lg"

const sizes: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
}

export function Spinner({ size = "md", className = "" }: { size?: Size; className?: string }) {
  return (
    <Loader2
      className={`animate-spin text-brand-500 dark:text-brand-400 ${sizes[size]} ${className}`}
      aria-hidden="true"
    />
  )
}
