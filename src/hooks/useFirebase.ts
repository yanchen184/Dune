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
import { GameRecord } from '@/lib/types';

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
        games.push({
          id: doc.id,
          ...doc.data(),
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

  return {
    addGame,
    deleteGame,
    updateGame,
    getGames,
    getNextGameNumber,
  };
}
