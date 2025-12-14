import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecord, DuneFaction } from '@/lib/types';
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

  const handlePlayerChange = (index: number, field: 'name' | 'faction' | 'score' | 'spice' | 'coins', value: string | number) => {
    const newPlayers = [...players];
    const currentPlayer = newPlayers[index];
    if (!currentPlayer) return;

    if (field === 'score' || field === 'spice' || field === 'coins') {
      newPlayers[index] = {
        ...currentPlayer,
        [field]: Number(value) || 0
      };
    } else if (field === 'name') {
      newPlayers[index] = {
        ...currentPlayer,
        name: value as string
      };
    } else if (field === 'faction') {
      newPlayers[index] = {
        ...currentPlayer,
        faction: value as DuneFaction
      };
    }
    setPlayers(newPlayers);
  };

  /**
   * 判定勝利者邏輯：分數 → 香料 → 錢幣
   * Reason: 使用和 ManualInputPage 相同的判定邏輯
   */
  const determineWinners = (playerData: typeof players) => {
    // 1. 找出最高分
    const maxScore = Math.max(...playerData.map(p => p.score));
    let candidates = playerData.filter(p => p.score === maxScore);

    // 如果只有一位最高分，直接返回
    if (candidates.length === 1) {
      return candidates.map(p => p.name);
    }

    // 2. 比較香料
    const maxSpice = Math.max(...candidates.map(p => p.spice ?? 0));
    candidates = candidates.filter(p => (p.spice ?? 0) === maxSpice);

    // 如果香料比較後只有一位，返回
    if (candidates.length === 1) {
      return candidates.map(p => p.name);
    }

    // 3. 比較錢幣
    const maxCoins = Math.max(...candidates.map(p => p.coins ?? 0));
    candidates = candidates.filter(p => (p.coins ?? 0) === maxCoins);

    // 返回所有仍然並列的玩家名稱
    return candidates.map(p => p.name);
  };

  const handleSave = () => {
    // 使用新的判定邏輯計算勝利者
    const winnerNames = determineWinners(players);
    const updatedPlayers = players.map(p => ({
      ...p,
      isWinner: winnerNames.includes(p.name),
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

                    {/* 第一行：名稱和角色 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* 第二行：分數、香料、錢幣 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {/* 分數 */}
                      <div>
                        <label className="block text-dune-sand font-rajdhani mb-2">
                          最終得分 <span className="text-dune-spice">*</span>
                        </label>
                        <input
                          type="number"
                          value={player.score}
                          onChange={e => handlePlayerChange(index, 'score', e.target.value)}
                          min="0"
                          className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice"
                        />
                      </div>

                      {/* 香料 */}
                      <div>
                        <label className="block text-dune-sand font-rajdhani mb-2">
                          香料數量
                        </label>
                        <input
                          type="number"
                          value={player.spice ?? 0}
                          onChange={e => handlePlayerChange(index, 'spice', e.target.value)}
                          min="0"
                          placeholder="0"
                          className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice"
                        />
                      </div>

                      {/* 錢幣 */}
                      <div>
                        <label className="block text-dune-sand font-rajdhani mb-2">
                          錢幣數量
                        </label>
                        <input
                          type="number"
                          value={player.coins ?? 0}
                          onChange={e => handlePlayerChange(index, 'coins', e.target.value)}
                          min="0"
                          placeholder="0"
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
