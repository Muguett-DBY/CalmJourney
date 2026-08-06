import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import RefugePage from './pages/RefugePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import RefugeDetailPage from './pages/RefugeDetailPage.jsx'
import ForecastPage from './pages/ForecastPage.jsx'
import AlertPage from './pages/AlertPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/refuges" element={<RefugePage />} />
        <Route path="/refuges/state-library-victoria" element={<RefugeDetailPage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/alerts" element={<AlertPage />} />
      </Routes>
    </>
  )
}
