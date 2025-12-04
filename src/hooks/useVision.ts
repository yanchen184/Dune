import { useState } from 'react';
import { analyzeGameImage } from '@/lib/openai';
import { fileToBase64 } from '@/lib/utils';
import { VisionRecognitionResult } from '@/lib/types';

export function useVision() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyze image with retry mechanism
   */
  const analyzeImage = async (
    file: File,
    maxRetries = 3
  ): Promise<VisionRecognitionResult | null> => {
    setLoading(true);
    setError(null);

    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        // Convert file to base64
        const base64 = await fileToBase64(file);

        // Call OpenAI Vision API
        const result = await analyzeGameImage(base64);

        setLoading(false);
        return result;
      } catch (err) {
        attempts++;
        console.error(`❌ Vision API attempt ${attempts}/${maxRetries} failed:`);
        console.error('Error details:', err);

        // 詳細錯誤資訊
        if (err instanceof Error) {
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        }

        if (attempts >= maxRetries) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('🚫 All retry attempts failed. Final error:', errorMessage);
          setError(errorMessage);
          setLoading(false);
          return null;
        }

        console.log(`⏳ Waiting ${1000 * attempts}ms before retry...`);
        // Wait before retry (exponential backoff)
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
