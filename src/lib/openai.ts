import OpenAI from 'openai';
import { VisionRecognitionResult } from './types';
import { getConfig } from './config';

/**
 * 玩家名稱別名對照表
 * key: 各種可能的變體名稱（小寫）
 * value: 標準化後的名稱
 */
const PLAYER_NAME_ALIASES: Record<string, string> = {
  'lukesuhaoo': 'lukehsuhao',
  'lukesuhao': 'lukehsuhao',
  'luke_suhao': 'lukehsuhao',
  'lukehsuhaoo': 'lukehsuhao',
};

/**
 * AI 玩家名稱列表（需要過濾掉的非真人玩家）
 * 這些是遊戲中的 AI/NPC 角色，不應該被計入統計
 */
const AI_PLAYER_NAMES: string[] = [
  '未知',
  '伊萊莎·伊卡茲',
  '「公主」尤娜·莫里特尼',
  '公主尤娜·莫里特尼',
  '尤娜·莫里特尼',
  'unknown',
  'ai',
  'bot',
  'npc',
];

/**
 * 檢查是否為 AI 玩家
 * @param name - 玩家名稱
 * @returns 是否為 AI 玩家
 */
function isAIPlayer(name: string): boolean {
  if (!name) return true;
  const lowerName = name.toLowerCase().trim();
  return AI_PLAYER_NAMES.some(aiName =>
    lowerName === aiName.toLowerCase() ||
    lowerName.includes(aiName.toLowerCase())
  );
}

/**
 * 標準化玩家名稱
 * @param name - 原始玩家名稱
 * @returns 標準化後的名稱
 */
function normalizePlayerName(name: string): string {
  if (!name) return name;
  const lowerName = name.toLowerCase().trim();
  return PLAYER_NAME_ALIASES[lowerName] || name;
}

// Get OpenAI client (lazy initialization)
function getOpenAIClient(): OpenAI {
  const config = getConfig();
  if (!config?.openaiApiKey) {
    throw new Error('OpenAI API Key not configured. Please configure in Settings.');
  }

  return new OpenAI({
    apiKey: config.openaiApiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });
}

/**
 * Analyzes a game result image and extracts player information
 * @param imageBase64 - Base64 encoded image string
 * @returns Promise containing player information and recognition confidence
 */
export async function analyzeGameImage(
  imageBase64: string,
  userHint?: string
): Promise<VisionRecognitionResult> {
  const prompt = `
分析這張沙丘桌遊的結算圖片，提取以下資訊。
${userHint ? `\n🔔 使用者補充說明（請特別注意）：\n${userHint}\n` : ''}
請以JSON格式返回：
{
  "players": [
    {
      "name": "玩家名稱",
      "faction": "角色中文名稱",
      "score": 分數(數字),
      "spice": 香料數量(數字，可選),
      "coins": 錢幣數量(數字，可選),
      "isWinner": 是否勝利(布林值)
    }
  ],
  "confidence": 識別信心度(0-1)
}

⚠️⚠️⚠️ 最重要：玩家名稱修正規則 ⚠️⚠️⚠️
有一位玩家名稱經常被辨識錯誤，請【特別注意】：
✅ 正確名稱：「lukehsuhao」
❌ 常見錯誤辨識：lukesuhaoo、lukesuhao、luke_suhao、lukehsuhaoo、lukeHsuhao、Lukehsuhao、lukehsuaho
👉 規則：只要看到以「luke」開頭、包含「suhao」或「hsuhao」的任何文字，全部統一輸出為「lukehsuhao」
👉 不論大小寫、多一個 o、少一個 h、字母順序略有不同，都是同一個人，一律輸出「lukehsuhao」

🚫 重要：以下是 AI/NPC 玩家，請【完全排除】，不要放入結果中：
- "未知"
- "伊萊莎·伊卡茲"
- "「公主」尤娜·莫里特尼"、"公主尤娜·莫里特尼"、"尤娜·莫里特尼"
- 玩家名稱如果等於角色名稱（如「皇帝」「弗雷曼」「亞崔迪」「哈肯能」等），那就是 AI 玩家，請排除
- 任何看起來像是 AI、NPC、Bot 的名稱
只保留真人玩家的資料！

角色名稱必須使用中文，從以下選擇：
- 亞崔迪（Atreides）
- 哈肯能（Harkonnen）
- 皇帝（Emperor）
- 弗雷曼（Fremen）
- 貝尼·傑瑟里特（Bene Gesserit）
- 間行會（Spacing Guild）
- 梅農·索瓦爾德伯爵（Count Memnon Thorvald）
- 海倫娜·里奇斯（Helena Richese）
- 格羅蘇·拉班（Glossu Rabban）

勝利者判定規則（依序比較）：
1. 最高分數者為勝利者
2. 如果分數相同，比較香料數量，最多者勝
3. 如果香料也相同，比較錢幣數量，最多者勝
4. 如果都相同，則為並列勝利

請嘗試識別圖片中的香料(spice)和錢幣(coins)數量。
無法識別的欄位請用 0 代替（spice 和 coins）或 null（name, faction）。
請只返回 JSON，不要包含其他文字說明。
`;

  try {
    const client = getOpenAIClient();
    const config = getConfig();

    console.log('🤖 Calling OpenAI Vision API...');
    console.log('📝 API Key configured:', !!config?.openaiApiKey);
    console.log('🖼️ Image size (base64):', Math.round(imageBase64.length / 1024), 'KB');

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for consistent JSON output
    });

    console.log('✅ OpenAI API response received');
    console.log('📊 Response:', response);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('❌ No content in response');
      throw new Error('No response from OpenAI');
    }

    console.log('📄 Response content:', content);

    // 去除 markdown 代碼塊標記（如果存在）
    let cleanedContent = content.trim();

    // 移除 ```json 和 ``` 標記
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*\n?/, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*\n?/, '');
    }

    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.replace(/\n?```$/, '');
    }

    console.log('🧹 Cleaned content:', cleanedContent);

    // Parse JSON response
    const result = JSON.parse(cleanedContent) as VisionRecognitionResult;

    // 處理玩家資料：1. 過濾 AI 玩家 2. 標準化名稱
    if (result.players) {
      const originalCount = result.players.length;

      result.players = result.players
        // 過濾掉 AI/NPC 玩家
        .filter(player => {
          if (isAIPlayer(player.name)) {
            console.log(`🤖 Filtered out AI player: ${player.name}`);
            return false;
          }
          return true;
        })
        // 標準化玩家名稱
        .map(player => ({
          ...player,
          name: normalizePlayerName(player.name),
        }));

      const filteredCount = originalCount - result.players.length;
      if (filteredCount > 0) {
        console.log(`🚫 Removed ${filteredCount} AI player(s)`);
      }
      console.log('🔄 Player names normalized');
    }

    console.log('✅ Parsed result:', result);
    return result;
  } catch (error) {
    console.error('❌ OpenAI Vision API error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Failed to analyze image. Please try again or enter data manually.');
  }
}
