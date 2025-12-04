# 🎮 Dune 遊戲統計系統 - 啟動指南

## 📋 專案簡介

這是一個專為《沙丘：命令與征服》(Dune: Imperium) 桌遊設計的勝負統計系統，使用 AI 視覺識別技術自動記錄遊戲結果，無需手動輸入。

### ✨ 核心功能

- 🤖 **AI 自動識別**：上傳遊戲結算照片，OpenAI Vision API 自動提取玩家、角色、分數
- 📊 **統計分析**：玩家勝率、角色使用頻率、分數趨勢圖表
- 🔥 **精美動畫**：Framer Motion 頁面切換 + GSAP 沙蟲載入動畫
- 🎨 **沙丘主題**：完整的 Dune 宇宙配色和視覺風格
- 📱 **響應式設計**：完美支援桌面、平板、手機

### 🛠️ 技術棧

- **前端框架**：React 18 + TypeScript + Vite
- **樣式**：Tailwind CSS v3
- **動畫**：Framer Motion + GSAP
- **資料庫**：Firebase Firestore
- **儲存**：Firebase Storage
- **AI 識別**：OpenAI GPT-4o Vision API
- **測試**：Playwright E2E
- **部署**：GitHub Actions → GitHub Pages

---

## 🚀 快速開始

### 前置要求

- **Node.js**：22.12.0 LTS 或更新版本
- **npm**：9.x 或更新版本
- **Git**：用於版本控制
- **Firebase 專案**：已建立 Firebase 專案
- **OpenAI API Key**：具有 GPT-4o 存取權限

### 1. 克隆專案

```bash
git clone https://github.com/yanchen184/Dune.git
cd Dune
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 環境變數設定

在專案根目錄建立 `.env` 檔案：

```env
# Firebase 配置
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OpenAI API Key
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**⚠️ 重要**：
- `.env` 檔案已在 `.gitignore` 中，不會被提交到 Git
- 請妥善保管您的 API Keys
- 切勿將 API Keys 提交到公開儲存庫

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問：`http://localhost:5173/Dune/`

---

## 📦 可用指令

### 開發

```bash
# 啟動開發伺服器（熱重載）
npm run dev

# TypeScript 類型檢查
npm run lint
```

### 建置

```bash
# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

### 測試

```bash
# 執行所有 E2E 測試
npm run test

# UI 模式（推薦 - 可視覺化看到測試過程）
npm run test:ui

# 有頭模式（看到真實瀏覽器操作）
npm run test:headed

# 查看測試報告
npx playwright show-report
```

---

## 🧪 執行測試

### E2E 自動化測試

專案使用 Playwright 進行端到端測試，涵蓋以下項目：

✅ **基本功能測試**
- 頁面載入和導航
- 首頁顯示總遊戲數和最近遊戲
- 上傳頁面檔案選擇功能
- 歷史頁面遊戲列表顯示
- 統計頁面數據呈現

✅ **互動測試**
- 導航連結點擊
- 按鈕狀態（啟用/禁用）
- 表單驗證
- 頁面切換動畫

✅ **視覺回歸測試**
- 首頁截圖比對
- 上傳頁面截圖比對
- 歷史頁面截圖比對
- 統計頁面截圖比對

✅ **響應式測試**
- 桌面版 (1920x1080, 1366x768)
- 平板版 (1024x768, 768x1024)
- 手機版 (390x844, 375x667)

✅ **無障礙性測試**
- 鍵盤導航
- 觸控友善按鈕大小
- 文字可讀性

### 測試指令

```bash
# 執行所有測試
npm run test

# UI 模式（推薦）
npm run test:ui

# 有頭模式（可看到瀏覽器操作）
npm run test:headed

# 只執行特定測試檔案
npx playwright test e2e/game.spec.ts

# 只執行響應式測試
npx playwright test e2e/responsive.spec.ts

# 除錯模式（逐步執行）
npx playwright test --debug

# 產生測試追蹤檔案
npx playwright test --trace on
npx playwright show-trace trace.zip

# 錄製測試操作（自動生成測試程式碼）
npx playwright codegen http://localhost:5173/Dune/
```

---

## 🚀 部署

### 自動部署（推薦）✨

本專案已配置 GitHub Actions 自動部署，推送到 `main` 分支即可自動部署到 GitHub Pages。

#### 部署流程

```bash
# 1. 開發完成後提交
git add .
git commit -m "feat: add new feature"

# 2. 推送到 main 分支（自動觸發部署）
git push origin main

