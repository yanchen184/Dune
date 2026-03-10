import { Timestamp } from 'firebase/firestore';

/**
 * Dune factions enum (supports both English and Chinese names)
 */
export type DuneFaction =
  | 'Atreides'
  | 'Harkonnen'
  | 'Emperor'
  | 'Fremen'
  | 'Bene Gesserit'
  | 'Spacing Guild'
  | 'Count Memnon Thorvald'
  | 'Helena Richese'
  | 'Glossu Rabban'
  | '亞崔迪'
  | '哈肯能'
  | '皇帝'
  | '弗雷曼'
  | '貝尼·傑瑟里特'
  | '間行會'
  | '梅農·索瓦爾德伯爵'
  | '海倫娜·里奇斯'
  | '格羅蘇·拉班'
  | 'Unknown';

/**
 * Individual player record within a game
 */
export interface PlayerRecord {
  name: string;                    // Player name
  faction: DuneFaction;            // Faction played
  score: number;                   // Final score
  spice?: number;                  // Spice count (optional, for tiebreaker)
  coins?: number;                  // Coin count (optional, for tiebreaker)
  isWinner: boolean;               // Winner flag
}

/**
 * Main game record interface
 * Stored in Firestore collection: 'games'
 */
export interface GameRecord {
  id: string;                      // Firestore document ID
  gameNumber: number;              // Sequential game number (auto-increment)
  timestamp: Date | Timestamp;     // Game timestamp (converted to Date when read from Firestore)
  imageUrl?: string;               // Firebase Storage URL (optional, legacy)
  imageData?: string;              // Base64 encoded image (optional, new method)
  players: PlayerRecord[];         // Array of player results
  createdAt: Date | Timestamp;     // Record creation time (converted to Date when read from Firestore)
  recognitionConfidence?: number;  // AI confidence (0-1)
  recognitionHistory?: RecognitionRecord[];  // 歷次 AI 識別結果
  hasImage?: boolean;              // 是否有圖片（列表用，避免載入 imageData）
}

/**
 * OpenAI Vision API response format
 */
export interface VisionRecognitionResult {
  players: {
    name: string;
    faction: string;
    score: number;
    spice?: number;      // Optional spice count
    coins?: number;      // Optional coin count
    isWinner: boolean;
  }[];
  confidence: number;  // 0-1 confidence score
}

/**
 * 單次 AI 識別結果紀錄
 */
export interface RecognitionRecord {
  id: string;                        // 唯一識別碼
  timestamp: Date | Timestamp;       // 識別時間
  players: PlayerRecord[];           // 識別出的玩家資料
  confidence: number;                // AI 信心度
  isApplied: boolean;                // 是否為目前套用的版本
  hint?: string;                     // 使用者提供的錯誤提示
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
  favoriteFaction: DuneFaction;
}

export interface FactionStats {
  faction: DuneFaction;
  timesPlayed: number;
  wins: number;
  winRate: number;
  averageScore: number;
}

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
