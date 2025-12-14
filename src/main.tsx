import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Version logging
console.log('🎮 Dune Stats Version: v1.4.0')
console.log('📅 Build Date:', new Date().toISOString())
console.log('🚀 Deployed via GitHub Actions')
console.log('✨ v1.4.0 新功能：')
console.log('  - 新增香料（Spice）和錢幣（Coins）欄位')
console.log('  - 勝負判定邏輯：分數 → 香料 → 錢幣')
console.log('  - 修復 SPA 路由 404 問題（重新整理時）')
console.log('  - 修復 Firebase 初始化錯誤')
console.log('  - 修復 PlayerNameCombobox 空值錯誤')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
