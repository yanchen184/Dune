name: "Dune Game Stats System - AI-Powered Board Game Result Tracker"
description: |

## Purpose
Build a complete React + TypeScript + Firebase + OpenAI Vision API web application for tracking Dune board game results with automatic image recognition, statistics, and a visually stunning UI.

## Core Principles
1. **Context is King**: All Firebase and OpenAI configurations are provided
2. **Validation Loops**: E2E tests with Playwright, MCP Chrome DevTools verification
3. **Information Dense**: Follow React 19 + Firebase best practices from official docs
4. **Progressive Success**: Start with basic structure, validate, then add AI features
5. **Global Rules**: Follow all rules in CLAUDE.md and INITIAL.md

---

## Goal

Build a **沙丘桌遊勝負結算統計系統** (Dune Board Game Stats Tracker) that:
- ✅ **Automatically recognizes game result images** using OpenAI Vision API
- ✅ **Stores game records** in Firebase Firestore with image URLs in Firebase Storage
- ✅ **Displays rich statistics** (player win rates, faction usage, score trends)
- ✅ **Features stunning visual design** with Dune theme, GSAP + Framer Motion animations
- ✅ **Supports undo functionality** with confirmation dialog
- ✅ **Deploys automatically** to GitHub Pages via GitHub Actions

## Why
- **User Value**: Eliminates manual data entry by auto-recognizing game photos
- **Social Gaming**: Friends can track their Dune game history and compete
- **Visual Wow Factor**: Immersive Dune-themed UI creates memorable experience
- **Portfolio Showcase**: Demonstrates AI integration, Firebase, and modern React skills

## What

### User-Visible Behavior
1. **Upload Game Result Photo** → AI extracts player names, factions, scores
2. **Preview & Edit Recognition Results** → Confirm or manually adjust data
3. **View Game History** → Card-based list with filters (date, player, faction)
4. **See Statistics** → Charts showing win rates, faction usage, score trends
5. **Undo Records** → Delete with confirmation dialog

### Technical Requirements
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Framer Motion + GSAP
- **Backend**: Firebase Firestore + Storage
- **AI**: OpenAI Vision API (GPT-4o)
- **Testing**: Playwright E2E tests
- **Deployment**: GitHub Actions → GitHub Pages
- **Validation**: MCP Chrome DevTools checks

### Success Criteria
- [x] Image upload and AI recognition works with >80% accuracy (tested on 10 images)
- [x] All game records stored in Firestore with proper timestamps
- [x] Statistics charts display correct data
- [x] Undo functionality works with confirmation
- [x] Responsive design works on mobile, tablet, desktop
- [x] All Playwright E2E tests pass
- [x] No Console errors in MCP Chrome DevTools
- [x] GitHub Actions deploys successfully
- [x] Lighthouse performance score > 90

---

## All Needed Context

### Documentation & References

```yaml
# Firebase Integration
- url: https://firebase.google.com/docs/firestore/best-practices
  why: Official Firestore best practices (500/50/5 traffic ramping rule, document ID guidelines)
  critical: Avoid monotonically increasing IDs, select database location closest to users

- url: https://firebase.google.com/docs/storage/web/upload-files
  why: Firebase Storage file upload patterns for images
  critical: Use ref() and uploadBytes() for file upload

- url: https://dev.to/sahilverma_dev/firebase-with-react-and-typescript-a-comprehensive-guide-3fn5
  why: Comprehensive React + Firebase + TypeScript integration guide
  pattern: Organize code with separate services for auth, firestore, storage

# OpenAI Vision API
- url: https://platform.openai.com/docs/guides/vision
  why: Official OpenAI Vision API guide
  critical: Support both image URLs and base64 encoded images, max 10 images per request

- url: https://platform.openai.com/docs/guides/vision?lang=node
  why: Node.js specific Vision API examples
  pattern: Use chat completions endpoint with image_url or base64 content

- url: https://www.cursor-ide.com/blog/gpt4o-image-api-guide-2025-english
  why: GPT-4o image API comprehensive guide (2025 updated)
  critical: Set max_tokens or output will be cut off

# React 19 & Modern Practices
- url: https://react.dev/
  why: Official React 19 documentation
  pattern: Use hooks, avoid class components

- url: https://www.framer.com/motion/
  why: Framer Motion animation library
  pattern: Use AnimatePresence for page transitions

- url: https://greensock.com/docs/
  why: GSAP animation library
  pattern: Use for complex scroll-based and timeline animations

# Tailwind CSS
- url: https://tailwindcss.com/docs
  why: Tailwind CSS v3 documentation
  critical: Use v3, not v4 (stability)

# Testing
- url: https://playwright.dev/
  why: Playwright E2E testing
  pattern: Use data-testid attributes for element selection

# Project Files
- file: D:\claude-mode\Dune\INITIAL.md
  why: Complete feature specification and requirements

- file: D:\claude-mode\Dune\CLAUDE.md
  why: Project development guidelines and conventions
```

### Firebase Configuration (ALREADY CONFIGURED)