# 3. 等待 2-3 分鐘，部署完成！
```

#### 查看部署狀態

- 📊 [GitHub Actions 執行記錄](https://github.com/yanchen184/Dune/actions)
- 🌐 [線上網站](https://yanchen184.github.io/Dune/)

#### 部署原理

```
推送到 main → GitHub Actions 自動建置 → 自動部署到 gh-pages 分支 → 網站上線
```

**優點**：
- ✅ 無需手動建置
- ✅ 無需管理 gh-pages 分支
- ✅ 自動化、零錯誤
- ✅ 專注於開發，推送即部署

### 手動部署

如需手動部署：

```bash
# 建置生產版本
npm run build

# 部署到 GitHub Pages
npm run deploy
```

### 部署檢查清單

完成部署後，請確認：
- [ ] GitHub Actions workflow 顯示綠色勾勾 ✅
- [ ] 網站可以正常訪問
- [ ] 瀏覽器 Console 無錯誤或警告
- [ ] 所有功能正常運作
- [ ] 圖片、樣式、字體正確載入
- [ ] 版本號正確顯示（F12 Console）
- [ ] 響應式設計在不同裝置上正常

---

## 📂 專案結構

```
Dune/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions 自動部署配置
├── e2e/
│   ├── game.spec.ts            # 主要功能 E2E 測試
│   └── responsive.spec.ts      # 響應式設計測試
├── public/                     # 靜態資源
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Button.tsx      # 按鈕組件（Framer Motion）
│   │       ├── Card.tsx        # 卡片組件（Glassmorphism）
│   │       ├── Loading.tsx     # 載入動畫（GSAP 沙蟲）
│   │       ├── Toast.tsx       # Toast 通知組件
│   │       └── Navigation.tsx  # 導航欄組件
│   ├── hooks/
│   │   ├── useFirebase.ts      # Firebase CRUD 操作
│   │   ├── useStorage.ts       # Firebase Storage 操作
│   │   ├── useVision.ts        # OpenAI Vision API 整合
│   │   ├── useGames.ts         # 遊戲數據管理
│   │   ├── useStats.ts         # 統計數據計算
│   │   └── useToast.ts         # Toast 通知管理
│   ├── lib/
│   │   ├── constants.ts        # 常數定義（角色、顏色）
│   │   ├── firebase.ts         # Firebase 初始化
│   │   ├── openai.ts           # OpenAI 客戶端
│   │   ├── types.ts            # TypeScript 類型定義
│   │   └── utils.ts            # 工具函數
│   ├── pages/
│   │   ├── HomePage.tsx        # 首頁（Dashboard）
│   │   ├── UploadPage.tsx      # 上傳頁面（AI 識別）
│   │   ├── HistoryPage.tsx     # 歷史記錄頁面
│   │   └── StatsPage.tsx       # 統計分析頁面
│   ├── App.tsx                 # 主應用組件（路由）
│   ├── main.tsx                # 入口文件
│   └── index.css               # 全域樣式
├── .env                        # 環境變數（不提交）
├── .gitignore                  # Git 忽略檔案
├── index.html                  # HTML 入口
├── package.json                # 專案配置
├── playwright.config.ts        # Playwright 測試配置
├── postcss.config.js           # PostCSS 配置
├── tailwind.config.js          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── README.md                   # 專案說明
└── START.md                    # 啟動指南（本文件）
```

---

## 🎨 主題配色

### Dune 宇宙配色方案

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

### 字體

- **標題**：Orbitron (Google Fonts)
- **內文**：Rajdhani (Google Fonts)

---

## 🔧 Firebase 設定

### Firestore 資料結構

#### games 集合

```typescript
{
  id: string;                    // 自動生成的文檔 ID
  gameNumber: number;            // 遊戲編號（自增）
  timestamp: Timestamp;          // 遊戲時間
  imageUrl: string;              // 結算圖片 URL
  players: [
    {
      name: string;              // 玩家名稱
      faction: DuneFaction;      // 角色（如 "亞崔迪"）
      score: number;             // 最終得分
      isWinner: boolean;         // 是否為贏家
    }
  ];
  createdAt: Timestamp;          // 記錄建立時間
  recognitionConfidence: number; // AI 識別信心度 (0-1)
}
```

### Firebase Storage 結構

```
game-results/
├── game-1.jpg
├── game-2.jpg
└── game-N.jpg
```

### Firebase Security Rules

建議在 Firebase Console 設定以下安全規則：

**Firestore Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      // 允許讀取所有遊戲記錄
      allow read: if true;

      // 允許寫入（實際應用中應加入身份驗證）
      allow write: if true;
    }
  }
}
```

