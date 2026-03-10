import {
  collection,
  addDoc,
  deleteDoc,
  deleteField,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
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
   * Reason: imageData 存到獨立集合 gameImages 以避免列表查詢下載大量圖片資料
   */
  const addGame = async (game: Omit<GameRecord, 'id'>): Promise<string> => {
    const db = getDb();
    if (!db) throw new Error('Firebase not initialized. Please configure in Settings.');

    try {
      const { imageData, ...gameWithoutImage } = game as any;
      const gamesRef = collection(db, 'games');
      const docRef = await addDoc(gamesRef, {
        ...gameWithoutImage,
        hasImage: !!imageData,
      });

      // 圖片資料存到獨立集合
      if (imageData) {
        const imageDoc = doc(db, 'gameImages', docRef.id);
        await setDoc(imageDoc, { imageData });
      }

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
   * Reason: 排除 imageData 欄位以大幅減少傳輸量（44 筆含圖片 = 1.8MB → 排除後 < 50KB）
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

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        const { imageData, ...rest } = data;
        games.push({
          id: docSnap.id,
          ...rest,
          hasImage: !!(data.hasImage || imageData || data.imageUrl),
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
   * 取得單筆遊戲的圖片資料（僅在需要時才載入）
   * Reason: 優先從獨立集合 gameImages 讀取，回退到 games 文件中的舊資料
   */
  const getGameImage = async (gameId: string): Promise<string | null> => {
    const db = getDb();
    if (!db) return null;

    try {
      // 先查獨立集合
      const imageDocRef = doc(db, 'gameImages', gameId);
      const imageSnap = await getDoc(imageDocRef);
      if (imageSnap.exists()) {
        return imageSnap.data().imageData || null;
      }

      // 回退：舊資料可能還在 games 文件中
      const gameDocRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameDocRef);
      if (!gameSnap.exists()) return null;
      const data = gameSnap.data();
      return data.imageData || data.imageUrl || null;
    } catch (error) {
      console.error('Error getting game image:', error);
      return null;
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

        // 移除 AI 玩家後，若無 winner，重新計算最高分玩家為 winner
        if (needsUpdate && updatedPlayers.length > 0 && !updatedPlayers.some(p => p.isWinner)) {
          const maxScore = Math.max(...updatedPlayers.map(p => p.score));
          const topPlayers = updatedPlayers.filter(p => p.score === maxScore);
          // 分數相同時比較 spice，再比較 coins
          if (topPlayers.length > 1) {
            const maxSpice = Math.max(...topPlayers.map(p => p.spice || 0));
            const spiceTied = topPlayers.filter(p => (p.spice || 0) === maxSpice);
            if (spiceTied.length > 1) {
              const maxCoins = Math.max(...spiceTied.map(p => (p.coins || 0)));
              spiceTied.filter(p => (p.coins || 0) === maxCoins).forEach(winner => {
                winner.isWinner = true;
              });
            } else {
              spiceTied.forEach(winner => { winner.isWinner = true; });
            }
          } else {
            topPlayers.forEach(winner => { winner.isWinner = true; });
          }
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

  /**
   * 遷移舊資料：把 games 中的 imageData 搬到 gameImages 集合
   * Reason: 減少 getGames 列表查詢的傳輸量，自動執行一次
   */
  const migrateImageData = async (): Promise<void> => {
    const db = getDb();
    if (!db) return;

    // 檢查是否已遷移過
    const migrationFlag = doc(db, 'settings', 'migration_done');
    const flagSnap = await getDoc(migrationFlag);
    if (flagSnap.exists() && flagSnap.data().imageDataMigrated) return;

    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    let migrated = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.imageData) {
        const imageDocRef = doc(db, 'gameImages', docSnap.id);
        await setDoc(imageDocRef, { imageData: data.imageData });

        const gameDocRef = doc(db, 'games', docSnap.id);
        await updateDoc(gameDocRef, {
          imageData: deleteField(),
          hasImage: true,
        });

        migrated++;
        console.log(`📦 Migrated image for game ${docSnap.id}`);
      }
    }

    // 標記已完成遷移
    await setDoc(migrationFlag, { imageDataMigrated: true }, { merge: true });
    if (migrated > 0) {
      console.log(`✅ Auto-migration complete: ${migrated} games migrated`);
    }
  };

  return {
    addGame,
    deleteGame,
    updateGame,
    getGames,
    getGameImage,
    getNextGameNumber,
    fixHistoricalData,
    migrateImageData,
  };
}
