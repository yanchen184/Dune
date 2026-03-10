import { useState, useEffect } from 'react';
import { useFirebase } from './useFirebase';
import { GameRecord } from '@/lib/types';

export function useGames(autoFetch = true) {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getGames: fetchGames, addGame, deleteGame } = useFirebase();

  /**
   * Fetch all games from Firestore (60 秒超時)
   */
  const refreshGames = async () => {
    setLoading(true);
    setError(null);

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firebase 連線超時，請檢查 Firestore 安全規則是否已過期。')), 60000)
      );
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
