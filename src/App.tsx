import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navigation from './components/common/Navigation'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ManualInputPage from './pages/ManualInputPage'
import HistoryPage from './pages/HistoryPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Router basename="/Dune">
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/manual" element={<ManualInputPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  )
}

export default App
