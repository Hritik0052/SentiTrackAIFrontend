import { useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { tokenStorage } from "../../lib/tokenStorage"
import { Spinner } from "../ui/Spinner"

/** Requires login + users.is_admin. Non-admins go to /app. */
export function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const hasToken = Boolean(tokenStorage.getAccessToken())
  const brokenSession = !isLoading && hasToken && !user

  useEffect(() => {
    if (brokenSession) {
      tokenStorage.clear()
    }
  }, [brokenSession])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Bootstrap finished but session is broken (token without user) — don't spin forever.
  if (brokenSession || !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user?.is_admin !== true) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
