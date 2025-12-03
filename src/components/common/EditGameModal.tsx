import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecord } from '@/lib/types';
import Button from './Button';
import FactionCombobox from './FactionCombobox';

interface EditGameModalProps {
  game: GameRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedGame: GameRecord) => void;
}

export default function EditGameModal({ game, isOpen, onClose, onSave }: EditGameModalProps) {
  const [players, setPlayers] = useState(game?.players || []);

  useEffect(() => {
    if (game) {
      setPlayers(game.players);
    }
  }, [game]);

  if (!game) return null;

  const handlePlayerChange = (index: number, field: 'name' | 'faction' | 'score', value: string | number) => {
    const newPlayers = [...players];
    if (field === 'score') {
      newPlayers[index] = { ...newPlayers[index], score: Number(value) };
    } else {
      newPlayers[index] = { ...newPlayers[index], [field]: value };
    }
    setPlayers(newPlayers);
  };

  const handleSave = () => {
    // 重新計算勝利者
    const maxScore = Math.max(...players.map(p => p.score));
    const updatedPlayers = players.map(p => ({
      ...p,
      isWinner: p.score === maxScore,
    }));

    onSave({
      ...game,
      players: updatedPlayers,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* 模態框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dune-deep border-2 border-dune-sand/30 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-orbitron font-bold text-dune-spice mb-6">
                編輯遊戲 #{game.gameNumber}
              </h2>

              <div className="space-y-4 mb-6">
                {players.map((player, index) => (
                  <div key={index} className="border border-dune-sand/20 rounded-lg p-4">
                    <h3 className="text-lg font-orbitron text-dune-sand mb-3">
                      玩家 {index + 1}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 玩家名稱 */}
                      <div>
                        <label className="block text-dune-sand font-rajdhani mb-2">
                          玩家名稱
                        </label>
                        <input
                          type="text"
                          value={player.name}
                          onChange={e => handlePlayerChange(index, 'name', e.target.value)}
                          className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice"
                        />
                      </div>

                      {/* 角色 */}
                      <div>
                        <label className="block text-dune-sand font-rajdhani mb-2">
                          角色
                        </label>
                        <FactionCombobox
                          value={player.faction}
                          onChange={value => handlePlayerChange(index, 'faction', value)}
                        />
                      </div>

                      {/* 分數 */}
                      <div>
                        <label className="block text-dune-sand font-rajdhani mb-2">
                          最終得分
                        </label>
                        <input
                          type="number"
                          value={player.score}
                          onChange={e => handlePlayerChange(index, 'score', e.target.value)}
                          className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSave}>
                  儲存變更
                </Button>
                <Button variant="secondary" onClick={onClose}>
                  取消
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
