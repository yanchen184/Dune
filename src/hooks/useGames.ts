import { useState, useEffect } from 'react';
import { useFirebase } from './useFirebase';
import { GameRecord } from '@/lib/types';

export function useGames(autoFetch = true) {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getGames: fetchGames, addGame, deleteGame, migrateImageData } = useFirebase();

  /**
   * Fetch all games from Firestore
   * 首次載入時自動遷移舊圖片資料，遷移後重新讀取
   */
  const refreshGames = async () => {
    setLoading(true);
    setError(null);

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firebase 連線超時，請檢查 Firestore 安全規則是否已過期。')), 60000)
      );

      // 先嘗試自動遷移（有 flag 機制，已遷移過就跳過）
      try {
        await Promise.race([migrateImageData(), timeoutPromise]);
      } catch {
        console.warn('⚠️ Image migration skipped or failed');
      }

      const fetchedGames = await Promise.race([fetchGames(), timeoutPromise]);
      setGames(fetchedGames);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch games';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new game and refresh the list
   */
  const createGame = async (game: Omit<GameRecord, 'id'>): Promise<void> => {
    try {
      await addGame(game);
      await refreshGames();
    } catch (err) {
      throw err;
    }
  };

  /**
   * Delete a game and refresh the list
   */
  const removeGame = async (id: string): Promise<void> => {
    try {
      await deleteGame(id);
      await refreshGames();
    } catch (err) {
      throw err;
    }
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      refreshGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return {
    games,
    loading,
    error,
    refreshGames,
    createGame,
    removeGame,
  };
}