```typescript
// Firebase config (user provided)
const firebaseConfig = {
  apiKey: "AIzaSyCPYykTmxJu9znACHIXw0XvOUFozBGZA3M",
  authDomain: "dune-7e2b9.firebaseapp.com",
  databaseURL: "https://dune-7e2b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dune-7e2b9",
  storageBucket: "dune-7e2b9.firebasestorage.app",
  messagingSenderId: "173857146074",
  appId: "1:173857146074:web:5825bf6bb4e1ce2bde91e3",
  measurementId: "G-DRYHX3SV1T"
};
```

### Current Codebase Tree
```bash
D:\claude-mode\Dune\
├── INITIAL.md          # Feature specification
├── CLAUDE.md           # Development guidelines
├── README.md           # Project overview
├── PRPs/               # Product Requirements Prompts
└── (no src/ yet - new project)
```

### Desired Codebase Tree (after implementation)

```bash
dune-game-stats/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions auto-deploy
├── e2e/
│   ├── game.spec.ts                # E2E tests (upload, recognition, undo)
│   └── stats.spec.ts               # Statistics tests
├── public/
│   ├── favicon.ico
│   └── dune-logo.svg               # Dune themed assets
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx          # Reusable button component
│   │   │   ├── Card.tsx            # Card component with animations
│   │   │   ├── Loading.tsx         # Sandworm loading animation (GSAP)
│   │   │   └── Toast.tsx           # Toast notifications
│   │   ├── Dashboard/
│   │   │   ├── index.tsx
│   │   │   ├── Dashboard.tsx       # Main dashboard layout
│   │   │   ├── StatsCard.tsx       # Statistics card component
│   │   │   └── RecentGames.tsx     # Recent games list
│   │   ├── Upload/
│   │   │   ├── index.tsx
│   │   │   ├── ImageUpload.tsx     # Drag-drop image upload
│   │   │   ├── RecognitionPreview.tsx  # AI results preview table
│   │   │   └── ConfirmDialog.tsx   # Confirmation dialog
│   │   ├── GameRecord/
│   │   │   ├── index.tsx
│   │   │   ├── GameCard.tsx        # Single game record card
│   │   │   ├── GameList.tsx        # List of game cards
│   │   │   └── FilterBar.tsx       # Filter controls
│   │   └── Statistics/
│   │       ├── index.tsx
│   │       ├── WinRateChart.tsx    # Player win rate pie chart
│   │       ├── FactionChart.tsx    # Faction usage bar chart
│   │       └── TrendChart.tsx      # Score trend line chart
│   ├── hooks/
│   │   ├── useFirebase.ts          # Firebase CRUD operations
│   │   ├── useVision.ts            # OpenAI Vision API integration
│   │   ├── useGames.ts             # Game data management
│   │   └── useToast.ts             # Toast notification hook
│   ├── lib/
│   │   ├── firebase.ts             # Firebase initialization
│   │   ├── openai.ts               # OpenAI client setup
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── utils.ts                # Utility functions
│   │   └── constants.ts            # Constants (colors, factions)
│   ├── pages/
│   │   ├── HomePage.tsx            # Dashboard page
│   │   ├── UploadPage.tsx          # Upload & recognition page
│   │   ├── HistoryPage.tsx         # Game history page
│   │   └── StatsPage.tsx           # Statistics page
│   ├── App.tsx                     # Main app with routing
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles + Tailwind
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
├── playwright.config.ts            # Playwright configuration
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind configuration (Dune theme)
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── START.md                        # Startup instructions (generated at end)
└── README.md                       # Project documentation (generated at end)
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Tailwind CSS Version
// ❌ DON'T use v4 (unstable)
// ✅ DO use v3: npm install -D tailwindcss@3 postcss@8 autoprefixer@10

// CRITICAL: Vite Configuration
// Must set base for GitHub Pages deployment
// vite.config.ts: base: '/Dune/'

// CRITICAL: OpenAI Vision API
// - Must set max_tokens or output will be truncated
// - Max 10 images per chat request
// - Support formats: PNG, JPEG, WEBP, GIF (max 20MB)

// CRITICAL: Firebase Firestore
// - Avoid document IDs: ".", "..", or containing "/"
// - Don't use monotonically increasing IDs (Customer1, Customer2...)
// - Follow 500/50/5 rule: Start with 500 ops/sec, increase 50% every 5 min

// CRITICAL: Image Upload
// - Compress images to < 500KB before upload
// - Use WebP format for optimal performance
// - Generate unique filenames: game-{gameNumber}-{timestamp}.webp

// CRITICAL: React 19
// - Use import.meta.env for environment variables (not process.env)
// - All Firebase operations must be async
// - Use Timestamp.now() from firebase/firestore, not Date.now()

// CRITICAL: MCP Chrome DevTools
// - Must check Console for errors after every feature implementation
// - Verify Firebase operations in Network tab
// - Test responsive design at breakpoints: 640px, 768px, 1024px, 1280px
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// src/lib/types.ts

import { Timestamp } from 'firebase/firestore';

/**
 * Main game record interface
 * Stored in Firestore collection: 'games'
 */
export interface GameRecord {
  id: string;                      // Firestore document ID
  gameNumber: number;              // Sequential game number (auto-increment)
  timestamp: Timestamp;            // Game timestamp
  imageUrl?: string;               // Firebase Storage URL (optional)
  players: PlayerRecord[];         // Array of player results
  createdAt: Timestamp;            // Record creation time
  recognitionConfidence?: number;  // AI confidence (0-1)
}

/**
 * Individual player record within a game
 */
export interface PlayerRecord {
  name: string;                    // Player name
  faction: DuneFaction;            // Faction played
  score: number;                   // Final score
  isWinner: boolean;               // Winner flag
}

/**
 * Dune factions enum
 */
export type DuneFaction =
  | 'Atreides'
  | 'Harkonnen'
  | 'Emperor'
  | 'Fremen'
  | 'Bene Gesserit'
  | 'Spacing Guild'
  | 'Unknown';  // If AI can't recognize

/**
 * OpenAI Vision API response format
 */
export interface VisionRecognitionResult {
  players: {
    name: string;
    faction: string;
    score: number;
    isWinner: boolean;
  }[];
  confidence: number;  // 0-1 confidence score
}

/**
 * Statistics aggregation types
 */
export interface PlayerStats {
  name: string;
  totalGames: number;
  wins: number;
  winRate: number;         // Percentage
  averageScore: number;
  favoriteRaction: DuneFaction;
}

export interface FactionStats {
  faction: DuneFaction;
  timesPlayed: number;
  wins: number;
  winRate: number;
  averageScore: number;
}
```

