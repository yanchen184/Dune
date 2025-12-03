import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface Player {
  name: string;
  score: number;
}

interface WinnerSelectionModalProps {
  players: Player[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (winnerIndexes: number[]) => void;
}

export default function WinnerSelectionModal({
  players,
  isOpen,
  onClose,
  onConfirm
}: WinnerSelectionModalProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  // 找出最高分的玩家索引
  const maxScore = Math.max(...players.map(p => p.score));
  const tiedPlayers = players
    .map((p, index) => ({ ...p, index }))
    .filter(p => p.score === maxScore);

  // 初始化選中第一個同分玩家
  useEffect(() => {
    if (isOpen && tiedPlayers.length > 0) {
      setSelectedIndexes([tiedPlayers[0]?.index ?? 0]);
    }
  }, [isOpen, tiedPlayers]);

  const togglePlayer = (index: number) => {
    setSelectedIndexes(prev => {
      if (prev.includes(index)) {
        // 至少要選一個
        if (prev.length === 1) return prev;
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedIndexes.length === 0) {
      return; // 不允許沒有選擇勝利者
    }
    onConfirm(selectedIndexes);
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
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* 模態框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dune-deep border-2 border-dune-spice rounded-lg p-6 max-w-md w-full">
              <h2 className="text-3xl font-orbitron font-bold text-dune-spice mb-4">
                ⚠️ 同分情況
              </h2>

              <p className="text-dune-sand font-rajdhani mb-6">
                有 {tiedPlayers.length} 位玩家同為最高分 ({maxScore} 分)，請選擇實際勝利者：
              </p>

              <div className="space-y-3 mb-6">
                {tiedPlayers.map(player => (
                  <div
                    key={player.index}
                    onClick={() => togglePlayer(player.index)}
                    className={`
                      border-2 rounded-lg p-4 cursor-pointer transition-all
                      ${selectedIndexes.includes(player.index)
                        ? 'border-dune-spice bg-dune-spice/20'
                        : 'border-dune-sand/30 hover:border-dune-sand/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-6 h-6 rounded border-2 flex items-center justify-center
                        ${selectedIndexes.includes(player.index)
                          ? 'border-dune-spice bg-dune-spice'
                          : 'border-dune-sand/50'
                        }
                      `}>
                        {selectedIndexes.includes(player.index) && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-dune-sand font-rajdhani text-lg">
                          {player.name}
                        </span>
                        <span className="text-dune-sand/70 ml-2">
                          {player.score} 分
                        </span>
                      </div>
                      {selectedIndexes.includes(player.index) && (
                        <span className="text-dune-spice text-xl">👑</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-dune-sand/60 font-rajdhani mb-4">
                💡 提示：可以選擇多位勝利者（平手）
              </p>

              <div className="flex gap-4">
                <Button onClick={handleConfirm} disabled={selectedIndexes.length === 0}>
                  確認
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
