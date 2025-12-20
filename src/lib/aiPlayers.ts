/**
 * AI 玩家名稱黑名單
 * Reason: 過濾掉使用角色名稱的 AI 玩家，避免污染統計數據
 */

// AI 玩家的常見名稱（角色名）
export const AI_PLAYER_NAMES = [
  // 中文角色名
  '雷托',
  '保羅',
  '阿麗亞',
  '阿麗亞娜',  // 常見誤寫或變體
  '潔西卡',
  '查尼',
  '斯第爾格',
  '鄧肯',
  '格尼',
  '哈克南男爵',
  '菲得羅斯',
  '拉班',
  '皇帝',
  '伊魯朗公主',
  '梅農',  // 梅農·索瓦爾德伯爵的簡稱
  '海倫娜',  // 海倫娜·里奇斯的簡稱
  '格羅蘇',  // 格羅蘇·拉班的簡稱

  // 英文角色名
  'Leto',
  'Paul',
  'Alia',
  'Ariana',  // 常見誤寫或變體
  'Jessica',
  'Chani',
  'Stilgar',
  'Duncan',
  'Gurney',
  'Baron',
  'Feyd',
  'Rabban',
  'Emperor',
  'Irulan',
  'Memnon',  // Count Memnon Thorvald 的簡稱
  'Helena',  // Helena Richese 的簡稱
  'Glossu',  // Glossu Rabban 的簡稱

  // 常見的 AI 標記
  'AI',
  'Bot',
  'Computer',
  'CPU',
  '電腦',
  '機器人',
];

/**
 * 檢查玩家名稱是否為 AI
 * @param name - 玩家名稱
 * @returns true 如果是 AI 玩家或空名稱
 */
export function isAIPlayer(name: string | null | undefined): boolean {
  // 空名稱視為 AI
  if (!name || name.trim() === '') {
    return true;
  }

  const normalizedName = name.trim().toLowerCase();

  // 檢查是否在黑名單中
  return AI_PLAYER_NAMES.some(aiName =>
    normalizedName === aiName.toLowerCase()
  );
}

/**
 * 檢查玩家名稱是否包含 AI 關鍵字
 * @param name - 玩家名稱
 * @returns true 如果包含 AI 相關關鍵字
 */
export function containsAIKeyword(name: string | null | undefined): boolean {
  if (!name || name.trim() === '') {
    return true;
  }

  const normalizedName = name.trim().toLowerCase();
  const aiKeywords = ['ai', 'bot', 'cpu', 'computer', '電腦', '機器人'];

  return aiKeywords.some(keyword =>
    normalizedName.includes(keyword.toLowerCase())
  );
}

/**
 * 過濾掉 AI 玩家
 * @param players - 玩家列表
 * @returns 只包含真實玩家的列表
 */
export function filterRealPlayers<T extends { name: string }>(players: T[]): T[] {
  return players.filter(player => !isAIPlayer(player.name));
}