### Task List (in order of completion)

```yaml
PHASE 1: Project Setup & Configuration (Foundation)
─────────────────────────────────────────────────────
Task 1.1: Initialize Vite React TypeScript Project
  Command: |
    npm create vite@latest . -- --template react-ts
    npm install

Task 1.2: Install Core Dependencies
  Command: |
    # Core dependencies
    npm install firebase react-router-dom framer-motion gsap

    # UI & Charts
    npm install recharts react-countup

    # Utilities
    npm install openai date-fns clsx

    # Dev dependencies
    npm install -D tailwindcss@3 postcss@8 autoprefixer@10
    npm install -D @playwright/test
    npm install -D @types/node
    npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

Task 1.3: Configure Tailwind CSS with Dune Theme
  CREATE tailwind.config.js:
    - PATTERN: Extend theme with custom Dune colors
    - COLORS: sand (#D4A574), spice (#FF6B35), deep (#1A1A2E), sky (#16213E), dark (#0F0E17)
    - FONTS: Add Google Fonts (Orbitron for headers, Rajdhani for body)

  CREATE postcss.config.js:
    - PATTERN: Standard PostCSS setup for Tailwind v3

  MODIFY src/index.css:
    - IMPORT Tailwind directives
    - ADD custom font imports from Google Fonts

Task 1.4: Configure Vite for GitHub Pages
  MODIFY vite.config.ts:
    - SET base: '/Dune/'
    - CONFIGURE @ alias for src/
    - SET build.outDir: 'dist'

Task 1.5: Create Environment Variables
  CREATE .env.example:
    - LIST all required env vars (Firebase, OpenAI)

  CREATE .env (user will fill):
    - Firebase config vars (VITE_FIREBASE_*)
    - OpenAI API key (VITE_OPENAI_API_KEY)

Task 1.6: Setup TypeScript Configuration
  MODIFY tsconfig.json:
    - ENABLE strict mode
    - CONFIGURE path aliases (@/*)
    - SET target: ES2022

VALIDATION CHECKPOINT 1:
  ✓ npm run dev starts without errors
  ✓ Tailwind styles applied to default App.tsx
  ✓ No TypeScript errors: npx tsc --noEmit

─────────────────────────────────────────────────────
PHASE 2: Firebase & OpenAI Integration (Core Services)
─────────────────────────────────────────────────────
Task 2.1: Firebase Initialization
  CREATE src/lib/firebase.ts:
    - IMPORT initializeApp, getFirestore, getStorage, getAnalytics
    - INITIALIZE with firebaseConfig from env vars
    - EXPORT db, storage, analytics instances

  GOTCHA: Use import.meta.env.VITE_*, not process.env

Task 2.2: Firebase Types & Constants
  CREATE src/lib/types.ts:
    - DEFINE all interfaces from Data Models section above
    - EXPORT DuneFaction type

  CREATE src/lib/constants.ts:
    - DEFINE DUNE_FACTIONS array
    - DEFINE DUNE_COLORS mapping
    - DEFINE MAX_FILE_SIZE (5MB)

Task 2.3: OpenAI Client Setup
  CREATE src/lib/openai.ts:
    - IMPORT OpenAI from 'openai'
    - INITIALIZE client with API key from env
    - EXPORT configured client

  FUNCTION analyzeGameImage(imageBase64: string):
    - CALL client.chat.completions.create()
    - MODEL: 'gpt-4o'
    - MESSAGES: System prompt + user image
    - MAX_TOKENS: 500
    - RETURN parsed VisionRecognitionResult

Task 2.4: Firebase Hooks - useFirebase
  CREATE src/hooks/useFirebase.ts:
    - HOOK useFirebase() returns CRUD operations
    - FUNCTION addGame(game: Omit<GameRecord, 'id'>)
    - FUNCTION deleteGame(id: string)
    - FUNCTION getGames(limit?: number)
    - FUNCTION getNextGameNumber()
    - PATTERN: Use collection(), addDoc(), deleteDoc(), query(), orderBy()

  GOTCHA: Always use Timestamp.now() from firebase/firestore

Task 2.5: Storage Hook - useStorage
  CREATE src/hooks/useStorage.ts:
    - HOOK useStorage() returns upload/delete operations
    - FUNCTION uploadImage(file: File, gameNumber: number)
      - Compress image to < 500KB
      - Convert to WebP format
      - Generate filename: game-{gameNumber}-{timestamp}.webp
      - Upload to Firebase Storage
      - Return download URL
    - FUNCTION deleteImage(url: string)

Task 2.6: Vision Hook - useVision
  CREATE src/hooks/useVision.ts:
    - HOOK useVision() returns { analyzeImage, loading, error }
    - FUNCTION analyzeImage(file: File)
      - Convert file to base64
      - Call OpenAI Vision API
      - Parse JSON response
      - Retry up to 3 times on failure
      - Return VisionRecognitionResult

  PROMPT TEMPLATE:
    """
    分析這張沙丘桌遊的結算圖片，提取以下資訊。
    請以JSON格式返回：
    {
      "players": [
        {
          "name": "玩家名稱",
          "faction": "角色英文名稱",
          "score": 分數(數字),
          "isWinner": 是否勝利(布林值)
        }
      ],
      "confidence": 識別信心度(0-1)
    }

    角色名稱必須是: Atreides, Harkonnen, Emperor, Fremen, Bene Gesserit, Spacing Guild
    最高分者為勝利者。無法識別的欄位用null。
    """

VALIDATION CHECKPOINT 2:
  ✓ Firebase connection works (check Firebase Console)
  ✓ OpenAI API call returns valid JSON
  ✓ Test image upload to Storage
  ✓ No Console errors in MCP Chrome DevTools

─────────────────────────────────────────────────────
PHASE 3: UI Components (Visual Foundation)
─────────────────────────────────────────────────────
Task 3.1: Common Components - Button
  CREATE src/components/common/Button.tsx:
    - PROPS: variant ('primary' | 'secondary' | 'danger'), onClick, children, disabled
    - STYLE: Tailwind classes with Dune theme colors
    - ANIMATION: Framer Motion hover scale, tap feedback

Task 3.2: Common Components - Card
  CREATE src/components/common/Card.tsx:
    - PROPS: children, className, onClick
    - STYLE: Glassmorphism effect with backdrop-blur
    - ANIMATION: Framer Motion initial/animate, hover 3D tilt (react-tilt)

Task 3.3: Common Components - Loading
  CREATE src/components/common/Loading.tsx:
    - ANIMATION: GSAP sandworm animation (sine wave motion)
    - STYLE: Dune spice color gradient
    - TEXT: "Analyzing image..." or custom message

Task 3.4: Common Components - Toast
  CREATE src/components/common/Toast.tsx:
    - CREATE src/hooks/useToast.ts
    - HOOK: useToast() returns { showToast(message, type) }
    - TYPES: 'success' | 'error' | 'info'
    - ANIMATION: Framer Motion slide in from top
    - AUTO-DISMISS: After 3 seconds

Task 3.5: Dashboard - StatsCard
  CREATE src/components/Dashboard/StatsCard.tsx:
    - PROPS: title, value, icon, trend (up/down)
    - ANIMATION: React CountUp for number animation
    - STYLE: Gradient background with Dune colors

Task 3.6: Dashboard - RecentGames
  CREATE src/components/Dashboard/RecentGames.tsx:
    - FETCH latest 5 games from Firestore
    - DISPLAY in compact card list
    - LINK to full history page

Task 3.7: Dashboard - Main Layout
  CREATE src/components/Dashboard/Dashboard.tsx:
    - LAYOUT: Grid of StatsCards + RecentGames
    - STATS: Total games, average score, most played faction
    - FAB: Floating action button to upload new game

VALIDATION CHECKPOINT 3:
  ✓ All components render without errors
  ✓ Animations smooth (60 FPS)
  ✓ Responsive layout works on mobile/tablet/desktop
  ✓ MCP Chrome DevTools: No layout shift warnings

─────────────────────────────────────────────────────
PHASE 4: Upload & Recognition Feature (Core AI Feature)
─────────────────────────────────────────────────────
Task 4.1: Image Upload Component
  CREATE src/components/Upload/ImageUpload.tsx:
    - FEATURE: Drag & drop area + file input
    - ACCEPT: .jpg, .png, .webp
    - MAX SIZE: 5MB (show error if exceeded)
    - PREVIEW: Show thumbnail after selection
    - ANIMATION: Dashed border pulse on drag over

Task 4.2: Recognition Preview Component
  CREATE src/components/Upload/RecognitionPreview.tsx:
    - PROPS: recognitionResult, onEdit, onConfirm, onCancel
    - LAYOUT: Editable table with player data
    - VALIDATION: Ensure all fields filled, scores are numbers
    - ALLOW: Manual editing before confirmation

Task 4.3: Confirm Dialog Component
  CREATE src/components/Upload/ConfirmDialog.tsx:
    - PROPS: isOpen, title, message, onConfirm, onCancel
    - STYLE: Modal overlay with blur background
    - ANIMATION: Framer Motion scale entrance

Task 4.4: Upload Page Integration
  CREATE src/pages/UploadPage.tsx:
    - FLOW:
      1. User uploads image → Show loading
      2. Call useVision.analyzeImage()
      3. Show RecognitionPreview with editable results
      4. User confirms → Call useStorage.uploadImage() + useFirebase.addGame()
      5. Show success toast → Redirect to history
    - ERROR HANDLING: Show error toast if AI fails, allow manual entry

VALIDATION CHECKPOINT 4:
  ✓ Image upload works (check Firebase Storage)
  ✓ OpenAI Vision API returns valid results
  ✓ Recognition preview displays correctly
  ✓ Game record saved to Firestore
  ✓ Test with 5 different images, accuracy > 80%
  ✓ MCP Chrome DevTools: Verify API calls in Network tab

─────────────────────────────────────────────────────
PHASE 5: Game History & Undo Feature
─────────────────────────────────────────────────────
Task 5.1: Game Card Component
  CREATE src/components/GameRecord/GameCard.tsx:
    - PROPS: game (GameRecord), onDelete
    - DISPLAY: Game number, date, players, scores, winner
    - ACTION: Delete button (shows confirm dialog)
    - ANIMATION: Framer Motion exit animation on delete

Task 5.2: Filter Bar Component
  CREATE src/components/GameRecord/FilterBar.tsx:
    - FILTERS: Date range, player name, faction
    - SORT: By date (newest/oldest), by score
    - STYLE: Sticky top bar with Dune theme

Task 5.3: Game List Component
  CREATE src/components/GameRecord/GameList.tsx:
    - FETCH games from Firestore
    - APPLY filters and sorting
    - DISPLAY as grid of GameCard components
    - PAGINATION: Show 20 per page

Task 5.4: History Page Integration
  CREATE src/pages/HistoryPage.tsx:
    - LAYOUT: FilterBar + GameList
    - DELETE FLOW:
      1. User clicks delete → Show ConfirmDialog
      2. User confirms → Call useFirebase.deleteGame()
      3. Delete image from Storage (if exists)
      4. Show success toast → Remove from list
    - EMPTY STATE: Show message if no games

VALIDATION CHECKPOINT 5:
  ✓ Game list displays correctly
  ✓ Filters work properly
  ✓ Delete confirmation works
  ✓ Game and image deleted from Firebase
  ✓ List updates after delete
  ✓ MCP Chrome DevTools: No errors

─────────────────────────────────────────────────────
PHASE 6: Statistics & Charts
─────────────────────────────────────────────────────
Task 6.1: Statistics Hook - useStats
  CREATE src/hooks/useStats.ts:
    - FUNCTION calculatePlayerStats(games: GameRecord[]): PlayerStats[]
    - FUNCTION calculateFactionStats(games: GameRecord[]): FactionStats[]
    - FUNCTION calculateScoreTrend(games: GameRecord[])
    - MEMOIZE results with useMemo

Task 6.2: Win Rate Chart Component
  CREATE src/components/Statistics/WinRateChart.tsx:
    - LIBRARY: Recharts PieChart
    - DATA: Player win rates
    - STYLE: Dune theme colors
    - ANIMATION: Entrance animation with Framer Motion

Task 6.3: Faction Chart Component
  CREATE src/components/Statistics/FactionChart.tsx:
    - LIBRARY: Recharts BarChart
    - DATA: Faction usage frequency and win rates
    - TOOLTIP: Show detailed stats on hover

Task 6.4: Trend Chart Component
  CREATE src/components/Statistics/TrendChart.tsx:
    - LIBRARY: Recharts LineChart
    - DATA: Average scores over time
    - X-AXIS: Date
    - Y-AXIS: Score

Task 6.5: Statistics Page Integration
  CREATE src/pages/StatsPage.tsx:
    - LAYOUT: Grid of charts
    - FETCH all games from Firestore
    - CALCULATE stats with useStats hook
    - EMPTY STATE: Show message if < 3 games

VALIDATION CHECKPOINT 6:
  ✓ All charts render correctly
  ✓ Data calculations accurate
  ✓ Charts responsive on all devices
  ✓ Animations smooth
  ✓ MCP Chrome DevTools: No errors

─────────────────────────────────────────────────────
PHASE 7: Routing & App Integration
─────────────────────────────────────────────────────
Task 7.1: Setup React Router
  MODIFY src/App.tsx:
    - IMPORT BrowserRouter, Routes, Route
    - ROUTES:
      - / → HomePage (Dashboard)
      - /upload → UploadPage
      - /history → HistoryPage
      - /stats → StatsPage

Task 7.2: Navigation Component
  CREATE src/components/common/Navigation.tsx:
    - STYLE: Bottom navigation bar (mobile) or sidebar (desktop)
    - LINKS: Home, Upload, History, Stats
    - ACTIVE STATE: Highlight current route
    - ANIMATION: Framer Motion transitions

Task 7.3: Page Transitions
  MODIFY src/App.tsx:
    - WRAP Routes with AnimatePresence
    - ADD exit/enter animations for page switches
    - PATTERN: Fade + slide transitions

VALIDATION CHECKPOINT 7:
  ✓ Navigation works
  ✓ All pages accessible
  ✓ Page transitions smooth
  ✓ Browser back/forward works
  ✓ MCP Chrome DevTools: No routing errors

─────────────────────────────────────────────────────
PHASE 8: Testing (E2E with Playwright)
─────────────────────────────────────────────────────
Task 8.1: Playwright Configuration
  CREATE playwright.config.ts:
    - BASE URL: http://localhost:5173
    - BROWSERS: chromium, firefox, webkit
    - WEB SERVER: npm run dev

Task 8.2: Upload Flow Test
  CREATE e2e/game.spec.ts:
    - TEST: "should upload image and recognize game data"
      1. Navigate to /upload
      2. Upload test image
      3. Wait for AI recognition
      4. Verify preview table shows data
      5. Click confirm
      6. Verify success toast
      7. Verify game in history

    - TEST: "should allow manual editing of recognition results"
      1. Upload image
      2. Edit player name in preview
      3. Confirm
      4. Verify edited data saved

Task 8.3: History & Delete Test
  CREATE e2e/game.spec.ts:
    - TEST: "should delete game with confirmation"
      1. Navigate to /history
      2. Click delete on first game
      3. Verify confirm dialog appears
      4. Click confirm
      5. Verify game removed from list
      6. Verify success toast

Task 8.4: Statistics Test
  CREATE e2e/stats.spec.ts:
    - TEST: "should display statistics charts"
      1. Navigate to /stats
      2. Verify charts visible
      3. Verify data matches expected calculations

    - TEST: "should show empty state with no games"
      1. Delete all games
      2. Navigate to /stats
      3. Verify empty state message

Task 8.5: Responsive Test
  CREATE e2e/responsive.spec.ts:
    - TEST mobile (375x667), tablet (768x1024), desktop (1920x1080)
    - VERIFY all pages render correctly
    - VERIFY navigation works on all sizes

VALIDATION CHECKPOINT 8:
  ✓ Run: npm run test
  ✓ All tests pass
  ✓ No flaky tests
  ✓ Visual regression screenshots look correct

─────────────────────────────────────────────────────
PHASE 9: Deployment & CI/CD
─────────────────────────────────────────────────────
Task 9.1: GitHub Actions Workflow
  CREATE .github/workflows/deploy.yml:
    - TRIGGER: push to main branch
    - JOBS:
      1. Checkout code
      2. Setup Node.js 22.12.0
      3. Install dependencies (npm ci)
      4. Run tests (npm run test)
      5. Build project (npm run build)
      6. Deploy to GitHub Pages
    - PERMISSIONS: contents: read, pages: write, id-token: write

Task 9.2: Environment Variables in GitHub
  - ADD secrets in GitHub repository settings:
    - VITE_FIREBASE_* (all Firebase config vars)
    - VITE_OPENAI_API_KEY
  - REFERENCE in deploy.yml

Task 9.3: Firebase Security Rules
  CREATE firestore.rules:
    - ALLOW public read for 'games' collection
    - REQUIRE authentication for write operations

  CREATE storage.rules:
    - ALLOW public read for game images
    - REQUIRE authentication for upload/delete

Task 9.4: Repository Configuration
  - ENABLE GitHub Pages in repository settings
  - SOURCE: GitHub Actions
  - UPDATE Repository About with website URL

VALIDATION CHECKPOINT 9:
  ✓ Push to main triggers deployment
  ✓ GitHub Actions workflow succeeds (green checkmark)
  ✓ Website accessible at https://yanchen184.github.io/Dune/
  ✓ All features work on production
  ✓ No Console errors in production
  ✓ Lighthouse score > 90

─────────────────────────────────────────────────────
PHASE 10: Documentation & Final Polish
─────────────────────────────────────────────────────
Task 10.1: Generate START.md
  CREATE START.md:
    - SECTION: Prerequisites (Node.js, Git)
    - SECTION: Installation (clone, npm install)
    - SECTION: Environment Setup (.env configuration)
    - SECTION: Development (npm run dev)
    - SECTION: Testing (npm run test, test:ui)
    - SECTION: Deployment (automatic via GitHub Actions)
    - SECTION: Troubleshooting (common issues)

Task 10.2: Generate README.md
  CREATE README.md:
    - HEADER: Project title, description, live demo link
    - FEATURES: Bullet list of main features
    - TECH STACK: List all technologies
    - SCREENSHOTS: Add 3-4 screenshots
    - SETUP: Link to START.md
    - LICENSE: MIT
    - AUTHOR: Your name and links

Task 10.3: Version Management
  - UPDATE package.json version to 1.0.0
  - ADD console.log in main.tsx:
    console.log('🎮 Dune Stats Version: v1.0.0')
    console.log('📅 Build Date:', new Date().toISOString())

Task 10.4: Final MCP Chrome DevTools Check
  - START dev server: npm run dev
  - OPEN in Chrome with MCP DevTools
  - CHECK Console: No errors or warnings
  - CHECK Network: All requests successful
  - CHECK Performance: No layout shifts
  - TEST all features end-to-end
  - TEST on mobile, tablet, desktop viewports

VALIDATION CHECKPOINT 10:
  ✓ START.md complete and accurate
  ✓ README.md professional and clear
  ✓ Version displayed in console
  ✓ MCP Chrome DevTools: All checks pass
  ✓ GitHub Repository About updated with website link

```

