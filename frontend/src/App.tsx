import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import SiteHeader from './components/SiteHeader'
import CompetitionPage from './pages/CompetitionPage'
import ContactPage from './pages/ContactPage'
import DocumentsPage from './pages/DocumentsPage'
import DirectionsPage from './pages/DirectionsPage'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import LearningApplicationPage from './pages/LearningApplicationPage'
import TeachersPage from './pages/TeachersPage'
import WorkshopsPage from './pages/WorkshopsPage'
import CoursesPage from './pages/CoursesPage'
import CompetitionApplicationPage from './pages/CompetitionApplicationPage'

export default function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Общий каркас сайта: шапка + страницы + футер */}
        <div className="topbar">
          <div className="container">
            <SiteHeader />
          </div>
        </div>

        <main className="container">
          <Routes>
            {/* Страницы сайта (редактируются в папке `src/pages/`) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/directions" element={<DirectionsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/workshops" element={<WorkshopsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/competition" element={<CompetitionPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/contacts" element={<ContactPage />} />
            <Route path="/apply/learning" element={<LearningApplicationPage />} />
            <Route path="/apply/competition" element={<CompetitionApplicationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

