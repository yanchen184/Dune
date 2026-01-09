import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { GameRecord, PlayerRecord } from '@/lib/types';

/**
 * 玩家名稱別名對照表（與 openai.ts 同步）
 */
const PLAYER_NAME_ALIASES: Record<string, string> = {
  'lukesuhaoo': 'lukehsuhao',
  'lukesuhao': 'lukehsuhao',
  'luke_suhao': 'lukehsuhao',
  'lukehsuhaoo': 'lukehsuhao',
};

/**
 * AI 玩家名稱列表（需要過濾掉的非真人玩家）
 */
const AI_PLAYER_NAMES: string[] = [
  '未知',
  '伊萊莎·伊卡茲',
  '「公主」尤娜·莫里特尼',
  '公主尤娜·莫里特尼',
  '尤娜·莫里特尼',
  'unknown',
  'ai',
  'bot',
  'npc',
];

/**
 * 標準化玩家名稱
 */
function normalizePlayerName(name: string): string {
  if (!name) return name;
  const lowerName = name.toLowerCase().trim();
  return PLAYER_NAME_ALIASES[lowerName] || name;
}

/**
 * 檢查是否為 AI 玩家
 */
function isAIPlayer(name: string): boolean {
  if (!name) return true;
  const lowerName = name.toLowerCase().trim();
  return AI_PLAYER_NAMES.some(aiName =>
    lowerName === aiName.toLowerCase() ||
    lowerName.includes(aiName.toLowerCase())
  );
}

export function useFirebase() {
  /**
   * Add a new game record to Firestore
   */
  const addGame = async (game: Omit<GameRecord, 'id'>): Promise<string> => {
    const db = getDb();
    if (!db) throw new Error('Firebase not initialized. Please configure in Settings.');

    try {
      const gamesRef = collection(db, 'games');
      const docRef = await addDoc(gamesRef, game);
      return docRef.id;
    } catch (error) {
      console.error('Error adding game:', error);
      throw new Error('Failed to add game record');
    }
  };

  /**
   * Delete a game record from Firestore
   */
  const deleteGame = async (id: string): Promise<void> => {
    const db = getDb();
    if (!db) throw new Error('Firebase not initialized. Please configure in Settings.');

    try {
      const gameDoc = doc(db, 'games', id);
      await deleteDoc(gameDoc);
    } catch (error) {
      console.error('Error deleting game:', error);
      throw new Error('Failed to delete game record');
    }
  };

  /**
   * Get all games or limit to a specific number
   */
  const getGames = async (limitCount?: number): Promise<GameRecord[]> => {
    const db = getDb();
    if (!db) throw new Error('Firebase not initialized. Please configure in Settings.');

    try {
      const gamesRef = collection(db, 'games');
      const q = limitCount
        ? query(gamesRef, orderBy('timestamp', 'desc'), limit(limitCount))
        : query(gamesRef, orderBy('timestamp', 'desc'));

      const querySnapshot = await getDocs(q);
      const games: GameRecord[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        games.push({
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to ISO string for consistent date handling
          timestamp: data.timestamp?.toDate?.() || data.timestamp,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        } as GameRecord);
      });

      return games;
    } catch (error) {
      console.error('Error getting games:', error);
      throw new Error('Failed to fetch game records');
    }
  };

  /**
   * Get the next game number (auto-increment)
   */
  const getNextGameNumber = async (): Promise<number> => {
    try {
      const games = await getGames();
      if (games.length === 0) return 1;

      const maxGameNumber = Math.max(...games.map(g => g.gameNumber));
      return maxGameNumber + 1;
    } catch (error) {
      console.error('Error getting next game number:', error);
      return 1; // Default to 1 if error
    }
  };

  /**
   * Update an existing game record
   */
  const updateGame = async (id: string, game: Partial<Omit<GameRecord, 'id'>>): Promise<void> => {
    const db = getDb();
    if (!db) throw new Error('Firebase not initialized. Please configure in Settings.');

    try {
      const gameDoc = doc(db, 'games', id);
      await updateDoc(gameDoc, game as any);
    } catch (error) {
      console.error('Error updating game:', error);
      throw new Error('Failed to update game record');
    }
  };

  /**
   * 修復過往數據：標準化玩家名稱 + 移除 AI 玩家
   * @returns 修復報告
   */
  const fixHistoricalData = async (): Promise<{
    totalGames: number;
    fixedGames: number;
    renamedPlayers: { from: string; to: string; gameId: string }[];
    removedAIPlayers: { name: string; gameId: string }[];
  }> => {
    const db = getDb();
    if (!db) throw new Error('Firebase not initialized. Please configure in Settings.');

    const report = {
      totalGames: 0,
      fixedGames: 0,
      renamedPlayers: [] as { from: string; to: string; gameId: string }[],
      removedAIPlayers: [] as { name: string; gameId: string }[],
    };

    try {
      const games = await getGames();
      report.totalGames = games.length;

      for (const game of games) {
        let needsUpdate = false;
        const originalPlayers = [...game.players];
        let updatedPlayers: PlayerRecord[] = [];

        for (const player of originalPlayers) {
          // 檢查是否為 AI 玩家
          if (isAIPlayer(player.name)) {
            report.removedAIPlayers.push({ name: player.name, gameId: game.id });
            needsUpdate = true;
            continue; // 跳過 AI 玩家
          }

          // 標準化名稱
          const normalizedName = normalizePlayerName(player.name);
          if (normalizedName !== player.name) {
            report.renamedPlayers.push({
              from: player.name,
              to: normalizedName,
              gameId: game.id,
            });
            needsUpdate = true;
          }

          updatedPlayers.push({
            ...player,
            name: normalizedName,
          });
        }

        // 如果有變更，更新資料庫
        if (needsUpdate) {
          await updateGame(game.id, { players: updatedPlayers });
          report.fixedGames++;
          console.log(`✅ Fixed game ${game.id} (Game #${game.gameNumber})`);
        }
      }

      console.log('📊 Data fix report:', report);
      return report;
    } catch (error) {
      console.error('Error fixing historical data:', error);
      throw new Error('Failed to fix historical data');
    }
  };

  return {
    addGame,
    deleteGame,
    updateGame,
    getGames,
    getNextGameNumber,
    fixHistoricalData,
  };
}
