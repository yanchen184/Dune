## FEATURE:

沙丘（Dune）桌遊勝負結算統計系統 - 全自動圖片識別版

### 核心功能

1. **遊戲記錄管理**
   - 記錄每場遊戲的結果（勝者、角色、分數）
   - 支援多人遊戲記錄（2-6人）
   - 時間戳記錄（遊戲日期和時間）
   - 遊戲編號自動生成

2. **AI 圖片識別（重點功能）**
   - 上傳遊戲結算截圖
   - 使用 OpenAI Vision API 自動分析圖片
   - 自動識別並填入：
     - 玩家名稱
     - 使用角色（Faction）
     - 最終分數
     - 勝利者
   - 識別後顯示預覽，讓用戶確認

3. **撤回功能**
   - 每筆記錄都可以撤回刪除
   - 撤回前需要二次確認（防止誤刪）
   - 撤回後資料永久刪除（從 Firebase 移除）

4. **統計數據展示**
   - 玩家勝率排行榜
   - 各角色使用頻率統計
   - 各角色勝率統計
   - 平均分數統計
   - 歷史遊戲記錄列表（可篩選、排序）

5. **UI/UX 設計要求**
   - **浮誇、視覺震撼的設計**
   - 使用沙丘主題配色（沙漠金、深藍、橘紅）
   - 大量動畫效果（GSAP + Framer Motion）
   - 卡片式設計，展示遊戲記錄
   - 響應式設計（支援手機、平板、桌面）
   - 深色模式優先（符合沙丘電影氛圍）

### 技術需求

- **前端**: React 19 + TypeScript + Vite
- **CSS**: Tailwind CSS
- **動畫**: GSAP + Framer Motion
- **後端**: Firebase (Firestore Database)
- **圖片儲存**: Firebase Storage
- **AI 識別**: OpenAI Vision API (GPT-4 Vision)
- **部署**: GitHub Pages (使用 GitHub Actions)

### 資料結構設計

**Firestore Collection: `games`**
```typescript
interface GameRecord {
  id: string;                    // 自動生成 ID
  gameNumber: number;            // 遊戲編號（自增）
  timestamp: Timestamp;          // 遊戲時間
  imageUrl?: string;             // 結算圖片 URL（可選）
  players: {
    name: string;                // 玩家名稱
    faction: string;             // 使用角色
    score: number;               // 分數
    isWinner: boolean;           // 是否勝利
  }[];
  createdAt: Timestamp;          // 記錄建立時間
  recognitionConfidence?: number; // AI 識別信心度（0-1）
}
```

### 頁面結構

1. **首頁（Dashboard）**
   - 統計卡片區域（總遊戲數、勝率排行等）
   - 最近遊戲記錄列表
   - 快速新增按鈕（浮動按鈕）

2. **新增記錄頁面**
   - 圖片上傳區域（支援拖放、點擊上傳）
   - AI 識別載入動畫
   - 識別結果預覽表格
   - 確認按鈕（可手動修改後再提交）
   - 取消按鈕

3. **歷史記錄頁面**
   - 遊戲記錄卡片列表
   - 篩選器（按日期、玩家、角色）
   - 排序選項（時間、分數）
   - 每筆記錄顯示撤回按鈕

4. **統計頁面**
   - 玩家勝率圖表（餅圖/柱狀圖）
   - 角色使用頻率圖表
   - 角色勝率對比圖表
   - 分數趨勢圖表

### AI 識別流程

```
用戶上傳圖片
    ↓
上傳到 Firebase Storage
    ↓
獲取圖片 URL
    ↓
呼叫 OpenAI Vision API
    ↓
解析返回的 JSON 數據
    ↓
顯示預覽表格（可編輯）
    ↓
用戶確認後儲存到 Firestore
```

### OpenAI Vision API Prompt 範例

```typescript
const prompt = `
分析這張沙丘桌遊的結算圖片，提取以下資訊：

請以 JSON 格式返回：
{
  "players": [
    {
      "name": "玩家名稱",
      "faction": "角色名稱（英文）",
      "score": 分數（數字）,
      "isWinner": 是否勝利（布林值）
    }
  ],
  "confidence": 識別信心度（0-1的小數）
}

注意：
- 分數必須是數字
- 角色使用英文名稱（如：Atreides, Harkonnen, Emperor等）
- 最高分者為勝利者
- 如果無法識別某個欄位，請用 null 標記
`;
```

## EXAMPLES:

此專案為全新專案，無現有程式碼參考。請依照以下最佳實踐：

### 資料夾結構
```
dune-stats/
├── src/
│   ├── components/          # React 組件
│   │   ├── Dashboard/      # 儀表板組件
│   │   ├── GameRecord/     # 遊戲記錄組件
│   │   ├── Upload/         # 圖片上傳組件
│   │   └── Statistics/     # 統計圖表組件
│   ├── hooks/              # 自定義 Hooks
│   │   ├── useFirebase.ts  # Firebase 操作
│   │   ├── useVision.ts    # OpenAI Vision API
│   │   └── useGames.ts     # 遊戲資料管理
│   ├── lib/                # 工具函數
│   │   ├── firebase.ts     # Firebase 配置
│   │   ├── openai.ts       # OpenAI 配置
│   │   └── types.ts        # TypeScript 類型定義
│   ├── App.tsx             # 主應用組件
│   └── main.tsx            # 入口文件
├── public/                 # 靜態資源
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 配置
├── e2e/                    # Playwright E2E 測試
├── .env.example            # 環境變數範例
├── vite.config.ts          # Vite 配置
└── START.md                # 啟動說明文件
```

