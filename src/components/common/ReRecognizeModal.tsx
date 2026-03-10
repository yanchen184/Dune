import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRecord, PlayerRecord, RecognitionRecord } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import Button from './Button';

interface ReRecognizeModalProps {
  game: GameRecord | null;
  isOpen: boolean;
  isAnalyzing: boolean;
  onClose: () => void;
  onReAnalyze: () => void;
  onApply: (record: RecognitionRecord) => void;
}

export default function ReRecognizeModal({
  game,
  isOpen,
  isAnalyzing,
  onClose,
  onReAnalyze,
  onApply,
}: ReRecognizeModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!game) return null;

  const history = game.recognitionHistory || [];
  const currentPlayers = game.players;

  const handleApply = () => {
    const record = history.find(r => r.id === selectedId);
    if (record) onApply(record);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dune-deep border-2 border-dune-spice rounded-lg p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-orbitron font-bold text-dune-spice mb-2">
                AI 識別紀錄
              </h2>
              <p className="text-dune-sand/70 font-rajdhani mb-6">
                遊戲 #{game.gameNumber} - 可重新分析圖片或選擇歷史識別結果套用
              </p>

              {/* 重新識別按鈕 */}
              <div className="mb-6">
                <Button
                  onClick={onReAnalyze}
                  disabled={isAnalyzing || !game.hasImage}
                >
                  {isAnalyzing ? '🔄 AI 分析中...' : '🤖 重新分析圖片'}
                </Button>
                {!game.hasImage && (
                  <p className="text-red-400 text-sm mt-2 font-rajdhani">此遊戲無圖片，無法重新識別</p>
                )}
              </div>

              {/* 目前套用的版本 */}
              <div className="mb-6">
                <h3 className="text-lg font-orbitron text-dune-sand mb-3">目前使用的資料</h3>
                <PlayerList players={currentPlayers} isActive />
              </div>

              {/* 歷史識別結果 */}
              {history.length > 0 ? (
                <div>
                  <h3 className="text-lg font-orbitron text-dune-sand mb-3">
                    歷史識別結果 ({history.length} 筆)
                  </h3>
                  <div className="space-y-4">
                    {history.map(record => (
                      <div
                        key={record.id}
                        onClick={() => setSelectedId(record.id === selectedId ? null : record.id)}
                        className={`
                          border-2 rounded-lg p-4 cursor-pointer transition-all
                          ${record.isApplied
                            ? 'border-green-500/50 bg-green-500/10'
                            : selectedId === record.id
                              ? 'border-dune-spice bg-dune-spice/10'
                              : 'border-dune-sand/20 hover:border-dune-sand/40'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-dune-sand/70 font-rajdhani text-sm">
                              {formatTimestamp(record.timestamp)}
                            </span>
                            <span className="text-dune-sand/60 text-sm">
                              🤖 {(record.confidence * 100).toFixed(0)}%
                            </span>
                            {record.isApplied && (
                              <span className="text-green-400 text-xs bg-green-400/20 px-2 py-0.5 rounded">
                                目前使用中
                              </span>
                            )}
                          </div>
                          {selectedId === record.id && !record.isApplied && (
                            <span className="text-dune-spice text-sm">已選擇</span>
                          )}
                        </div>
                        <PlayerList players={record.players} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-dune-sand/50 font-rajdhani text-center py-4">
                  尚無歷史識別紀錄，點擊上方按鈕開始分析
                </p>
              )}

              {/* 底部操作 */}
              <div className="flex gap-4 mt-6 pt-4 border-t border-dune-sand/20">
                <Button
                  onClick={handleApply}
                  disabled={!selectedId || history.find(r => r.id === selectedId)?.isApplied}
                >
                  套用選擇的結果
                </Button>
                <Button variant="secondary" onClick={onClose}>
                  關閉
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** 玩家列表子組件 */
function PlayerList({ players, isActive }: { players: PlayerRecord[]; isActive?: boolean }) {
  return (
    <div className={`space-y-1 ${isActive ? 'bg-dune-sky/30 rounded-lg p-3' : ''}`}>
      {players.map((player, idx) => (
        <div key={idx} className="flex gap-3 items-center text-sm font-rajdhani">
          <span className={player.isWinner ? 'text-dune-spice font-bold' : 'text-dune-sand'}>
            {player.name}
          </span>
          <span className="text-dune-sand/60">{player.faction}</span>
          <span className="text-dune-sand">{player.score} 分</span>
          {(player.spice !== undefined && player.spice > 0) && (
            <span className="text-dune-sand/50">🧂 {player.spice}</span>
          )}
          {(player.coins !== undefined && player.coins > 0) && (
            <span className="text-dune-sand/50">🪙 {player.coins}</span>
          )}
          {player.isWinner && <span>👑</span>}
        </div>
      ))}
    </div>
  );
}
