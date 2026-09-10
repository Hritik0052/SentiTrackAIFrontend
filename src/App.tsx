import { Route, Routes } from "react-router-dom"
import { AdminRoute } from "./components/auth/AdminRoute"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { PublicOnlyRoute } from "./components/auth/PublicOnlyRoute"
import { PublicLayout } from "./layouts/PublicLayout"
import { AppLayout } from "./layouts/AppLayout"
import { AdminLayout } from "./layouts/AdminLayout"
import AboutPage from "./pages/About"
import ContactPage from "./pages/Contact"
import LandingPage from "./pages/Landing"
import LoginPage from "./pages/auth/Login"
import RegisterPage from "./pages/auth/Register"
import DashboardPage from "./pages/app/Dashboard"
import InsightsPage from "./pages/app/Insights"
import JournalDetailPage from "./pages/app/JournalDetail"
import JournalEditorPage from "./pages/app/JournalEditor"
import JournalListPage from "./pages/app/JournalList"
import ProfilePage from "./pages/app/Profile"
import SearchPage from "./pages/app/Search"
import WeeklySummaryPage from "./pages/app/WeeklySummary"
import AchievementsPage from "./pages/app/Achievements"
import BillingReturnPage from "./pages/app/BillingReturn"
import ExplorePlansPage from "./pages/app/ExplorePlans"
import AdminOverviewPage from "./pages/admin/Overview"
import AdminPlansPage from "./pages/admin/Plans"
import AdminUsersPage from "./pages/admin/Users"
import NotFoundPage from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="app" element={<AppLayout />}>
          <Route index element={<JournalListPage />} />
          <Route path="journals" element={<JournalListPage />} />
          <Route path="journals/new" element={<JournalEditorPage />} />
          <Route path="journals/:id" element={<JournalDetailPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="summaries" element={<WeeklySummaryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="badge-preview" element={<AchievementsPage />} />
          <Route path="plans" element={<ExplorePlansPage />} />
          <Route path="billing/return" element={<BillingReturnPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="plans" element={<AdminPlansPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