### Integration Points

```yaml
FIREBASE:
  Firestore Collection:
    - Name: 'games'
    - Indexes: gameNumber (desc), timestamp (desc)

  Storage Bucket:
    - Path: /game-images/{gameNumber}-{timestamp}.webp
    - Max size: 5MB per image

  Security Rules:
    - Firestore: Public read, authenticated write
    - Storage: Public read, authenticated write

OPENAI:
  Model: gpt-4o
  Endpoint: /v1/chat/completions
  Max tokens: 500
  Temperature: 0.3 (for consistent JSON output)

ENVIRONMENT VARIABLES (.env):
  VITE_FIREBASE_API_KEY=<from user config>
  VITE_FIREBASE_AUTH_DOMAIN=dune-7e2b9.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=dune-7e2b9
  VITE_FIREBASE_STORAGE_BUCKET=dune-7e2b9.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID=173857146074
  VITE_FIREBASE_APP_ID=1:173857146074:web:5825bf6bb4e1ce2bde91e3
  VITE_FIREBASE_MEASUREMENT_ID=G-DRYHX3SV1T
  VITE_OPENAI_API_KEY=sk-proj-...

GITHUB PAGES:
  Base URL: /Dune/
  Build directory: dist/
  Node version: 22.12.0
```

---

## Validation Loop

