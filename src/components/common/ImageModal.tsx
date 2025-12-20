import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { downloadBase64Image } from '@/lib/imageUtils';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null; // Can be either Base64 or URL
  gameNumber: number;
  onClose: () => void;
}

/**
 * 圖片查看 Modal
 * Reason: 用於在遊戲歷史頁面點擊查看大圖
 * 支援 Base64 和 URL 兩種格式
 */
export default function ImageModal({ isOpen, imageUrl, gameNumber, onClose }: ImageModalProps) {
  // ESC 鍵關閉
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // 防止背景滾動
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!imageUrl) return null;

  // Check if it's a Base64 image or URL
  const isBase64 = imageUrl.startsWith('data:image');

  const handleOpenInNewTab = () => {
    if (isBase64) {
      // For Base64, open in new tab directly
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>遊戲 #${gameNumber} - 結算圖片</title></head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#000;">
              <img src="${imageUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
            </body>
          </html>
        `);
      }
    } else {
      // For URL, open directly
      window.open(imageUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (isBase64) {
      downloadBase64Image(imageUrl, `game-${gameNumber}.jpg`);
    } else {
      // For URL, trigger download
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `game-${gameNumber}.jpg`;
      a.click();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            {/* Modal 內容 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dune-deep border-2 border-dune-spice rounded-xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col cursor-default"
            >
              {/* 標題欄 */}
              <div className="bg-dune-sky/30 border-b border-dune-sand/20 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-orbitron text-dune-spice">
                    遊戲 #{gameNumber} - 結算圖片
                  </h3>
                  <p className="text-sm font-rajdhani text-dune-sand/70 mt-1">
                    點擊圖片外區域或按 ESC 關閉
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-400 rounded-lg p-2 transition-all"
                  title="關閉 (ESC)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 圖片內容 */}
              <div className="flex-1 overflow-auto p-6 bg-dune-deep/50">
                <div className="flex items-center justify-center min-h-full">
                  <img
                    src={imageUrl}
                    alt={`遊戲 #${gameNumber} 結算圖片`}
                    className="max-w-full max-h-full object-contain rounded-lg border-2 border-dune-sand/20 shadow-2xl cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleOpenInNewTab}
                    title="點擊在新分頁中打開"
                  />
                </div>
              </div>

              {/* 底部操作欄 */}
              <div className="bg-dune-sky/30 border-t border-dune-sand/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-dune-sand/70 font-rajdhani">
                  <span className="text-2xl">💡</span>
                  <span>提示：點擊圖片可以在新分頁中打開{isBase64 ? '' : '原圖'}</span>
                </div>
                <div className="flex gap-3">
                  {isBase64 && (
                    <button
                      onClick={handleDownload}
                      className="bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 text-green-400 font-rajdhani px-4 py-2 rounded-lg transition-all"
                      title="下載圖片"
                    >
                      💾 下載
                    </button>
                  )}
                  <button
                    onClick={handleOpenInNewTab}
                    className="bg-dune-spice/20 hover:bg-dune-spice/40 border border-dune-spice/50 text-dune-spice font-rajdhani px-4 py-2 rounded-lg transition-all"
                  >
                    🔗 在新分頁打開
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-dune-sand/20 hover:bg-dune-sand/40 border border-dune-sand/50 text-dune-sand font-rajdhani px-4 py-2 rounded-lg transition-all"
                  >
                    關閉
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