**Storage Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /game-results/{imageId} {
      // 允許讀取所有圖片
      allow read: if true;

      // 允許上傳（限制檔案大小 5MB）
      allow write: if request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## 🤖 OpenAI Vision API 使用

### Prompt 設計

系統使用精心設計的中文 Prompt 來識別遊戲結算圖片：

```
你是一個專門識別《沙丘：命令與征服》桌遊結算結果的 AI。
請分析圖片並提取以下資訊：
1. 每位玩家的名字
2. 使用的角色（亞崔迪、哈肯能、弗雷曼、貝尼·傑瑟里特、間行會、皇帝）
3. 最終得分
4. 誰是贏家（最高分）

請以 JSON 格式回應...
```

### 重試機制

- **最多重試 3 次**
- **每次延遲 1 秒**
- **自動處理網路錯誤**

### 信心度評估

系統會評估 AI 識別的信心度（0-1），並在資料庫中記錄。

---

## 🐛 常見問題排除

### Q1: 開發伺服器無法啟動？

**A**: 檢查 Node.js 版本

```bash
node -v  # 應該是 v22.12.0 或更新
npm -v   # 應該是 9.x 或更新
```

如果版本過舊，請更新：
```bash
# 使用 nvm 更新 Node.js
nvm install 22.12.0
nvm use 22.12.0
```

### Q2: 埠號被佔用？

**A**: Vite 會自動嘗試下一個可用埠號

```
Port 5173 is in use, trying another one...
➜  Local:   http://localhost:5174/Dune/
```

### Q3: Firebase 連線錯誤？

**A**: 檢查 `.env` 檔案是否正確配置

```bash
# 確認所有 Firebase 環境變數都已設定
cat .env | grep VITE_FIREBASE
```

### Q4: OpenAI API 錯誤？

**A**: 檢查 API Key 和額度

- 確認 API Key 正確且有效
- 確認 OpenAI 帳戶有足夠的額度
- 確認有 GPT-4o 模型的存取權限

### Q5: 圖片上傳失敗？

**A**: 檢查檔案大小和格式

- 檔案大小必須小於 5MB
- 僅支援圖片格式（image/*）
- 檢查 Firebase Storage 規則

### Q6: 測試執行失敗？

**A**: 確保開發伺服器正在運行

```bash
# 先啟動開發伺服器
npm run dev

# 在另一個終端執行測試
npm run test
```

### Q7: 建置錯誤？

**A**: 清除快取並重新安裝

```bash
# 清除 node_modules 和 lock 檔案
rm -rf node_modules package-lock.json

# 重新安裝
npm install

# 清除 Vite 快取
rm -rf node_modules/.vite

# 重新建置
npm run build
```

### Q8: 部署後網站空白？

**A**: 檢查以下項目

1. **Base URL 設定**
   ```typescript
   // vite.config.ts
   base: '/Dune/'  // 必須與儲存庫名稱一致
   ```

2. **GitHub Pages Source**
   - 前往：Settings → Pages
   - Source 必須選擇 "GitHub Actions"

3. **Console 錯誤**
   - 打開瀏覽器 Console (F12)
   - 查看是否有 404 錯誤
   - 通常是路徑配置問題

### Q9: 樣式未載入？

**A**: 確認 CSS 正確引入

```typescript
// main.tsx
import './index.css'  // 必須引入
```

---

## 📊 版本資訊

### 當前版本：v1.0.0

#### 版本查看方式

在瀏覽器 Console (F12) 查看：

```javascript
// 會自動輸出
🎮 Dune Stats Version: v1.0.0
📅 Build Date: 2025-12-03T08:30:00.000Z
🚀 Deployed via GitHub Actions
```

#### 版本歷史

- **v1.0.0** (2025-12-03)
  - ✨ 初始版本發布
  - 🤖 AI 自動識別功能
  - 📊 統計分析功能
  - 🎨 Dune 主題設計
  - 📱 響應式佈局
  - 🧪 完整 E2E 測試
  - 🚀 GitHub Actions 自動部署

---

## 🤝 貢獻指南

### 提交 Pull Request

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### Commit 訊息規範

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

本專案採用 MIT 授權條款。

---

## 📧 聯絡方式

- **GitHub**：[yanchen184](https://github.com/yanchen184)
- **Email**：bobchen184@gmail.com
- **作品集**：https://yanchen184.github.io/game-portal

---

## 🙏 致謝

- **Dune: Imperium** by Dire Wolf Digital
- **React** 團隊
- **Firebase** 團隊
- **OpenAI** 團隊
- **Playwright** 團隊

---

**🎮 享受遊戲，享受科技！**
