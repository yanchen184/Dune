import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Timestamp } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGames } from '@/hooks/useGames';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { DUNE_COLORS } from '@/lib/constants';

export default function StatsPage() {
  const { games, loading } = useGames();

  const { playerStats, factionStats, records, streaks, achievements, trendData } = useMemo(() => {
    const pStats: Record<string, any> = {};
    const fStats: Record<string, any> = {};

    // 按時間排序遊戲（用於計算連勝連敗）
    const sortedGames = [...games].sort((a, b) => {
      const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp as any).getTime();
      const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp as any).getTime();
      return timeA - timeB;
    });

    // 追蹤每個玩家的記錄
    const playerRecords: Record<string, any[]> = {};
    let highestScore = { score: 0, playerName: '', faction: '', timestamp: new Date() as Date | Timestamp };
    let lowestScore = { score: Infinity, playerName: '', faction: '', timestamp: new Date() as Date | Timestamp };

    sortedGames.forEach(game => {
      game.players.forEach(player => {
        // Player stats
        if (!pStats[player.name]) {
          pStats[player.name] = {
            name: player.name,
            totalGames: 0,
            wins: 0,
            scores: [],
            factions: [],
            gameHistory: [] // 用於趨勢圖
          };
        }
        pStats[player.name].totalGames++;
        if (player.isWinner) pStats[player.name].wins++;
        pStats[player.name].scores.push(player.score);
        pStats[player.name].factions.push(player.faction);
        pStats[player.name].gameHistory.push({
          timestamp: game.timestamp,
          score: player.score,
          isWinner: player.isWinner
        });

        // 追蹤連勝連敗
        if (!playerRecords[player.name]) {
          playerRecords[player.name] = [];
        }
        playerRecords[player.name]!.push({
          isWinner: player.isWinner,
          timestamp: game.timestamp,
          score: player.score,
          faction: player.faction
        });

        // 最高分/最低分記錄
        if (player.score > highestScore.score) {
          highestScore = {
            score: player.score,
            playerName: player.name,
            faction: player.faction,
            timestamp: game.timestamp
          };
        }
        if (player.score < lowestScore.score) {
          lowestScore = {
            score: player.score,
            playerName: player.name,
            faction: player.faction,
            timestamp: game.timestamp
          };
        }

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

    // 計算連勝連敗記錄
    const calculateStreaks = () => {
      let longestWinStreak = { player: '', count: 0, startDate: '', endDate: '' };
      let longestLoseStreak = { player: '', count: 0, startDate: '', endDate: '' };
      const currentStreaks: Record<string, { count: number, isWin: boolean }> = {};

      Object.entries(playerRecords).forEach(([playerName, records]) => {
        let currentWinStreak = 0;
        let currentLoseStreak = 0;
        let maxWinStreak = 0;
        let maxLoseStreak = 0;
        let winStreakStart = '';
        let winStreakEnd = '';
        let loseStreakStart = '';
        let loseStreakEnd = '';
        let tempWinStart = '';
        let tempLoseStart = '';

        records.forEach((record: any) => {
          if (record.isWinner) {
            currentWinStreak++;
            currentLoseStreak = 0;
            if (currentWinStreak === 1) tempWinStart = record.timestamp;
            if (currentWinStreak > maxWinStreak) {
              maxWinStreak = currentWinStreak;
              winStreakStart = tempWinStart;
              winStreakEnd = record.timestamp;
            }
          } else {
            currentLoseStreak++;
            currentWinStreak = 0;
            if (currentLoseStreak === 1) tempLoseStart = record.timestamp;
            if (currentLoseStreak > maxLoseStreak) {
              maxLoseStreak = currentLoseStreak;
              loseStreakStart = tempLoseStart;
              loseStreakEnd = record.timestamp;
            }
          }
        });

        // 最長連勝
        if (maxWinStreak > longestWinStreak.count) {
          longestWinStreak = {
            player: playerName,
            count: maxWinStreak,
            startDate: winStreakStart,
            endDate: winStreakEnd
          };
        }

        // 最長連敗
        if (maxLoseStreak > longestLoseStreak.count) {
          longestLoseStreak = {
            player: playerName,
            count: maxLoseStreak,
            startDate: loseStreakStart,
            endDate: loseStreakEnd
          };
        }

        // 目前連勝/連敗
        const lastRecord = records[records.length - 1];
        if (lastRecord) {
          currentStreaks[playerName] = {
            count: lastRecord.isWinner ? currentWinStreak : -currentLoseStreak,
            isWin: lastRecord.isWinner
          };
        }
      });

      return { longestWinStreak, longestLoseStreak, currentStreaks };
    };

    // 計算成就
    const calculateAchievements = () => {
      const playerAchievements: Record<string, any[]> = {};

      Object.entries(pStats).forEach(([playerName, stats]) => {
        const achievements = [];
        const winRate = (stats.wins / stats.totalGames) * 100;
        const maxScore = Math.max(...stats.scores);
        const uniqueFactions = new Set(stats.factions).size;

        // 基礎成就
        if (stats.totalGames >= 1) achievements.push({ icon: '🎮', name: '初心者', desc: '完成第一場遊戲' });
        if (stats.wins >= 1) achievements.push({ icon: '🏆', name: '首勝達成', desc: '獲得第一次勝利' });
        if (stats.totalGames >= 10) achievements.push({ icon: '💯', name: '十戰勇士', desc: '總場次達 10 場' });
        if (stats.totalGames >= 50) achievements.push({ icon: '⚔️', name: '百戰老兵', desc: '總場次達 50 場' });

        // 分數成就
        if (maxScore >= 13) achievements.push({ icon: '🎯', name: '分數突破', desc: `單場分數達 ${maxScore} 分` });
        if (maxScore >= 15) achievements.push({ icon: '⭐', name: '高分挑戰', desc: `單場分數達 ${maxScore} 分` });
        if (maxScore >= 20) achievements.push({ icon: '💎', name: '完美表現', desc: `單場分數達 ${maxScore} 分` });

        // 勝率成就
        if (winRate >= 50) achievements.push({ icon: '📈', name: '勝者姿態', desc: `總勝率 ${winRate.toFixed(1)}%` });
        if (winRate >= 60) achievements.push({ icon: '🥇', name: '勝率之王', desc: `總勝率 ${winRate.toFixed(1)}%` });
        if (winRate >= 80) achievements.push({ icon: '👑', name: '不敗神話', desc: `總勝率 ${winRate.toFixed(1)}%` });

        // 角色成就
        if (uniqueFactions >= 3) achievements.push({ icon: '🎨', name: '角色探索', desc: `使用 ${uniqueFactions} 個不同角色` });
        if (uniqueFactions >= 5) achievements.push({ icon: '🌟', name: '多才多藝', desc: `使用 ${uniqueFactions} 個不同角色` });
        if (uniqueFactions >= 9) achievements.push({ icon: '🔮', name: '全能玩家', desc: '使用所有 9 個角色' });

        playerAchievements[playerName] = achievements;
      });

      // 連勝成就
      Object.entries(playerRecords).forEach(([playerName, records]) => {
        let maxWinStreak = 0;
        let currentStreak = 0;

        records.forEach((record: any) => {
          if (record.isWinner) {
            currentStreak++;
            maxWinStreak = Math.max(maxWinStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });

        if (!playerAchievements[playerName]) playerAchievements[playerName] = [];
        if (maxWinStreak >= 3) playerAchievements[playerName].push({ icon: '🔥', name: '連勝戰士', desc: `最高連勝 ${maxWinStreak} 場` });
        if (maxWinStreak >= 5) playerAchievements[playerName].push({ icon: '💪', name: '連勝霸主', desc: `最高連勝 ${maxWinStreak} 場` });
        if (maxWinStreak >= 10) playerAchievements[playerName].push({ icon: '👑', name: '連勝傳說', desc: `最高連勝 ${maxWinStreak} 場` });
      });

      return playerAchievements;
    };

    // 準備趨勢圖表數據
    const prepareTrendData = () => {
      const allPlayers = Object.keys(pStats);
      const trendByPlayer: Record<string, any[]> = {};

      allPlayers.forEach(playerName => {
        const history = pStats[playerName].gameHistory;
        trendByPlayer[playerName] = history.map((game: any, index: number) => ({
          gameNumber: index + 1,
          score: game.score,
          timestamp: new Date(game.timestamp).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
        }));
      });

      return trendByPlayer;
    };

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

    return {
      playerStats: processedPlayerStats,
      factionStats: processedFactionStats,
      records: {
        highest: lowestScore.score === Infinity ? null : highestScore,
        lowest: lowestScore.score === Infinity ? null : lowestScore
      },
      streaks: calculateStreaks(),
      achievements: calculateAchievements(),
      trendData: prepareTrendData()
    };
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

      {/* 分數記錄 */}
      <section className="mb-8">
        <h2 className="text-2xl font-orbitron text-dune-spice mb-4">分數記錄</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {records.highest && (
            <Card>
              <div className="flex items-center gap-4">
                <div className="text-5xl">🏆</div>
                <div className="flex-1">
                  <h3 className="text-xl font-orbitron text-dune-spice mb-2">最高分記錄</h3>
                  <p className="text-3xl font-bold text-dune-sand">{records.highest.score} 分</p>
                  <div className="mt-2 font-rajdhani text-dune-sand/70">
                    <p>玩家：{records.highest.playerName}</p>
                    <p style={{ color: DUNE_COLORS[records.highest.faction] }}>
                      角色：{records.highest.faction}
                    </p>
                    <p className="text-sm">
                      {(records.highest.timestamp instanceof Date
                        ? records.highest.timestamp
                        : records.highest.timestamp.toDate()).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
          {records.lowest && (
            <Card>
              <div className="flex items-center gap-4">
                <div className="text-5xl">📉</div>
                <div className="flex-1">
                  <h3 className="text-xl font-orbitron text-dune-sand/70 mb-2">最低分記錄</h3>
                  <p className="text-3xl font-bold text-dune-sand">{records.lowest.score} 分</p>
                  <div className="mt-2 font-rajdhani text-dune-sand/70">
                    <p>玩家：{records.lowest.playerName}</p>
                    <p style={{ color: DUNE_COLORS[records.lowest.faction] }}>
                      角色：{records.lowest.faction}
                    </p>
                    <p className="text-sm">
                      {(records.lowest.timestamp instanceof Date
                        ? records.lowest.timestamp
                        : records.lowest.timestamp.toDate()).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* 連勝連敗記錄 */}
      <section className="mb-8">
        <h2 className="text-2xl font-orbitron text-dune-spice mb-4">連勝連敗記錄</h2>
        <div className="grid gap-4">
          {streaks.longestWinStreak.count > 0 && (
            <Card>
              <div className="flex items-center gap-4">
                <div className="text-5xl">🔥</div>
                <div className="flex-1">
                  <h3 className="text-xl font-orbitron text-dune-spice mb-2">最長連勝記錄</h3>
                  <p className="text-3xl font-bold text-dune-sand mb-2">
                    {streaks.longestWinStreak.count} 場
                  </p>
                  <div className="font-rajdhani text-dune-sand/70">
                    <p>玩家：{streaks.longestWinStreak.player}</p>
                    {streaks.longestWinStreak.startDate && streaks.longestWinStreak.endDate && (
                      <p className="text-sm">
                        {new Date(streaks.longestWinStreak.startDate).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} ~{' '}
                        {new Date(streaks.longestWinStreak.endDate).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
          {streaks.longestLoseStreak.count > 0 && (
            <Card>
              <div className="flex items-center gap-4">
                <div className="text-5xl">❄️</div>
                <div className="flex-1">
                  <h3 className="text-xl font-orbitron text-dune-sand/70 mb-2">最長連敗記錄</h3>
                  <p className="text-3xl font-bold text-dune-sand mb-2">
                    {streaks.longestLoseStreak.count} 場
                  </p>
                  <div className="font-rajdhani text-dune-sand/70">
                    <p>玩家：{streaks.longestLoseStreak.player}</p>
                    {streaks.longestLoseStreak.startDate && streaks.longestLoseStreak.endDate && (
                      <p className="text-sm">
                        {new Date(streaks.longestLoseStreak.startDate).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} ~{' '}
                        {new Date(streaks.longestLoseStreak.endDate).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
          {Object.keys(streaks.currentStreaks).length > 0 && (
            <Card>
              <h3 className="text-xl font-orbitron text-dune-spice mb-4">目前連勝/連敗</h3>
              <div className="space-y-3">
                {Object.entries(streaks.currentStreaks).map(([playerName, streak]: [string, any]) => (
                  <div
                    key={playerName}
                    className="flex justify-between items-center bg-dune-sky/30 rounded px-4 py-3"
                  >
                    <span className="font-rajdhani text-dune-sand">{playerName}</span>
                    {streak.isWin ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔥</span>
                        <span className="text-xl font-bold text-green-400">
                          連勝 {streak.count} 場
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">❄️</span>
                        <span className="text-xl font-bold text-red-400">
                          連敗 {Math.abs(streak.count)} 場
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* 個人成就 */}
      <section className="mb-8">
        <h2 className="text-2xl font-orbitron text-dune-spice mb-4">個人成就</h2>
        <div className="grid gap-4">
          {Object.entries(achievements).map(([playerName, playerAchievements]: [string, any]) => (
            <Card key={playerName}>
              <h3 className="text-xl font-orbitron text-dune-sand mb-4">
                {playerName} 的成就
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {playerAchievements.map((achievement: any, index: number) => (
                  <div
                    key={index}
                    className="bg-dune-sky/30 rounded-lg p-3 flex items-center gap-3 border-2 border-dune-spice/30 hover:border-dune-spice/60 transition-all"
                  >
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-orbitron text-dune-spice text-sm">{achievement.name}</p>
                      <p className="font-rajdhani text-dune-sand/70 text-xs">{achievement.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 分數趨勢圖表 */}
      <section className="mb-8">
        <h2 className="text-2xl font-orbitron text-dune-spice mb-4">分數趨勢</h2>
        <Card>
          <div className="space-y-8">
            {Object.entries(trendData).map(([playerName, data]: [string, any]) => (
              <div key={playerName}>
                <h3 className="text-lg font-orbitron text-dune-sand mb-4">{playerName}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4A574" opacity={0.1} />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#D4A574"
                      style={{ fontSize: '12px', fontFamily: 'Rajdhani' }}
                    />
                    <YAxis
                      stroke="#D4A574"
                      style={{ fontSize: '12px', fontFamily: 'Rajdhani' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A2E',
                        border: '2px solid #FF6B35',
                        borderRadius: '8px',
                        fontFamily: 'Rajdhani'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontFamily: 'Rajdhani' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#FF6B35"
                      strokeWidth={3}
                      dot={{ fill: '#FF6B35', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="分數"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 角色統計 */}
      <section className="mb-8">
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
