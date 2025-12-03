import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGames } from '@/hooks/useGames';
import { useFirebase } from '@/hooks/useFirebase';
import { useStorage } from '@/hooks/useStorage';
import { useToast } from '@/hooks/useToast';
import { GameRecord } from '@/lib/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import EditGameModal from '@/components/common/EditGameModal';
import { formatTimestamp } from '@/lib/utils';

export default function HistoryPage() {
  const { games, loading, removeGame, refreshGames } = useGames();
  const { updateGame } = useFirebase();
  const { deleteImage } = useStorage();
  const { showToast } = useToast();
  const [editingGame, setEditingGame] = useState<GameRecord | null>(null);

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm('確定要刪除這筆記錄嗎？')) return;

    try {
      if (imageUrl) {
        await deleteImage(imageUrl);
      }
      await removeGame(id);
      showToast('記錄已刪除', 'success');
    } catch (error) {
      showToast('刪除失敗', 'error');
    }
  };

  const handleEdit = async (updatedGame: GameRecord) => {
    try {
      await updateGame(updatedGame.id, {
        players: updatedGame.players,
      });
      await refreshGames();
      setEditingGame(null);
      showToast('更新成功', 'success');
    } catch (error) {
      showToast('更新失敗', 'error');
    }
  };

  if (loading) return <Loading message="載入歷史記錄..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-orbitron font-bold text-dune-sand mb-8">遊戲歷史</h1>

      {games.length === 0 ? (
        <Card>
          <p className="text-dune-sand/70 text-center">尚無遊戲記錄</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {games.map(game => (
            <Card key={game.id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-orbitron text-dune-spice">遊戲 #{game.gameNumber}</h3>
                  <p className="text-sm text-dune-sand/70 font-rajdhani">
                    {formatTimestamp(game.timestamp)}
                  </p>
                  <div className="mt-4 space-y-2">
                    {game.players.map((player, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <span className={`font-rajdhani ${ player.isWinner ? 'text-dune-spice font-bold' : 'text-dune-sand'
                        }`}>
                          {player.name}
                        </span>
                        <span className="text-dune-sand/70">{player.faction}</span>
                        <span className="text-dune-sand">{player.score} 分</span>
                        {player.isWinner && <span className="text-dune-spice">👑</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setEditingGame(game)}>
                    編輯
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(game.id, game.imageUrl)}>
                    刪除
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <EditGameModal
        game={editingGame}
        isOpen={!!editingGame}
        onClose={() => setEditingGame(null)}
        onSave={handleEdit}
      />
    </motion.div>
  );
}
