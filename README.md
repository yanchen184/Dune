# 🎮 Dune 遊戲統計系統

[![Deploy Status](https://github.com/yanchen184/Dune/actions/workflows/deploy.yml/badge.svg)](https://github.com/yanchen184/Dune/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-22.12.0-brightgreen)](https://nodejs.org/)

> 🤖 使用 AI 視覺識別技術自動記錄《沙丘：命令與征服》桌遊結果的統計系統

[🌐 線上 Demo](https://yanchen184.github.io/Dune/) | [📖 完整文件](./START.md)

---

## ✨ 特色功能

- **🤖 AI 自動識別（中文支援）**
  - 上傳遊戲結算照片，OpenAI GPT-4o Vision 自動提取數據
  - **支援中文角色名稱識別**（亞崔迪、哈肯能、皇帝等）
  - 無需手動輸入，識別準確率高
  - 自動判定贏家和分數

- **✏️ 手動輸入與編輯**
  - **智能玩家名稱選擇器**：可搜尋歷史玩家或新增新玩家
  - **同分勝利者選擇**：多位玩家同分時，彈出選擇勝利者的模態框
  - **歷史記錄編輯功能**：可隨時修正錯誤記錄
  - 可搜尋角色名稱，支援鍵盤導航

- **📊 智能統計分析**
  - 玩家勝率追蹤與平均分數
  - 角色使用頻率與勝率統計
  - **詳細角色數據**：每個角色顯示使用過的玩家及其勝敗記錄
  - 最愛角色分析
  - 歷史分數趨勢圖表

- **🎨 精美視覺設計**
  - 完整 Dune 宇宙主題配色
  - Framer Motion 流暢頁面切換動畫
  - GSAP 沙蟲載入動畫
  - Glassmorphism 玻璃擬態風格

- **📱 全平台支援**
  - 響應式設計，完美適配桌面、平板、手機
  - 觸控友善的操作介面
  - 優化的移動端體驗

- **🚀 現代化技術棧**
  - React 18 + TypeScript
  - Firebase Firestore + Storage
  - Vite 超快速建置
  - Playwright E2E 自動化測試
  - GitHub Actions CI/CD

---

## 🎯 支援的角色

本系統支援《沙丘：命令與征服》的所有主要角色，AI 識別和手動輸入均使用**中文名稱**：

| 中文名稱 | 英文名稱 | 特色 |
|---------|---------|------|
| 亞崔迪 | Atreides | 公爵家族，擅長外交 |
| 哈肯能 | Harkonnen | 男爵家族，資源豐富 |
| 皇帝 | Emperor | 帝國統治者，軍事強大 |
| 弗雷曼 | Fremen | 沙漠戰士，適應惡劣環境 |
| 貝尼·傑瑟里特 | Bene Gesserit | 姐妹會，預知與操控 |
| 間行會 | Spacing Guild | 掌控星際旅行 |
| 梅農·索瓦爾德伯爵 | Count Memnon Thorvald | 擴充角色 |
| 海倫娜·里奇斯 | Helena Richese | 擴充角色 |
| 格羅蘇·拉班 | Glossu Rabban | 擴充角色 |

**💡 提示**：
- 手動輸入時可以直接搜尋中文或英文名稱
- AI 識別會自動輸出中文名稱
- 支援模糊搜尋，輸入部分名稱即可快速定位

---

## 🚀 快速開始

### 環境要求

- Node.js 22.12.0+
- npm 9.x+
- Firebase 專案
- OpenAI API Key (GPT-4o)

### 安裝與啟動

```bash
# 1. 克隆專案
git clone https://github.com/yanchen184/Dune.git
cd Dune

# 2. 安裝依賴
npm install

# 3. 設定環境變數（複製 .env.example 並填入您的 API Keys）
cp .env.example .env
# 編輯 .env 填入 Firebase 和 OpenAI 配置

# 4. 啟動開發伺服器
npm run dev
```

訪問 `http://localhost:5173/Dune/` 即可開始使用！

📖 **詳細安裝和配置指南**：請參閱 [START.md](./START.md)

---

## 📂 專案結構

```
Dune/
├── src/
│   ├── components/      # UI 組件
│   │   └── common/      # 通用組件（Button, Card, Loading, Toast）
│   ├── hooks/           # 自定義 Hooks
│   ├── lib/             # 核心函式庫
│   ├── pages/           # 頁面組件
│   └── App.tsx          # 主應用
├── e2e/                 # Playwright E2E 測試
└── .github/workflows/   # CI/CD 配置
```

---

## 🧪 測試

```bash
# 執行 E2E 測試
npm run test

# UI 模式（推薦）
npm run test:ui

# 有頭模式（可看到瀏覽器操作）
npm run test:headed
```

### 測試覆蓋範圍

✅ 基本功能測試（頁面載入、導航、表單）
✅ 視覺回歸測試（截圖比對）
✅ 響應式測試（6 種裝置尺寸）
✅ 無障礙性測試（鍵盤導航、觸控友善）

---

## 🎨 技術棧

### 前端

- **框架**：React 18 + TypeScript
- **建置工具**：Vite
- **樣式**：Tailwind CSS v3
- **動畫**：Framer Motion + GSAP
- **路由**：React Router v6

### 後端服務

- **資料庫**：Firebase Firestore
- **儲存**：Firebase Storage
- **AI 識別**：OpenAI GPT-4o Vision API

### 開發工具

- **類型檢查**：TypeScript
- **測試**：Playwright
- **CI/CD**：GitHub Actions
- **代碼格式**：ESLint + Prettier

---

## 📖 使用說明

### 1. AI 自動識別（推薦）

1. 點擊「📷 AI 上傳」進入上傳頁面
2. 拍攝或選擇遊戲結算圖片
3. 點擊「開始識別」，系統會自動：
   - 上傳圖片至 Firebase Storage（可選）
   - 使用 OpenAI GPT-4o Vision 識別玩家、角色、分數
   - **自動輸出中文角色名稱**
   - 自動判定勝利者（最高分）
   - 儲存至 Firestore

**識別信心度**：系統會顯示 AI 識別的信心度（0-100%），建議 > 80% 的結果

### 2. 手動輸入（支援智能選擇）

1. 點擊「✍️ 手動輸入」進入輸入頁面
2. **玩家名稱欄位**：
   - 開始輸入時，會顯示歷史玩家名單
   - 可以**搜尋現有玩家**或直接輸入新名稱
   - 支援鍵盤導航（↑↓ 選擇，Enter 確認）
3. **角色選擇欄位**：
   - 輸入中文或英文名稱快速篩選
   - 支援模糊搜尋（如輸入「亞」會顯示「亞崔迪」）
4. **分數輸入**：輸入最終得分
5. 點擊「儲存遊戲記錄」

**同分處理**：
- 如果多位玩家同分且為最高分，系統會彈出**勝利者選擇模態框**
- 可以選擇單一勝利者或多位勝利者（平手）
- 至少需要選擇一位勝利者

### 3. 歷史記錄編輯

1. 進入「📜 歷史記錄」頁面
2. 找到需要修改的記錄，點擊「編輯」按鈕
3. 修改玩家名稱、角色或分數
4. 點擊「儲存」，系統會：
   - 自動重新計算勝利者（基於新分數）
   - 更新 Firestore 記錄
   - 刷新統計數據

**刪除記錄**：點擊「刪除」按鈕，會同時刪除 Firestore 記錄和 Storage 圖片

### 4. 統計分析

進入「📊 統計數據」查看詳細分析：

#### 玩家統計
- 總場次、勝利次數、勝率
- 平均分數
- **最常用角色**（自動分析）

#### 角色統計
- 使用次數、勝利次數、勝率
- 平均分數
- **詳細玩家數據**：
  - 顯示所有使用過該角色的玩家
  - 每位玩家的勝敗記錄
  - 按勝利次數排序

---

## 🚀 部署

### 自動部署（推薦）

本專案已配置 GitHub Actions，推送到 `main` 分支即可自動部署：

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

部署狀態：[GitHub Actions](https://github.com/yanchen184/Dune/actions)

### 手動部署

```bash
# 建置生產版本
npm run build

# 預覽建置結果
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

---

## 📊 系統架構

```
┌─────────────┐
│   使用者    │
└──────┬──────┘
       │ 上傳遊戲結算照片
       ↓
┌─────────────┐
│  React 前端 │ ←→ Firebase Storage (圖片儲存)
└──────┬──────┘
       │ Base64 圖片
       ↓
┌─────────────┐
│  OpenAI API │ → JSON 結構化數據
└──────┬──────┘
       │ 識別結果
       ↓
┌─────────────┐
│  Firestore  │ → 統計分析 → 視覺化呈現
└─────────────┘
```

---

## 🎨 主題配色

```javascript
colors: {
  dune: {
    sand: '#D4A574',    // 沙丘金
    spice: '#FF6B35',   // 香料橙
    deep: '#1A1A2E',    // 深邃藍
    sky: '#16213E',     // 天空藍
    dark: '#0F0E17',    // 暗黑紫
  }
}
```

---

## 📸 截圖

### 首頁 Dashboard
![首頁](./docs/screenshots/homepage.png)

### AI 上傳識別
![上傳頁面](./docs/screenshots/upload.png)

### 歷史記錄
![歷史頁面](./docs/screenshots/history.png)

### 統計分析
![統計頁面](./docs/screenshots/stats.png)

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

### 貢獻流程

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### Commit 規範

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

- `feat:` 新功能
- `fix:` Bug 修復
- `docs:` 文件更新
- `style:` 程式碼格式調整
- `refactor:` 重構
- `test:` 測試相關
- `chore:` 建置或輔助工具

---

## 📝 授權

本專案採用 [MIT](./LICENSE) 授權條款。

---

## 🙏 致謝

- [Dune: Imperium](https://www.direwolfdigital.com/dune-imperium/) - 靈感來源
- [OpenAI](https://openai.com/) - GPT-4o Vision API
- [Firebase](https://firebase.google.com/) - 後端服務
- [React](https://react.dev/) - 前端框架
- [Playwright](https://playwright.dev/) - 測試框架

---

## 📧 聯絡方式

- **作者**：yanchen184
- **GitHub**：[@yanchen184](https://github.com/yanchen184)
- **Email**：bobchen184@gmail.com
- **作品集**：https://yanchen184.github.io/game-portal

---

## 📅 版本歷史

### v1.3.1 (2025-12-03) - TypeScript 編譯錯誤修復

- 🐛 **修復 Button.tsx 類型衝突**：排除 framer-motion 與 React 原生事件的衝突（onDrag, onAnimationStart）
- 🐛 **修復 StatsPage.tsx Timestamp 處理**：正確處理 Firestore Timestamp 和 Date 的類型轉換
- 🐛 **修復 ManualInputPage.tsx 類型斷言**：完善 PlayerRecord[] 和 DuneFaction 類型
- 🐛 **修復 UploadPage.tsx 類型**：AI 識別結果正確轉換為 PlayerRecord[]
- 🐛 **修復 useStats.ts 時間處理**：增強 scoreTrend 的時間戳處理邏輯
- 🐛 **修復 config.ts 默認配置**：添加缺失的 databaseURL 和 measurementId 屬性
- 🐛 **修復 firebase.ts 空值斷言**：正確處理 db 和 storage 的類型
- ✅ **GitHub Actions CI/CD 構建成功**：所有 TypeScript 編譯錯誤已修復

### v1.3.0 (2025-12-03) - UI 優化與安全性改進

- 🏆 **遊戲標題優化**：歷史記錄標題從「遊戲 #2」改為「XXX 用 YYY 角色獲勝」
- 📅 **日期顯示修復**：修復統計頁面「Invalid Date」問題，正確處理 Firestore Timestamp
- 🎨 **上傳頁面重新設計**：專業的拖放上傳介面，動畫效果，更好的用戶體驗
- 🐛 **formatTimestamp 增強**：支援 Timestamp、Date、ISO 字符串多種格式
- 🔒 **安全性改進**：移除內建 API Key，強制使用者在設定頁面配置

### v1.2.0 (2025-12-03) - 設定頁面與 API Keys 管理

- ⚙️ **設定頁面**：全新的設定介面，可直接在網頁輸入 Firebase 和 OpenAI API Keys
- 🔒 **LocalStorage 配置管理**：API Keys 儲存在瀏覽器本地，不上傳伺服器
- 💾 **匯入/匯出 JSON**：支援配置備份和還原功能
- 🚀 **Lazy Initialization**：Firebase 和 OpenAI 延遲初始化，按需載入
- 🔧 **TypeScript 修復**：修正所有編譯錯誤，完善類型定義
- 📝 **無需 .env 檔案**：部署後直接在設定頁面輸入配置即可使用

### v1.1.0 (2025-12-03) - 重大功能更新

- ✨ **AI 中文角色名稱支援**：OpenAI 識別現在直接輸出中文角色名稱
- ✏️ **歷史記錄編輯功能**：可隨時修正錯誤的遊戲記錄
- 🎯 **智能玩家名稱選擇器**：手動輸入時可搜尋現有玩家或新增新玩家
- 👑 **同分勝利者選擇**：多位玩家同分時，彈出模態框選擇真正的勝利者
- 📊 **詳細角色統計**：每個角色顯示使用過的玩家及其勝敗記錄
- 🐛 修復 OpenAI JSON 解析錯誤（markdown 代碼塊處理）
- 🐛 修復 Firebase Storage CORS 超時問題（10 秒超時機制）

### v1.0.0 (2025-12-03)

- ✨ 初始版本發布
- 🤖 AI 自動識別功能
- 📊 統計分析功能
- 🎨 Dune 主題設計
- 📱 響應式佈局
- 🧪 完整 E2E 測試
- 🚀 GitHub Actions 自動部署

---

<div align="center">

**🎮 享受遊戲，享受科技！**

[⬆ 回到頂部](#-dune-遊戲統計系統)

Made with ❤️ by [yanchen184](https://github.com/yanchen184)

</div>