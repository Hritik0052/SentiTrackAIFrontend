import { useState, type ReactNode } from "react"
import { Download } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../ui/Button"
import { ApiError } from "../../lib/apiClient"

type Variant = "primary" | "secondary" | "ghost"

interface ExportButtonProps {
  label?: string
  variant?: Variant
  className?: string
  icon?: ReactNode
  onExport: () => Promise<void>
}

export function ExportButton({
  label = "Export Excel",
  variant = "secondary",
  className,
  icon,
  onExport,
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await onExport()
      toast.success("Excel download started")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't export Excel. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={loading}
      onClick={handleClick}
      icon={loading ? undefined : (icon ?? <Download className="h-4 w-4" />)}
    >
      {loading ? "Exporting..." : label}
    </Button>
  )
}
