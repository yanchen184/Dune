import { DuneFaction } from './types';

/**
 * All available Dune factions (支援中英文角色名稱)
 */
export const DUNE_FACTIONS: DuneFaction[] = [
  '亞崔迪',
  '哈肯能',
  '皇帝',
  '弗雷曼',
  '貝尼·傑瑟里特',
  '間行會',
  '梅農·索瓦爾德伯爵',
  '海倫娜·里奇斯',
  '格羅蘇·拉班',
  'Atreides',
  'Harkonnen',
  'Emperor',
  'Fremen',
  'Bene Gesserit',
  'Spacing Guild',
  'Count Memnon Thorvald',
  'Helena Richese',
  'Glossu Rabban',
];

/**
 * Faction color mapping for UI display
 */
export const DUNE_COLORS: Record<string, string> = {
  '亞崔迪': '#2E7D32',
  '哈肯能': '#C62828',
  '皇帝': '#FFD700',
  '弗雷曼': '#1976D2',
  '貝尼·傑瑟里特': '#7B1FA2',
  '間行會': '#FF6F00',
  '梅農·索瓦爾德伯爵': '#4CAF50',
  '海倫娜·里奇斯': '#E91E63',
  '格羅蘇·拉班': '#FF5722',
  'Atreides': '#2E7D32',
  'Harkonnen': '#C62828',
  'Emperor': '#FFD700',
  'Fremen': '#1976D2',
  'Bene Gesserit': '#7B1FA2',
  'Spacing Guild': '#FF6F00',
  'Count Memnon Thorvald': '#4CAF50',
  'Helena Richese': '#E91E63',
  'Glossu Rabban': '#FF5722',
  'Unknown': '#757575',
};

/**
 * Maximum file size for image upload (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Supported image formats
 */
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Toast auto-dismiss time (milliseconds)
 */
export const TOAST_DURATION = 3000;

/**
 * Pagination defaults
 */
export const GAMES_PER_PAGE = 20;
