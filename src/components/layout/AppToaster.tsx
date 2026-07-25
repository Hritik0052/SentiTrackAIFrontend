import { Toaster } from "react-hot-toast"
import { useTheme } from "../../hooks/useTheme"

export function AppToaster() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#e2e8f0" : "#0f172a",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
          fontSize: "14px",
        },
        success: { iconTheme: { primary: "#7c5cff", secondary: "#ffffff" } },
      }}
    />
  )
}
