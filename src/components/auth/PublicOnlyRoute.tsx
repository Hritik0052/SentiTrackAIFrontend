import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Spinner } from "../ui/Spinner"

/** Keeps signed-in users out of /login and /register. */
export function PublicOnlyRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={user?.is_admin ? "/admin" : "/app/journals"} replace />
  }

  return <Outlet />
}
