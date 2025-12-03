import OpenAI from 'openai';
import { VisionRecognitionResult } from './types';

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

/**
 * Analyzes a game result image and extracts player information
 * @param imageBase64 - Base64 encoded image string
 * @returns Promise containing player information and recognition confidence
 */
export async function analyzeGameImage(
  imageBase64: string
): Promise<VisionRecognitionResult> {
  const prompt = `
分析這張沙丘桌遊的結算圖片，提取以下資訊。
請以JSON格式返回：
{
  "players": [
    {
      "name": "玩家名稱",
      "faction": "角色中文名稱",
      "score": 分數(數字),
      "isWinner": 是否勝利(布林值)
    }
  ],
  "confidence": 識別信心度(0-1)
}

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

最高分者為勝利者。無法識別的欄位用null。
請只返回 JSON，不要包含其他文字說明。
`;

  try {
    console.log('🤖 Calling OpenAI Vision API...');
    console.log('📝 API Key configured:', !!import.meta.env.VITE_OPENAI_API_KEY);
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

export { client };
export default client;
