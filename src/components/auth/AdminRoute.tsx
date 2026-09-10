import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { tokenStorage } from "../../lib/tokenStorage"
import { Spinner } from "../ui/Spinner"

/** Requires login + users.is_admin. Non-admins go to /app. */
export function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const hasToken = Boolean(tokenStorage.getAccessToken())

  // Wait for /users/me after login hard-redirect (token exists, user not hydrated yet).
  if (isLoading || (hasToken && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user?.is_admin !== true) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
