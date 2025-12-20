import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Version logging
console.log('🎮 Dune Stats Version: v1.6.0')
console.log('📅 Build Date:', new Date().toISOString())
console.log('🚀 Deployed via GitHub Actions')
console.log('✨ v1.6.0 新功能：')
console.log('  - 💾 Base64 圖片儲存系統（100% 免費，無需 Firebase Storage）')
console.log('  - ✨ 沙丘風格 AI 識別載入動畫（脈動光環、香料粒子）')
console.log('  - 🖼️ 圖片查看 Modal 支援下載功能')
console.log('  - 📊 完整的處理流程可視化（分析→壓縮→保存→完成）')
console.log('  - 🏠 首頁統計儀表板改進（總遊戲數、玩家數、勝率王）')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