### Level 1: Development Environment
```bash
# Start dev server
npm run dev

# Expected: Server starts on http://localhost:5173
# Expected: No compilation errors
# Expected: Tailwind styles apply correctly
```

### Level 2: TypeScript & Linting
```bash
# Type checking
npx tsc --noEmit

# Expected: No type errors
# If errors: Read error message, fix types, re-run

# Linting (if ESLint configured)
npm run lint

# Expected: No errors or warnings
```

### Level 3: MCP Chrome DevTools Validation
```bash
# 1. Start dev server
npm run dev

# 2. Open http://localhost:5173 in Chrome with MCP DevTools enabled

# 3. Check Console tab:
#    - No errors or warnings
#    - Version number displayed: "🎮 Dune Stats Version: v1.0.0"

# 4. Check Network tab:
#    - Firebase API calls return 200
#    - OpenAI API calls return 200
#    - Images load correctly from Storage

# 5. Test features manually:
#    - Upload image → AI recognition works
#    - View history → Games display correctly
#    - Delete game → Confirm dialog → Game deleted
#    - View stats → Charts display correctly

# 6. Test responsive design:
#    - Mobile (375px): Layout adapts, navigation works
#    - Tablet (768px): Grid adjusts properly
#    - Desktop (1920px): Full layout displays

# Expected: ALL checks pass
# If failing: Read console errors, fix issues, re-test
```

