import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Version logging
console.log('🎮 Dune Stats Version: v1.4.1')
console.log('📅 Build Date:', new Date().toISOString())
console.log('🚀 Deployed via GitHub Actions')
console.log('✨ v1.4.1 新功能：')
console.log('  - 編輯遊戲模態框新增香料和錢幣欄位')
console.log('  - 編輯時同樣使用：分數 → 香料 → 錢幣判定邏輯')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
