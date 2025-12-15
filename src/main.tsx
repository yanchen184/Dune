import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Version logging
console.log('🎮 Dune Stats Version: v1.5.0')
console.log('📅 Build Date:', new Date().toISOString())
console.log('🚀 Deployed via GitHub Actions')
console.log('✨ v1.5.0 新功能：')
console.log('  - 🤖 自動過濾 AI 玩家（角色名稱、空名稱）')
console.log('  - 📊 統計數據排除 AI 玩家')
console.log('  - 📸 歷史記錄顯示上傳的圖片')
console.log('  - 🧂 顯示香料和錢幣數量')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