### Level 4: E2E Tests (Playwright)
```bash
# Run all tests
npm run test

# Expected: All tests pass
# If failing: Read test output, fix code, re-run

# Run in UI mode (visual debugging)
npm run test:ui

# Run in headed mode (watch browser)
npm run test:headed

# Expected:
#  - Upload flow works end-to-end
#  - Delete flow works with confirmation
#  - Statistics display correctly
#  - Responsive layouts work
```

### Level 5: Build & Preview
```bash
# Build production version
npm run build

# Expected: Build succeeds without errors
# Expected: dist/ directory created

# Preview production build
npm run preview

# Expected: Server starts on http://localhost:4173
# Expected: App works identically to dev mode
# Expected: Lighthouse score > 90
```

### Level 6: Firebase Integration Test
```bash
# Test Firebase operations manually:

# 1. Upload a game image
# 2. Check Firebase Console → Storage → Verify image uploaded
# 3. Check Firebase Console → Firestore → Verify game document created
# 4. Delete a game
# 5. Check Firebase Console → Verify document deleted
# 6. Check Firebase Console → Verify image deleted from Storage

# Expected: All operations reflected in Firebase Console
```

### Level 7: OpenAI API Test
```bash
# Test with multiple images:

# 1. Prepare 10 different game result images
# 2. Upload each one and record AI recognition results
# 3. Calculate accuracy rate: (correct recognitions / 10) * 100

# Expected: Accuracy > 80%
# If < 80%: Refine prompt, add more examples, adjust max_tokens
```

