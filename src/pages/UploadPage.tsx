import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useVision } from '@/hooks/useVision';
import { useStorage } from '@/hooks/useStorage';
import { useFirebase } from '@/hooks/useFirebase';
import { useToast } from '@/hooks/useToast';
import { Timestamp } from 'firebase/firestore';
import { PlayerRecord, DuneFaction } from '@/lib/types';
import { validateImageFile } from '@/lib/utils';
import { MAX_FILE_SIZE } from '@/lib/constants';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { analyzeImage, loading: visionLoading } = useVision();
  const { uploadImage } = useStorage();
  const { addGame, getNextGameNumber } = useFirebase();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const processFile = (selectedFile: File) => {
    const validation = validateImageFile(selectedFile, MAX_FILE_SIZE);
    if (!validation.valid) {
      showToast(validation.error!, 'error');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    processFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          faction: p.faction as DuneFaction,
          score: p.score,
          isWinner: p.isWinner,
        })) as PlayerRecord[],
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
          {/* 隱藏的檔案輸入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* 拖放上傳區域 */}
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key="upload-zone"
              >
                <div
                  onClick={handleClickUpload}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`
                    relative border-3 border-dashed rounded-xl p-12 cursor-pointer
                    transition-all duration-300 ease-in-out
                    ${isDragging
                      ? 'border-dune-spice bg-dune-spice/20 scale-105'
                      : 'border-dune-sand/40 hover:border-dune-spice/60 hover:bg-dune-sky/30'
                    }
                  `}
                >
                  {/* 背景裝飾 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-dune-spice/5 to-transparent rounded-xl pointer-events-none" />

                  <div className="relative flex flex-col items-center justify-center space-y-6">
                    {/* 圖標 */}
                    <motion.div
                      animate={isDragging ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                      className="text-7xl"
                    >
                      📸
                    </motion.div>

                    {/* 文字說明 */}
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-orbitron text-dune-spice font-bold">
                        {isDragging ? '放開以上傳' : '上傳遊戲結算圖片'}
                      </h3>
                      <p className="text-dune-sand/70 font-rajdhani text-lg">
                        拖放圖片到此處或點擊選擇檔案
                      </p>
                    </div>

                    {/* 支援格式說明 */}
                    <div className="flex items-center gap-6 text-dune-sand/60 font-rajdhani text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🖼️</span>
                        <span>JPG, PNG, WebP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📏</span>
                        <span>最大 {MAX_FILE_SIZE / 1024 / 1024}MB</span>
                      </div>
                    </div>

                    {/* AI 識別說明 */}
                    <div className="bg-dune-deep/50 border border-dune-spice/30 rounded-lg p-4 max-w-md">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🤖</span>
                        <div className="flex-1 text-sm font-rajdhani text-dune-sand/80">
                          <p className="font-bold text-dune-spice mb-1">AI 自動識別</p>
                          <p>使用 OpenAI GPT-4o Vision 自動提取玩家名稱、角色和分數</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                key="preview"
                className="space-y-4"
              >
                {/* 圖片預覽 */}
                <div className="relative">
                  <div className="relative rounded-xl overflow-hidden border-2 border-dune-spice/50">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-96 object-contain bg-dune-deep/30"
                    />
                    {/* 移除按鈕 */}
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-all shadow-lg"
                      title="移除圖片"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* 檔案資訊 */}
                  <div className="mt-4 bg-dune-sky/30 rounded-lg p-4">
                    <div className="flex items-center justify-between font-rajdhani">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="text-dune-sand font-medium">{file?.name}</p>
                          <p className="text-dune-sand/60 text-sm">
                            {(file!.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <span className="text-green-400 text-2xl">✓</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {visionLoading && <Loading message="AI 正在分析圖片..." />}

          {/* 操作按鈕 */}
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!file || isProcessing || visionLoading}
              className="flex-1 min-w-[200px]"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">🤖</span>
                {isProcessing ? '處理中...' : 'AI 識別並上傳'}
              </span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/manual')}
              className="flex-1 min-w-[150px]"
            >
              ✍️ 手動輸入
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="min-w-[100px]"
            >
              取消
            </Button>
          </div>

          {/* 提示訊息 */}
          <div className="bg-dune-deep/30 border border-dune-sand/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="flex-1 text-sm font-rajdhani text-dune-sand/70">
                <p className="font-bold text-dune-sand mb-1">使用提示</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>確保圖片清晰，玩家名稱和分數清楚可見</li>
                  <li>AI 識別信心度建議 &gt; 80% 的結果</li>
                  <li>如果 AI 識別失敗，可使用「手動輸入」功能</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
