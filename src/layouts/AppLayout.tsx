import { Outlet } from "react-router-dom"
import { AppNavbar } from "../components/app/AppNavbar"
import { ScrollManager } from "../components/layout/ScrollManager"

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <ScrollManager />
      <AppNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
