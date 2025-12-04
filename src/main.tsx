import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Version logging
console.log('🎮 Dune Stats Version: v1.3.1')
console.log('📅 Build Date:', new Date().toISOString())
console.log('🚀 Deployed via GitHub Actions')
console.log('🐛 Fixed: TypeScript 編譯錯誤修復，CI/CD 構建成功')
console.log('✨ v1.3.0: API Key 加密系統 + 遊戲標題優化')
console.log('🔐 OpenAI API Key 使用字符位移加密，可安全提交到 git')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
