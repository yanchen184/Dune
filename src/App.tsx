import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { initializeFirebase } from './lib/firebase'
import Navigation from './components/common/Navigation'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ManualInputPage from './pages/ManualInputPage'
import HistoryPage from './pages/HistoryPage'
import StatsPage from './pages/StatsPage'

function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Reason: 在應用啟動時就初始化 Firebase，避免懶加載導致的連接錯誤
  useEffect(() => {
    const init = initializeFirebase();
    if (init) {
      console.log('✅ Firebase 已在應用啟動時初始化');
      setFirebaseReady(true);
    } else {
      console.warn('⚠️ Firebase 配置未找到，請前往設定頁面配置');
      setFirebaseReady(true); // 仍然允許應用運行，但會在嘗試使用 Firebase 時顯示錯誤
    }
  }, []);

  // 等待 Firebase 初始化完成（可選：可以顯示 loading 畫面）
  if (!firebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dune-dark">
        <div className="text-dune-sand font-orbitron text-xl">
          正在初始化應用...
        </div>
      </div>
    );
  }

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
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  )
}

export default App