---

## Final Validation Checklist

Before marking this PRP as complete, ALL must pass:

### Functionality
- [ ] Image upload works (drag & drop + file input)
- [ ] AI recognition works with >80% accuracy (tested on 10 images)
- [ ] Recognition preview allows manual editing
- [ ] Game records save to Firestore correctly
- [ ] Images save to Firebase Storage correctly
- [ ] Game history displays all games
- [ ] Filters and sorting work correctly
- [ ] Delete with confirmation works
- [ ] Delete removes game from Firestore and image from Storage
- [ ] Statistics calculate correctly
- [ ] All charts display correctly
- [ ] Navigation works between all pages

### Code Quality
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No ESLint errors: `npm run lint`
- [ ] All components have proper TypeScript interfaces
- [ ] No `any` types (except where necessary with comments)
- [ ] Code organized according to folder structure
- [ ] No files exceed 500 lines

### Testing
- [ ] All Playwright tests pass: `npm run test`
- [ ] Upload flow test passes
- [ ] Delete flow test passes
- [ ] Statistics test passes
- [ ] Responsive tests pass (mobile, tablet, desktop)
- [ ] No flaky tests

### MCP Chrome DevTools
- [ ] No Console errors or warnings
- [ ] Firebase API calls successful (Network tab)
- [ ] OpenAI API calls successful (Network tab)
- [ ] All images load correctly
- [ ] No layout shift warnings (Performance tab)
- [ ] Version number displays in Console

