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
import ImageModal from '@/components/common/ImageModal';
import { formatTimestamp } from '@/lib/utils';

export default function HistoryPage() {
  const { games, loading, removeGame, refreshGames } = useGames();
  const { updateGame, fixHistoricalData } = useFirebase();
  const { deleteImage } = useStorage();
  const { showToast } = useToast();
  const [editingGame, setEditingGame] = useState<GameRecord | null>(null);
  const [viewingImage, setViewingImage] = useState<{ url: string; gameNumber: number } | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm('確定要刪除這筆記錄嗎？')) return;

    try {
      // Note: Base64 images are stored in Firestore, no need to delete separately
      // Only delete from Storage if it's a legacy imageUrl
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

  /**
   * 修復過往數據：統一玩家名稱 + 移除 AI 玩家
   */
  const handleFixData = async () => {
    if (!confirm('確定要修復過往數據嗎？\n\n這將會：\n1. 統一玩家名稱（如 lukesuhaoo → lukehsuhao）\n2. 移除 AI 玩家（如「未知」、「伊萊莎·伊卡茲」等）')) {
      return;
    }

    setIsFixing(true);
    try {
      const report = await fixHistoricalData();
      await refreshGames();

      let message = `修復完成！\n檢查了 ${report.totalGames} 場遊戲`;
      if (report.fixedGames > 0) {
        message += `\n修正了 ${report.fixedGames} 場遊戲`;
        if (report.renamedPlayers.length > 0) {
          message += `\n重命名了 ${report.renamedPlayers.length} 個玩家`;
        }
        if (report.removedAIPlayers.length > 0) {
          message += `\n移除了 ${report.removedAIPlayers.length} 個 AI 玩家`;
        }
      } else {
        message += '\n無需修正任何資料';
      }

      showToast(message, 'success');
      console.log('📊 完整修復報告:', report);
    } catch (error) {
      showToast('修復失敗，請查看 Console', 'error');
      console.error('修復錯誤:', error);
    } finally {
      setIsFixing(false);
    }
  };

  if (loading) return <Loading message="載入歷史記錄..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-orbitron font-bold text-dune-sand">遊戲歷史</h1>
        <Button
          onClick={handleFixData}
          disabled={isFixing || games.length === 0}
          variant="secondary"
          className="text-sm"
        >
          {isFixing ? '🔄 修復中...' : '🔧 修復玩家名稱'}
        </Button>
      </div>

      {games.length === 0 ? (
        <Card>
          <p className="text-dune-sand/70 text-center">尚無遊戲記錄</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {games.map(game => (
            <Card key={game.id}>
              <div className="flex-1 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-orbitron text-dune-spice">
                    {game.players.find(p => p.isWinner)?.name || '未知玩家'} 用 {game.players.find(p => p.isWinner)?.faction || '未知角色'} 獲勝
                  </h3>
                  <p className="text-sm text-dune-sand/70 font-rajdhani">
                    {formatTimestamp(game.timestamp)} • 遊戲 #{game.gameNumber}
                    {game.recognitionConfidence && (
                      <span className="ml-2">
                        🤖 信心度: {(game.recognitionConfidence * 100).toFixed(0)}%
                      </span>
                    )}
                    {(game.imageUrl || game.imageData) && (
                      <span className="ml-2 text-green-400">
                        📸 有圖片
                      </span>
                    )}
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
                        {(player.spice !== undefined && player.spice > 0) && (
                          <span className="text-dune-sand/60 text-sm">🧂 {player.spice}</span>
                        )}
                        {(player.coins !== undefined && player.coins > 0) && (
                          <span className="text-dune-sand/60 text-sm">🪙 {player.coins}</span>
                        )}
                        {player.isWinner && <span className="text-dune-spice">👑</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 flex-shrink-0">
                  <Button
                    onClick={() => {
                      const imageSource = game.imageData || game.imageUrl;
                      if (imageSource) {
                        setViewingImage({ url: imageSource, gameNumber: game.gameNumber });
                      }
                    }}
                    disabled={!game.imageData && !game.imageUrl}
                    variant="secondary"
                    title={(game.imageData || game.imageUrl) ? '查看 AI 識別圖片' : '無圖片'}
                  >
                    📸 圖片
                  </Button>
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

      <ImageModal
        isOpen={!!viewingImage}
        imageUrl={viewingImage?.url || null}
        gameNumber={viewingImage?.gameNumber || 0}
        onClose={() => setViewingImage(null)}
      />
    </motion.div>
  );
}
