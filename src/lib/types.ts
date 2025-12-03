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
  isWinner: boolean;               // Winner flag
}

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
