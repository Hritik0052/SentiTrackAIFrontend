import { Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { PublicOnlyRoute } from "./components/auth/PublicOnlyRoute"
import { PublicLayout } from "./layouts/PublicLayout"
import { AppLayout } from "./layouts/AppLayout"
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
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
