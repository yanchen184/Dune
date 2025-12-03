import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useVision } from '@/hooks/useVision';
import { useStorage } from '@/hooks/useStorage';
import { useFirebase } from '@/hooks/useFirebase';
import { useToast } from '@/hooks/useToast';
import { Timestamp } from 'firebase/firestore';
import { validateImageFile } from '@/lib/utils';
import { MAX_FILE_SIZE } from '@/lib/constants';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { analyzeImage, loading: visionLoading } = useVision();
  const { uploadImage } = useStorage();
  const { addGame, getNextGameNumber } = useFirebase();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = validateImageFile(selectedFile, MAX_FILE_SIZE);
    if (!validation.valid) {
      showToast(validation.error!, 'error');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await analyzeImage(file);

      if (!result) {
        showToast('AI 識別失敗，請改用手動輸入', 'error');
        setTimeout(() => {
          navigate('/manual');
        }, 2000);
        return;
      }

      const gameNumber = await getNextGameNumber();

      // Try to upload image, but don't fail if it doesn't work
      let imageUrl: string | undefined;
      try {
        imageUrl = await uploadImage(file, gameNumber);
        console.log('✅ Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.warn('⚠️ Image upload failed, continuing without image:', uploadError);
        // Continue without image - it's optional
      }

      const gameData = {
        gameNumber,
        timestamp: Timestamp.now(),
        ...(imageUrl && { imageUrl }), // Only include if defined
        players: result.players.map(p => ({
          name: p.name,
          faction: p.faction,
          score: p.score,
          isWinner: p.isWinner,
        })),
        createdAt: Timestamp.now(),
        recognitionConfidence: result.confidence,
      };

      console.log('💾 Attempting to save game:', gameData);
      await addGame(gameData);

      showToast('遊戲記錄已新增！', 'success');
      navigate('/history');
    } catch (error) {
      console.error('❌ Failed to save game:', error);
      showToast('上傳失敗', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-orbitron font-bold text-dune-sand mb-8">上傳遊戲結果</h1>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-dune-sand font-rajdhani mb-2">選擇圖片</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg"
            />
          </div>

          {preview && (
            <div>
              <img src={preview} alt="Preview" className="max-w-md mx-auto rounded-lg" />
            </div>
          )}

          {visionLoading && <Loading message="AI 正在分析圖片..." />}

          <div className="flex gap-4">
            <Button onClick={handleSubmit} disabled={!file || isProcessing}>
              {isProcessing ? '處理中...' : '上傳並識別'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/manual')}>
              手動輸入
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              取消
            </Button>
          </div>

          <p className="text-sm text-dune-sand/60 font-rajdhani mt-4">
            💡 提示：如果 AI 識別失敗，可以點擊「手動輸入」按鈕改用手動方式輸入遊戲結果
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
