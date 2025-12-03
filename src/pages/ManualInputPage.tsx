import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/hooks/useFirebase';
import { useGames } from '@/hooks/useGames';
import { useToast } from '@/hooks/useToast';
import { Timestamp } from 'firebase/firestore';
import { PlayerRecord, DuneFaction } from '@/lib/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import FactionCombobox from '@/components/common/FactionCombobox';
import PlayerNameCombobox from '@/components/common/PlayerNameCombobox';
import WinnerSelectionModal from '@/components/common/WinnerSelectionModal';

interface PlayerInput {
  id: string;
  name: string;
  faction: string;
  score: string;
}

export default function ManualInputPage() {
  const navigate = useNavigate();
  const { addGame, getNextGameNumber } = useFirebase();
  const { games } = useGames();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWinnerSelection, setShowWinnerSelection] = useState(false);
  const [pendingGameData, setPendingGameData] = useState<any>(null);

  const [players, setPlayers] = useState<PlayerInput[]>([
    { id: '1', name: '', faction: '', score: '' },
    { id: '2', name: '', faction: '', score: '' },
    { id: '3', name: '', faction: '', score: '' },
  ]);

  // 從歷史記錄中提取所有玩家名稱
  const playerNameSuggestions = useMemo(() => {
    const names = games.flatMap(game => game.players.map(p => p.name));
    return names;
  }, [games]);

  const handleAddPlayer = () => {
    if (players.length >= 6) {
      showToast('最多只能新增 6 位玩家', 'error');
      return;
    }
    setPlayers([
      ...players,
      { id: Date.now().toString(), name: '', faction: '', score: '' },
    ]);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 3) {
      showToast('至少需要 3 位玩家', 'error');
      return;
    }
    setPlayers(players.filter(p => p.id !== id));
  };

  const handlePlayerChange = (id: string, field: keyof PlayerInput, value: string) => {
    setPlayers(
      players.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const validateForm = (): boolean => {
    // 檢查是否所有欄位都已填寫
    for (const player of players) {
      if (!player.name.trim()) {
        showToast('請填寫所有玩家名稱', 'error');
        return false;
      }
      if (!player.faction) {
        showToast('請選擇所有玩家的角色', 'error');
        return false;
      }
      if (!player.score || isNaN(Number(player.score))) {
        showToast('請填寫有效的分數', 'error');
        return false;
      }
    }

    // 檢查是否有重複的玩家名稱
    const names = players.map(p => p.name.trim().toLowerCase());
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      showToast('玩家名稱不能重複', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const gameNumber = await getNextGameNumber();

      // 將分數轉換為數字
      const playerScores = players.map(p => ({
        name: p.name.trim(),
        faction: p.faction,
        score: Number(p.score),
      }));

      // 找出最高分
      const maxScore = Math.max(...playerScores.map(p => p.score));

      // 檢查是否有多位同分最高分玩家
      const topScorePlayers = playerScores.filter(p => p.score === maxScore);

      if (topScorePlayers.length > 1) {
        // 有同分情況，顯示選擇器
        setPendingGameData({
          gameNumber,
          playerScores,
        });
        setShowWinnerSelection(true);
        setIsSubmitting(false);
        return;
      }

      // 沒有同分，直接標記最高分為贏家
      const playersWithWinner: PlayerRecord[] = playerScores.map(p => ({
        name: p.name,
        faction: p.faction as DuneFaction,
        score: p.score,
        isWinner: p.score === maxScore,
      }));

      await addGame({
        gameNumber,
        timestamp: Timestamp.now(),
        players: playersWithWinner,
        createdAt: Timestamp.now(),
        recognitionConfidence: 1.0,
      });

      showToast('遊戲記錄已新增！', 'success');
      navigate('/history');
    } catch (error) {
      console.error('Error adding game:', error);
      showToast('新增失敗，請重試', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWinnerConfirm = async (winnerIndexes: number[]) => {
    if (!pendingGameData) return;

    setIsSubmitting(true);
    setShowWinnerSelection(false);

    try {
      const { gameNumber, playerScores } = pendingGameData;

      // 根據選擇的索引標記勝利者
      const playersWithWinner: PlayerRecord[] = playerScores.map((p: any, index: number) => ({
        name: p.name,
        faction: p.faction as DuneFaction,
        score: p.score,
        isWinner: winnerIndexes.includes(index),
      }));

      await addGame({
        gameNumber,
        timestamp: Timestamp.now(),
        players: playersWithWinner,
        createdAt: Timestamp.now(),
        recognitionConfidence: 1.0,
      });

      showToast('遊戲記錄已新增！', 'success');
      navigate('/history');
    } catch (error) {
      console.error('Error adding game:', error);
      showToast('新增失敗，請重試', 'error');
    } finally {
      setIsSubmitting(false);
      setPendingGameData(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-orbitron font-bold text-dune-sand mb-8">手動輸入遊戲結果</h1>

      <Card>
        <div className="space-y-6">
          <p className="text-dune-sand/70 font-rajdhani">
            請輸入每位玩家的資訊。系統會自動判定最高分為贏家。
          </p>

          {players.map((player, index) => (
            <div key={player.id} className="border border-dune-sand/20 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-orbitron text-dune-spice">
                  玩家 {index + 1}
                </h3>
                {players.length > 3 && (
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="text-red-500 hover:text-red-400 font-rajdhani"
                  >
                    移除
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 玩家名稱 */}
                <div>
                  <label className="block text-dune-sand font-rajdhani mb-2">
                    玩家名稱（可搜尋）
                  </label>
                  <PlayerNameCombobox
                    value={player.name}
                    onChange={value => handlePlayerChange(player.id, 'name', value)}
                    suggestions={playerNameSuggestions}
                    placeholder="輸入或選擇玩家名稱..."
                  />
                </div>

                {/* 角色選擇 */}
                <div>
                  <label className="block text-dune-sand font-rajdhani mb-2">
                    角色（可搜尋）
                  </label>
                  <FactionCombobox
                    value={player.faction}
                    onChange={value => handlePlayerChange(player.id, 'faction', value)}
                    placeholder="輸入角色名稱搜尋..."
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
                    onChange={e => handlePlayerChange(player.id, 'score', e.target.value)}
                    placeholder="輸入分數"
                    min="0"
                    className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* 新增玩家按鈕 */}
          {players.length < 6 && (
            <button
              onClick={handleAddPlayer}
              className="w-full border-2 border-dashed border-dune-sand/30 rounded-lg py-4 text-dune-sand/70 hover:border-dune-spice hover:text-dune-spice transition-colors font-rajdhani"
            >
              + 新增玩家
            </button>
          )}

          {/* 操作按鈕 */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? '處理中...' : '儲存遊戲記錄'}
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              取消
            </Button>
          </div>

          {/* 提示訊息 */}
          <div className="text-sm text-dune-sand/60 font-rajdhani space-y-1">
            <p>💡 提示：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>預設 3 位玩家，可新增到最多 6 位</li>
              <li>玩家名稱支援搜尋，選擇現有玩家或輸入新名稱</li>
              <li>角色欄位支援搜尋，輸入名稱快速篩選</li>
              <li>如果有多位玩家同分，會彈出選擇勝利者的視窗</li>
            </ul>
          </div>
        </div>
      </Card>

      <WinnerSelectionModal
        players={pendingGameData?.playerScores || []}
        isOpen={showWinnerSelection}
        onClose={() => {
          setShowWinnerSelection(false);
          setPendingGameData(null);
        }}
        onConfirm={handleWinnerConfirm}
      />
    </motion.div>
  );
}