### React 組件範例架構
```tsx
// src/components/Upload/ImageUpload.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVision } from '@/hooks/useVision';

export const ImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const { analyzeImage, loading } = useVision();

  const handleUpload = async (file: File) => {
    // 上傳邏輯
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // 浮誇動畫效果
    >
      {/* 組件內容 */}
    </motion.div>
  );
};
```

## DOCUMENTATION:

### 必須參考的官方文檔

1. **Firebase**
   - Firestore Database: https://firebase.google.com/docs/firestore
   - Firebase Storage: https://firebase.google.com/docs/storage
   - Firebase SDK for Web: https://firebase.google.com/docs/web/setup

2. **OpenAI API**
   - Vision API Guide: https://platform.openai.com/docs/guides/vision
   - API Reference: https://platform.openai.com/docs/api-reference/chat

3. **React & 生態系**
   - React 19 Docs: https://react.dev/
   - React Router: https://reactrouter.com/
   - Framer Motion: https://www.framer.com/motion/
   - GSAP: https://greensock.com/docs/

4. **Tailwind CSS**
   - Tailwind CSS v3: https://tailwindcss.com/docs
   - Headless UI: https://headlessui.com/

5. **測試**
   - Playwright: https://playwright.dev/
   - Testing Library: https://testing-library.com/react

## OTHER CONSIDERATIONS:

### 環境變數配置 (必須在 .env 中設置)

```env
# Firebase 配置
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# OpenAI API
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 安全性注意事項

1. **Firebase Security Rules**
   - 配置 Firestore 規則，防止未授權訪問
   - 限制圖片上傳大小（最大 5MB）
   - 只允許特定用戶寫入

2. **API Key 保護**
   - 環境變數不得提交到 Git（使用 .gitignore）
   - 使用 Firebase App Check 保護 API
   - OpenAI API Key 應該在後端呼叫（如果可能）

3. **圖片處理**
   - 上傳前壓縮圖片
   - 限制檔案類型（只允許 .jpg, .png, .webp）
   - 防止重複上傳相同圖片

### 效能優化

1. **圖片優化**
   - 使用 WebP 格式
   - 壓縮圖片至 < 500KB
   - 實作 lazy loading

2. **Firebase 查詢優化**
   - 使用 Firestore 索引
   - 限制每頁查詢數量（分頁）
   - 快取常用查詢結果

3. **程式碼分割**
   - 路由層級的 code splitting
   - 動態載入圖表庫
   - Tree shaking 移除未使用代碼

### 常見問題（Gotchas）

1. **OpenAI Vision API 限制**
   - 圖片最大 20MB
   - 支援格式：PNG, JPEG, WEBP, GIF
   - 可能無法 100% 準確識別手寫文字
   - 需要提供清晰的圖片以提高識別率

2. **Firebase Pricing**
   - Firestore 讀寫次數有免費額度
   - Storage 儲存空間和流量有限制
   - 建議設定預算警報

3. **Tailwind CSS v4 問題**
   - **重要**：使用 Tailwind CSS v3（穩定版）
   - 安裝指令：`npm install -D tailwindcss@3 postcss@8 autoprefixer@10`
   - 避免使用 v4 的不穩定版本

4. **Vite 配置**
   - 如果使用 `minify: 'terser'`，必須安裝 `npm install -D terser`
   - 設定 `base: '/dune-stats/'` 以支援 GitHub Pages 部署

### 部署前檢查清單

- [ ] 所有環境變數已正確配置
- [ ] Firebase Security Rules 已設定
- [ ] Playwright E2E 測試全部通過
- [ ] MCP Chrome DevTools 檢查無 Console 錯誤
- [ ] GitHub Actions 配置正確
- [ ] 響應式設計在所有裝置上測試通過
- [ ] 圖片識別功能測試通過（至少 5 張不同圖片）
- [ ] 撤回功能正常運作
- [ ] 版本號顯示在 Console

### 專案特色（必須實現的浮誇效果）

1. **動畫效果**
   - 頁面切換使用 Framer Motion 的 fade/slide 動畫
   - 卡片 hover 效果（3D tilt + shadow）
   - 數字滾動動畫（統計數據）
   - 圖表載入動畫

2. **視覺設計**
   - 沙丘主題配色（參考電影海報）
   - Glassmorphism 玻璃態效果
   - Gradient 漸層背景（深藍到橘紅）
   - 自定義字體（可考慮使用 Google Fonts 的 Orbitron 或 Rajdhani）

3. **互動回饋**
   - 按鈕點擊有音效回饋（可選）
   - Loading 狀態使用沙丘相關圖示（如沙蟲）
   - Toast 通知（成功、錯誤、警告）
   - 拖放上傳時的視覺提示

### 成功標準

專案完成後，必須達到以下標準：

1. **功能完整性**
   - ✅ 可以上傳圖片並自動識別
   - ✅ 識別準確率 > 80%（測試至少 10 張圖片）
   - ✅ 撤回功能正常
   - ✅ 統計數據正確計算
   - ✅ 響應式設計完美適配

2. **程式碼品質**
   - ✅ TypeScript 無 any 類型（除非必要）
   - ✅ 所有組件有 PropTypes 或 Interface 定義
   - ✅ 無 ESLint 錯誤或警告
   - ✅ 程式碼有適當註解

3. **效能**
   - ✅ 首次載入時間 < 3 秒
   - ✅ 圖片識別時間 < 10 秒
   - ✅ Lighthouse 效能分數 > 90

4. **測試覆蓋**
   - ✅ E2E 測試覆蓋主要流程
   - ✅ 所有測試通過
   - ✅ 無 Console 錯誤

5. **部署**
   - ✅ GitHub Pages 自動部署成功
   - ✅ Repository About 包含網站連結
   - ✅ START.md 文件完整詳細
