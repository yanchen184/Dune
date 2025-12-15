import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/hooks/useFirebase';
import { useGames } from '@/hooks/useGames';
import { useToast } from '@/hooks/useToast';
import { Timestamp } from 'firebase/firestore';
import { PlayerRecord, DuneFaction } from '@/lib/types';
import { isAIPlayer } from '@/lib/aiPlayers';
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
  spice: string;
  coins: string;
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
    { id: '1', name: '', faction: '', score: '', spice: '', coins: '' },
    { id: '2', name: '', faction: '', score: '', spice: '', coins: '' },
    { id: '3', name: '', faction: '', score: '', spice: '', coins: '' },
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
      { id: Date.now().toString(), name: '', faction: '', score: '', spice: '', coins: '' },
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
      // Spice and coins are optional, but must be valid numbers if filled
      if (player.spice && isNaN(Number(player.spice))) {
        showToast('香料必須是有效數字', 'error');
        return false;
      }
      if (player.coins && isNaN(Number(player.coins))) {
        showToast('錢幣必須是有效數字', 'error');
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

  /**
   * 判定勝利者邏輯：分數 → 香料 → 錢幣
   * Reason: 根據規則，先比分數，同分比香料，香料相同比錢幣
   */
  const determineWinners = (playerData: Array<{
    name: string;
    faction: string;
    score: number;
    spice: number;
    coins: number;
  }>) => {
    // 1. 找出最高分
    const maxScore = Math.max(...playerData.map(p => p.score));
    let candidates = playerData.filter(p => p.score === maxScore);

    // 如果只有一位最高分，直接返回
    if (candidates.length === 1) {
      return candidates.map(p => p.name);
    }

    // 2. 比較香料
    const maxSpice = Math.max(...candidates.map(p => p.spice));
    candidates = candidates.filter(p => p.spice === maxSpice);

    // 如果香料比較後只有一位，返回
    if (candidates.length === 1) {
      return candidates.map(p => p.name);
    }

    // 3. 比較錢幣
    const maxCoins = Math.max(...candidates.map(p => p.coins));
    candidates = candidates.filter(p => p.coins === maxCoins);

    // 返回所有仍然並列的玩家名稱
    return candidates.map(p => p.name);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const gameNumber = await getNextGameNumber();

      // 將資料轉換為數字
      const playerScores = players.map(p => ({
        name: p.name.trim(),
        faction: p.faction,
        score: Number(p.score),
        spice: p.spice ? Number(p.spice) : 0,
        coins: p.coins ? Number(p.coins) : 0,
      }));

      // 使用新的判定邏輯找出勝利者
      const winnerNames = determineWinners(playerScores);

      if (winnerNames.length > 1) {
        // 有多位並列勝利者，顯示選擇器
        setPendingGameData({
          gameNumber,
          playerScores,
        });
        setShowWinnerSelection(true);
        setIsSubmitting(false);
        return;
      }

      // 有明確的勝利者，直接標記
      const allPlayers: PlayerRecord[] = playerScores.map(p => ({
        name: p.name,
        faction: p.faction as DuneFaction,
        score: p.score,
        spice: p.spice,
        coins: p.coins,
        isWinner: winnerNames.includes(p.name),
      }));

      // 過濾掉 AI 玩家
      // Reason: AI 玩家不應該計入統計數據
      const realPlayers = allPlayers.filter(p => !isAIPlayer(p.name));

      // 如果過濾後沒有真實玩家，顯示錯誤
      if (realPlayers.length === 0) {
        showToast('❌ 必須至少有一位真實玩家', 'error');
        setIsSubmitting(false);
        return;
      }

      // 如果過濾掉了一些 AI 玩家，顯示提示
      if (realPlayers.length < allPlayers.length) {
        const filteredCount = allPlayers.length - realPlayers.length;
        showToast(`✅ 已過濾 ${filteredCount} 位 AI 玩家`, 'info');
      }

      await addGame({
        gameNumber,
        timestamp: Timestamp.now(),
        players: realPlayers,
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
      const allPlayers: PlayerRecord[] = playerScores.map((p: any, index: number) => ({
        name: p.name,
        faction: p.faction as DuneFaction,
        score: p.score,
        spice: p.spice,
        coins: p.coins,
        isWinner: winnerIndexes.includes(index),
      }));

      // 過濾掉 AI 玩家
      const realPlayers = allPlayers.filter(p => !isAIPlayer(p.name));

      // 如果過濾後沒有真實玩家，顯示錯誤
      if (realPlayers.length === 0) {
        showToast('❌ 必須至少有一位真實玩家', 'error');
        setIsSubmitting(false);
        setPendingGameData(null);
        return;
      }

      // 如果過濾掉了一些 AI 玩家，顯示提示
      if (realPlayers.length < allPlayers.length) {
        const filteredCount = allPlayers.length - realPlayers.length;
        showToast(`✅ 已過濾 ${filteredCount} 位 AI 玩家`, 'info');
      }

      await addGame({
        gameNumber,
        timestamp: Timestamp.now(),
        players: realPlayers,
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* 分數、香料、錢幣（第二行）*/}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* 分數 */}
                <div>
                  <label className="block text-dune-sand font-rajdhani mb-2">
                    最終得分 <span className="text-dune-spice">*</span>
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

                {/* 香料 */}
                <div>
                  <label className="block text-dune-sand font-rajdhani mb-2">
                    香料數量（可選）
                  </label>
                  <input
                    type="number"
                    value={player.spice}
                    onChange={e => handlePlayerChange(player.id, 'spice', e.target.value)}
                    placeholder="香料數"
                    min="0"
                    className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice"
                  />
                </div>

                {/* 錢幣 */}
                <div>
                  <label className="block text-dune-sand font-rajdhani mb-2">
                    錢幣數量（可選）
                  </label>
                  <input
                    type="number"
                    value={player.coins}
                    onChange={e => handlePlayerChange(player.id, 'coins', e.target.value)}
                    placeholder="錢幣數"
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
              <li>香料和錢幣為可選欄位，用於同分時的勝負判定</li>
              <li>勝負判定順序：分數 → 香料 → 錢幣</li>
              <li>如果經過所有比較仍並列，會彈出選擇勝利者的視窗</li>
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