### Performance
- [ ] First load < 3 seconds
- [ ] AI recognition < 10 seconds
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 90
- [ ] No unnecessary re-renders

### Responsive Design
- [ ] Mobile (375x667): All features work, readable text, buttons clickable
- [ ] Tablet (768x1024): Layout adjusts properly, navigation accessible
- [ ] Desktop (1920x1080): Full layout displays, no horizontal scroll

### Deployment
- [ ] GitHub Actions workflow configured
- [ ] GitHub Actions workflow succeeds
- [ ] Website accessible at https://yanchen184.github.io/Dune/
- [ ] All features work on production
- [ ] No Console errors on production
- [ ] Firebase Security Rules deployed

### Documentation
- [ ] START.md complete and accurate
- [ ] README.md professional and clear
- [ ] .env.example includes all required vars
- [ ] All documentation up-to-date
- [ ] GitHub Repository About includes website link

---

## Anti-Patterns to Avoid

**Firebase:**
- ❌ Don't use document IDs like ".", "..", or containing "/"
- ❌ Don't use monotonically increasing IDs (game1, game2...)
- ❌ Don't initialize Firebase multiple times
- ❌ Don't forget to delete Storage images when deleting games
- ❌ Don't skip the 500/50/5 traffic ramping rule for new collections

**OpenAI Vision API:**
- ❌ Don't forget to set max_tokens (output will be truncated)
- ❌ Don't send more than 10 images per request
- ❌ Don't hardcode API keys (use environment variables)
- ❌ Don't skip error handling and retry logic
- ❌ Don't assume 100% accuracy (always allow manual editing)

**React & TypeScript:**
- ❌ Don't use `any` type without necessity
- ❌ Don't use `process.env` (use `import.meta.env` in Vite)
- ❌ Don't mix Date.now() with Timestamp.now() (always use Timestamp)
- ❌ Don't create components without interfaces
- ❌ Don't skip useEffect dependencies

**Tailwind CSS:**
- ❌ Don't install Tailwind v4 (use v3 for stability)
- ❌ Don't write custom CSS instead of using Tailwind utilities
- ❌ Don't forget to configure PostCSS
- ❌ Don't use pure white text without checking contrast

**Testing:**
- ❌ Don't skip E2E tests
- ❌ Don't mock to make tests pass (fix the actual code)
- ❌ Don't commit without running tests locally
- ❌ Don't ignore failing tests in CI/CD

**Deployment:**
- ❌ Don't forget to set Vite base URL for GitHub Pages
- ❌ Don't commit .env file to Git
- ❌ Don't skip GitHub Pages configuration (Source: GitHub Actions)
- ❌ Don't forget to update Repository About with website link

---

## PRP Confidence Score: 9/10

**Strengths:**
- ✅ Complete Firebase configuration provided by user
- ✅ Comprehensive task breakdown with clear dependencies
- ✅ Extensive context from official documentation
- ✅ Detailed validation loops at each phase
- ✅ All gotchas and anti-patterns documented
- ✅ Real examples and patterns from research

**Potential Challenges:**
- ⚠️ OpenAI Vision API accuracy depends on image quality (user should test with real images)
- ⚠️ Dune theme design requires artistic judgment (color balance, animations)
- ⚠️ First-time AI agent may need 1-2 iterations to perfect animations

**Recommendation:**
Execute this PRP with `react-firebase-engineer` and `frontend-ui-designer` agents in parallel for optimal results. Use `qa-engineer` agent for final validation before deployment.

---

## Sources

**Firebase Best Practices:**
- [Firebase Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase with React and TypeScript Guide](https://dev.to/sahilverma_dev/firebase-with-react-and-typescript-a-comprehensive-guide-3fn5)
- [Best practices for Cloud Firestore and React](https://stackoverflow.com/questions/71898061/best-practices-for-using-cloud-firestore-and-reactjs)

**OpenAI Vision API:**
- [OpenAI Vision API Official Guide](https://platform.openai.com/docs/guides/vision)
- [OpenAI Vision API Node.js Examples](https://platform.openai.com/docs/guides/vision?lang=node)
- [GPT-4o Image API Comprehensive Guide 2025](https://www.cursor-ide.com/blog/gpt4o-image-api-guide-2025-english)
- [Image Analysis with GPT-4 Vision Tutorial](https://www.kodeco.com/ai/programs/ai-apis/cloud-based-ai/45598588-multimodal-integration-with-openai/02-image-analysis-with-gpt-4-vision/03)

**React & Modern Practices:**
- [Official React 19 Documentation](https://react.dev/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Tailwind CSS v3 Documentation](https://tailwindcss.com/docs)
- [Playwright Testing Documentation](https://playwright.dev/)
