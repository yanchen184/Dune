/**
 * AI 玩家判斷邏輯
 * 規則：玩家名稱 = 角色名稱 → AI 玩家
 */

import { DUNE_FACTIONS } from './constants';

/** 額外已知的 AI/NPC 名稱 */
const EXTRA_AI_NAMES = [
  '未知',
  '伊萊莎·伊卡茲',
  '「公主」尤娜·莫里特尼',
  '公主尤娜·莫里特尼',
  '尤娜·莫里特尼',
  'unknown',
  'ai',
  'bot',
  'npc',
  '電腦',
  '機器人',
  'computer',
  'cpu',
  '梅農',
  '阿麗亞娜',
  '保羅',
  '雷托',
];

/**
 * 檢查玩家名稱是否為 AI
 * - 空名稱 → AI
 * - 名稱等於任何角色名 → AI（角色名當名字的就是 AI）
 * - 名稱在額外黑名單中 → AI
 */
export function isAIPlayer(name: string | null | undefined): boolean {
  if (!name || name.trim() === '') return true;

  const normalized = name.trim().toLowerCase();

  // 名稱等於角色名 → AI
  if (DUNE_FACTIONS.some(faction => normalized === faction.toLowerCase())) {
    return true;
  }

  // 額外黑名單（包含比對）
  return EXTRA_AI_NAMES.some(aiName => {
    const lower = aiName.toLowerCase();
    return normalized === lower || normalized.includes(lower);
  });
}

/**
 * 過濾掉 AI 玩家
 */
export function filterRealPlayers<T extends { name: string }>(players: T[]): T[] {
  return players.filter(player => !isAIPlayer(player.name));
}
