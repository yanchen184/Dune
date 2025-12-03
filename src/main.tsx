import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Version logging
console.log('🎮 Dune Stats Version: v1.3.0')
console.log('📅 Build Date:', new Date().toISOString())
console.log('🚀 Deployed via GitHub Actions')
console.log('✨ New: API Key 加密系統 + 遊戲標題優化')
console.log('🔐 OpenAI API Key 使用字符位移加密，可安全提交到 git')
console.log('🏆 歷史記錄標題顯示獲勝者資訊，更直觀易讀')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
