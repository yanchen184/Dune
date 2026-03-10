import { useState } from 'react';
import { analyzeGameImage } from '@/lib/openai';
import { fileToBase64 } from '@/lib/utils';
import { VisionRecognitionResult } from '@/lib/types';

export function useVision() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyze image with retry mechanism
   * @param file - 圖片檔案
   * @param maxRetries - 最大重試次數
   * @param userHint - 使用者補充的錯誤提示
   * @param customPrompt - 自訂 prompt（從 Firestore 讀取）
   */
  const analyzeImage = async (
    file: File,
    maxRetries = 3,
    userHint?: string,
    customPrompt?: string
  ): Promise<VisionRecognitionResult | null> => {
    setLoading(true);
    setError(null);

    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        const base64 = await fileToBase64(file);
        const result = await analyzeGameImage(base64, userHint, customPrompt);
        setLoading(false);
        return result;
      } catch (err) {
        attempts++;
        console.error(`❌ Vision API attempt ${attempts}/${maxRetries} failed:`, err);

        if (attempts >= maxRetries) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          setLoading(false);
          return null;
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    return null;
  };

  return {
    analyzeImage,
    loading,
    error,
  };
}
