import { motion } from 'framer-motion';
import { useGames } from '@/hooks/useGames';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { games, loading } = useGames();

  if (loading) return <Loading message="載入遊戲數據..." />;

  const totalGames = games.length;
  const recentGames = games.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-4xl font-orbitron font-bold text-dune-sand mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-rajdhani text-dune-sand/70 mb-2">總遊戲數</h3>
          <p className="text-4xl font-orbitron font-bold text-dune-spice">{totalGames}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-orbitron font-bold text-dune-sand mb-4">最近遊戲</h2>
        {recentGames.length === 0 ? (
          <p className="text-dune-sand/70">尚無遊戲記錄</p>
        ) : (
          <div className="space-y-2">
            {recentGames.map(game => (
              <div key={game.id} className="border-b border-dune-sand/10 py-2">
                <p className="font-rajdhani text-dune-sand">遊戲 #{game.gameNumber}</p>
              </div>
            ))}
          </div>
        )}
        <Link to="/history" className="text-dune-spice hover:underline mt-4 inline-block">
          查看全部 →
        </Link>
      </Card>

      <Link to="/upload">
        <Card className="text-center hover:bg-dune-spice/10">
          <p className="text-2xl font-orbitron text-dune-spice">+ 新增遊戲</p>
        </Card>
      </Link>
    </motion.div>
  );
}
