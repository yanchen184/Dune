/**
 * 圖片處理工具函數
 * Reason: 實作圖片壓縮和 Base64 編碼，用於替代 Firebase Storage
 */

/**
 * 壓縮圖片並轉為 Base64
 * @param file - 原始圖片檔案
 * @param maxSizeKB - 最大大小（KB），預設 400KB（Firestore 單文件限制 1MB）
 * @param quality - 壓縮品質（0-1），預設 0.8
 * @returns Promise<string> - Base64 字串
 */
export async function compressImageToBase64(
  file: File,
  maxSizeKB: number = 400,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 計算壓縮後的尺寸
        let width = img.width;
        let height = img.height;
        const maxDimension = 1920; // 最大寬度/高度

        // 縮小尺寸以減少檔案大小
        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        // 創建 canvas 並繪製圖片
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 嘗試不同品質直到檔案小於目標大小
        let currentQuality = quality;
        let base64: string;

        const tryCompress = () => {
          base64 = canvas.toDataURL('image/jpeg', currentQuality);
          const sizeKB = (base64.length * 3) / 4 / 1024; // Base64 大小估算

          console.log(`🖼️ Compressed to ${sizeKB.toFixed(2)} KB (quality: ${currentQuality.toFixed(2)})`);

          if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
            resolve(base64);
          } else {
            // 降低品質重試
            currentQuality -= 0.1;
            tryCompress();
          }
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * 驗證 Base64 圖片大小
 * @param base64 - Base64 字串
 * @returns 大小（KB）
 */
export function getBase64Size(base64: string): number {
  return (base64.length * 3) / 4 / 1024;
}

/**
 * 從 Base64 創建可下載的 Blob
 * @param base64 - Base64 字串
 * @returns Blob 物件
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

/**
 * 下載 Base64 圖片
 * @param base64 - Base64 字串
 * @param filename - 檔案名稱
 */
export function downloadBase64Image(base64: string, filename: string): void {
  const blob = base64ToBlob(base64);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
