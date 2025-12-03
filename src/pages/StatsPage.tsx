import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGames } from '@/hooks/useGames';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { DUNE_COLORS } from '@/lib/constants';

export default function StatsPage() {
  const { games, loading } = useGames();

  const { playerStats, factionStats } = useMemo(() => {
    const pStats: Record<string, any> = {};
    const fStats: Record<string, any> = {};

    games.forEach(game => {
      game.players.forEach(player => {
        // Player stats
        if (!pStats[player.name]) {
          pStats[player.name] = { name: player.name, totalGames: 0, wins: 0, scores: [], factions: [] };
        }
        pStats[player.name].totalGames++;
        if (player.isWinner) pStats[player.name].wins++;
        pStats[player.name].scores.push(player.score);
        pStats[player.name].factions.push(player.faction);

        // Faction stats
        if (!fStats[player.faction]) {
          fStats[player.faction] = { faction: player.faction, timesPlayed: 0, wins: 0, scores: [], players: {} };
        }
        fStats[player.faction].timesPlayed++;
        if (player.isWinner) fStats[player.faction].wins++;
        fStats[player.faction].scores.push(player.score);

        if (!fStats[player.faction].players[player.name]) {
          fStats[player.faction].players[player.name] = { wins: 0, losses: 0 };
        }
        if (player.isWinner) {
          fStats[player.faction].players[player.name].wins++;
        } else {
          fStats[player.faction].players[player.name].losses++;
        }
      });
    });

    const processedPlayerStats = Object.values(pStats).map((p: any) => ({
      name: p.name,
      totalGames: p.totalGames,
      wins: p.wins,
      winRate: (p.wins / p.totalGames) * 100,
      averageScore: p.scores.reduce((a: number, b: number) => a + b, 0) / p.scores.length,
      favoriteFaction: p.factions.sort((a: string, b: string) =>
        p.factions.filter((v: string) => v === b).length - p.factions.filter((v: string) => v === a).length
      )[0],
    })).sort((a: any, b: any) => b.winRate - a.winRate);

    const processedFactionStats = Object.values(fStats).map((f: any) => ({
      faction: f.faction,
      timesPlayed: f.timesPlayed,
      wins: f.wins,
      winRate: (f.wins / f.timesPlayed) * 100,
      averageScore: f.scores.reduce((a: number, b: number) => a + b, 0) / f.scores.length,
      players: Object.entries(f.players).map(([name, record]: [string, any]) => ({
        name,
        wins: record.wins,
        losses: record.losses,
        totalGames: record.wins + record.losses,
      })).sort((a: any, b: any) => b.wins - a.wins),
    })).sort((a: any, b: any) => b.winRate - a.winRate);

    return { playerStats: processedPlayerStats, factionStats: processedFactionStats };
  }, [games]);

  if (loading) return <Loading message="載入統計資料..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-orbitron font-bold text-dune-sand mb-8">統計數據</h1>

      {/* 玩家統計 */}
      <section className="mb-8">
        <h2 className="text-2xl font-orbitron text-dune-spice mb-4">玩家統計</h2>
        <div className="grid gap-4">
          {playerStats.map((stat: any) => (
            <Card key={stat.name}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-orbitron text-dune-sand">{stat.name}</h3>
                  <div className="mt-2 space-y-1 font-rajdhani text-dune-sand/70">
                    <p>總場次: {stat.totalGames}</p>
                    <p>勝利: {stat.wins} 場</p>
                    <p>勝率: {stat.winRate.toFixed(1)}%</p>
                    <p>平均分數: {stat.averageScore.toFixed(1)} 分</p>
                    <p style={{ color: DUNE_COLORS[stat.favoriteFaction] }}>
                      最常用角色: {stat.favoriteFaction}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-orbitron text-dune-spice">
                    {stat.winRate.toFixed(0)}%
                  </div>
                  <div className="text-sm font-rajdhani text-dune-sand/70">勝率</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 角色統計 */}
      <section>
        <h2 className="text-2xl font-orbitron text-dune-spice mb-4">角色統計</h2>
        <div className="grid gap-4">
          {factionStats.map((stat: any) => (
            <Card key={stat.faction}>
              <h3
                className="text-xl font-orbitron mb-3"
                style={{ color: DUNE_COLORS[stat.faction] }}
              >
                {stat.faction}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 font-rajdhani">
                <div>
                  <p className="text-dune-sand/70">使用次數</p>
                  <p className="text-2xl text-dune-sand">{stat.timesPlayed}</p>
                </div>
                <div>
                  <p className="text-dune-sand/70">勝利次數</p>
                  <p className="text-2xl text-dune-sand">{stat.wins}</p>
                </div>
                <div>
                  <p className="text-dune-sand/70">勝率</p>
                  <p className="text-2xl text-dune-spice">{stat.winRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-dune-sand/70">平均分數</p>
                  <p className="text-2xl text-dune-sand">{stat.averageScore.toFixed(1)}</p>
                </div>
              </div>

              {/* 使用該角色的玩家統計 */}
              <div className="border-t border-dune-sand/20 pt-3">
                <p className="text-dune-sand/70 font-rajdhani mb-2">使用過的玩家：</p>
                <div className="space-y-2">
                  {stat.players.map((player: any) => (
                    <div
                      key={player.name}
                      className="flex justify-between items-center bg-dune-sky/30 rounded px-3 py-2"
                    >
                      <span className="font-rajdhani text-dune-sand">{player.name}</span>
                      <div className="flex gap-4 font-rajdhani text-sm">
                        <span className="text-green-400">{player.wins} 勝</span>
                        <span className="text-red-400">{player.losses} 敗</span>
                        <span className="text-dune-sand/70">
                          ({player.totalGames} 場)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
