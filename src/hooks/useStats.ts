import { useMemo } from 'react';
import { GameRecord, PlayerStats, FactionStats, DuneFaction } from '@/lib/types';

export function useStats(games: GameRecord[]) {
  /**
   * Calculate player statistics
   */
  const playerStats = useMemo((): PlayerStats[] => {
    const playerMap = new Map<string, PlayerStats>();

    games.forEach(game => {
      game.players.forEach(player => {
        const existing = playerMap.get(player.name);

        if (existing) {
          existing.totalGames++;
          if (player.isWinner) existing.wins++;
          existing.averageScore =
            (existing.averageScore * (existing.totalGames - 1) + player.score) /
            existing.totalGames;
        } else {
          playerMap.set(player.name, {
            name: player.name,
            totalGames: 1,
            wins: player.isWinner ? 1 : 0,
            winRate: 0,
            averageScore: player.score,
            favoriteFaction: player.faction,
          });
        }
      });
    });

    // Calculate win rates and find favorite faction
    const stats = Array.from(playerMap.values()).map(stat => {
      const factionCounts = new Map<DuneFaction, number>();

      games.forEach(game => {
        const playerInGame = game.players.find(p => p.name === stat.name);
        if (playerInGame) {
          factionCounts.set(
            playerInGame.faction,
            (factionCounts.get(playerInGame.faction) || 0) + 1
          );
        }
      });

      let favoriteFaction: DuneFaction = 'Unknown';
      let maxCount = 0;

      factionCounts.forEach((count, faction) => {
        if (count > maxCount) {
          maxCount = count;
          favoriteFaction = faction;
        }
      });

      return {
        ...stat,
        winRate: (stat.wins / stat.totalGames) * 100,
        favoriteFaction,
      };
    });

    // Sort by win rate
    return stats.sort((a, b) => b.winRate - a.winRate);
  }, [games]);

  /**
   * Calculate faction statistics
   */
  const factionStats = useMemo((): FactionStats[] => {
    const factionMap = new Map<DuneFaction, FactionStats>();

    games.forEach(game => {
      game.players.forEach(player => {
        const existing = factionMap.get(player.faction);

        if (existing) {
          existing.timesPlayed++;
          if (player.isWinner) existing.wins++;
          existing.averageScore =
            (existing.averageScore * (existing.timesPlayed - 1) + player.score) /
            existing.timesPlayed;
        } else {
          factionMap.set(player.faction, {
            faction: player.faction,
            timesPlayed: 1,
            wins: player.isWinner ? 1 : 0,
            winRate: 0,
            averageScore: player.score,
          });
        }
      });
    });

    // Calculate win rates
    const stats = Array.from(factionMap.values()).map(stat => ({
      ...stat,
      winRate: (stat.wins / stat.timesPlayed) * 100,
    }));

    // Sort by times played
    return stats.sort((a, b) => b.timesPlayed - a.timesPlayed);
  }, [games]);

  /**
   * Calculate score trend over time
   */
  const scoreTrend = useMemo(() => {
    return games
      .map(game => ({
        date: game.timestamp instanceof Date
          ? game.timestamp
          : (game.timestamp as any).toDate(),
        averageScore:
          game.players.reduce((sum, p) => sum + p.score, 0) / game.players.length,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [games]);

  return {
    playerStats,
    factionStats,
    scoreTrend,
  };
}
