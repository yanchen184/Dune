import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGames } from '@/hooks/useGames';
import { isAIPlayer } from '@/lib/aiPlayers';
import { DUNE_COLORS } from '@/lib/constants';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { Link } from 'react-router-dom';
import { formatTimestamp } from '@/lib/utils';

export default function HomePage() {
  const { games, loading, error } = useGames();

  // 計算統計數據
  const stats = useMemo(() => {
    const totalGames = games.length;
    const playerStats: Record<string, { wins: number; totalGames: number }> = {};

    games.forEach(game => {
      game.players.forEach(player => {
        // 過濾掉 AI 玩家
        if (isAIPlayer(player.name)) return;

        if (!playerStats[player.name]) {
          playerStats[player.name] = { wins: 0, totalGames: 0 };
        }
        playerStats[player.name]!.totalGames++;
        if (player.isWinner) {
          playerStats[player.name]!.wins++;
        }
      });
    });

    // 找出勝率最高的玩家
    let topPlayer = { name: '無', winRate: 0, wins: 0, totalGames: 0 };
    Object.entries(playerStats).forEach(([name, stat]) => {
      const winRate = (stat.wins / stat.totalGames) * 100;
      if (winRate > topPlayer.winRate || (winRate === topPlayer.winRate && stat.wins > topPlayer.wins)) {
        topPlayer = { name, winRate, wins: stat.wins, totalGames: stat.totalGames };
      }
    });

    return { totalGames, totalPlayers: Object.keys(playerStats).length, topPlayer };
  }, [games]);

  if (loading) return <Loading message="載入遊戲數據..." />;

  if (error) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-4xl font-orbitron font-bold text-dune-sand mb-8">Dashboard</h1>
      <Card>
        <div className="text-center py-8">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-orbitron text-red-400 mb-2">連線失敗</h2>
          <p className="text-dune-sand/70 font-rajdhani mb-4">{error}</p>
          <p className="text-dune-sand/50 font-rajdhani text-sm mb-6">
            請檢查 Firebase Console 的 Firestore 安全規則是否已過期
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/upload" className="text-dune-spice hover:underline font-rajdhani">上傳遊戲</Link>
            <Link to="/manual" className="text-dune-spice hover:underline font-rajdhani">手動輸入</Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const recentGames = games.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-4xl font-orbitron font-bold text-dune-sand mb-8">Dashboard</h1>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-rajdhani text-dune-sand/70 mb-2">總遊戲數</h3>
          <p className="text-4xl font-orbitron font-bold text-dune-spice">{stats.totalGames}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-rajdhani text-dune-sand/70 mb-2">玩家人數</h3>
          <p className="text-4xl font-orbitron font-bold text-dune-spice">{stats.totalPlayers}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-rajdhani text-dune-sand/70 mb-2">勝率之王</h3>
          <p className="text-2xl font-orbitron font-bold text-dune-spice">{stats.topPlayer.name}</p>
          <p className="text-sm font-rajdhani text-dune-sand/70 mt-1">
            {stats.topPlayer.winRate > 0 ? `${stats.topPlayer.winRate.toFixed(1)}% (${stats.topPlayer.wins}/${stats.topPlayer.totalGames})` : '無數據'}
          </p>
        </Card>
      </div>

      {/* 最近遊戲 */}
      <Card>
        <h2 className="text-2xl font-orbitron font-bold text-dune-sand mb-4">最近遊戲</h2>
        {recentGames.length === 0 ? (
          <p className="text-dune-sand/70">尚無遊戲記錄</p>
        ) : (
          <div className="space-y-3">
            {recentGames.map(game => {
              const winner = game.players.find(p => p.isWinner);
              return (
                <Link
                  key={game.id}
                  to="/history"
                  className="block border-l-4 border-dune-spice/50 bg-dune-sky/20 hover:bg-dune-sky/40 rounded-r-lg p-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-orbitron text-dune-sand">
                        {winner?.name || '未知玩家'} 用{' '}
                        <span style={{ color: DUNE_COLORS[winner?.faction || 'Unknown'] }}>
                          {winner?.faction || '未知角色'}
                        </span>{' '}
                        獲勝
                      </h3>
                      <p className="text-sm text-dune-sand/70 font-rajdhani mt-1">
                        {formatTimestamp(game.timestamp)} • 遊戲 #{game.gameNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-orbitron text-dune-spice">{winner?.score || 0}</div>
                      <div className="text-xs text-dune-sand/70 font-rajdhani">分數</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        <Link to="/history" className="text-dune-spice hover:underline mt-4 inline-block font-rajdhani">
          查看全部 →
        </Link>
      </Card>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/upload">
          <Card className="text-center hover:bg-dune-spice/10 transition-all">
            <div className="py-8">
              <p className="text-5xl mb-4">📸</p>
              <p className="text-2xl font-orbitron text-dune-spice">AI 圖片識別</p>
              <p className="text-sm font-rajdhani text-dune-sand/70 mt-2">上傳遊戲截圖自動識別</p>
            </div>
          </Card>
        </Link>
        <Link to="/manual">
          <Card className="text-center hover:bg-dune-spice/10 transition-all">
            <div className="py-8">
              <p className="text-5xl mb-4">✍️</p>
              <p className="text-2xl font-orbitron text-dune-spice">手動輸入</p>
              <p className="text-sm font-rajdhani text-dune-sand/70 mt-2">手動填寫遊戲記錄</p>
            </div>
          </Card>
        </Link>
      </div>
    </motion.div>
  );
}
