import { Route, Routes } from "react-router-dom"
import { PublicLayout } from "./layouts/PublicLayout"
import AboutPage from "./pages/About"
import ComingSoonPage from "./pages/ComingSoon"
import ContactPage from "./pages/Contact"
import LandingPage from "./pages/Landing"
import NotFoundPage from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<ComingSoonPage feature="Login" />} />
        <Route path="register" element={<ComingSoonPage feature="Sign up" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
