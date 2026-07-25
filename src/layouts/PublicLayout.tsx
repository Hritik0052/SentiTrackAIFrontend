import { Outlet } from "react-router-dom"
import { Footer } from "../components/layout/Footer"
import { Navbar } from "../components/layout/Navbar"
import { ScrollManager } from "../components/layout/ScrollManager"

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
