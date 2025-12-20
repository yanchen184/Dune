# Firebase Storage 設定指南

## 🔥 問題：圖片上傳失敗

如果你在使用 AI 圖片識別功能時，圖片沒有被保存，可能是因為 Firebase Storage 的安全規則還沒有正確設定。

---

## 📋 解決步驟

### 1️⃣ 部署 Storage 安全規則到 Firebase

**方法 A: 使用 Firebase Console（推薦）**

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案：`dune-7e2b9`
3. 左側選單點擊 **Storage**
4. 點擊頂部的 **Rules** 標籤
5. 複製以下規則並貼上：

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all game images
    match /game-images/{imageId} {
      // Anyone can read (download) images
      allow read: if true;

      // Allow write (upload/update/delete) for all users
      // Note: In production, you would add authentication
      allow write: if true;
    }

    // Block all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

6. 點擊 **Publish** 發布規則

---

**方法 B: 使用 Firebase CLI（進階）**

如果你已安裝 Firebase CLI：

```bash
# 1. 登入 Firebase
firebase login

# 2. 初始化專案（如果還沒有）
firebase init storage

# 3. 部署 Storage 規則
firebase deploy --only storage
```

---

### 2️⃣ 驗證 Storage Bucket 名稱

確認 `src/lib/config.ts` 中的 `storageBucket` 設定正確：

```typescript
storageBucket: 'dune-7e2b9.firebasestorage.app',
```

如果不確定正確的 bucket 名稱：
1. 前往 Firebase Console → Storage
2. 查看頂部顯示的 bucket 名稱
3. 更新 `config.ts` 中的設定

---

### 3️⃣ 測試圖片上傳

1. 開啟瀏覽器的開發者工具（F12）
2. 切換到 **Console** 標籤
3. 前往「上傳遊戲結果」頁面
4. 上傳一張圖片並點擊「AI 識別並上傳」
5. 查看 Console 輸出：

**成功訊息：**
```
📤 Starting upload: game-20-2025-01-01.webp (250.45 KB)
✅ Upload completed, getting download URL...
✅ Download URL obtained: https://firebasestorage.googleapis.com/...
✅ 圖片上傳成功
```

**失敗訊息：**
```
❌ Image upload failed: Error: ...
⚠️ 圖片上傳失敗，但遊戲記錄已保存
```

---

## 🐛 常見問題排查

### Q1: 看到 "Firebase Storage: User does not have permission"

**原因**: Storage 安全規則還沒有部署或配置錯誤

**解決**: 按照步驟 1 重新部署安全規則

---

### Q2: 看到 "Upload timeout after 30 seconds"

**原因**: 圖片太大或網路速度慢

**解決**:
1. 確認圖片大小 < 5MB
2. 使用壓縮工具減少圖片大小
3. 檢查網路連線

---

### Q3: 看到 CORS 錯誤

**原因**: Firebase Storage CORS 配置問題

**解決**:
1. 前往 Firebase Console → Storage → Settings
2. 確認 CORS 已啟用
3. 或使用 gsutil 手動設定：
   ```bash
   gsutil cors set cors.json gs://dune-7e2b9.firebasestorage.app
   ```

   `cors.json` 內容：
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT", "DELETE"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

---

### Q4: 圖片上傳成功但沒有顯示

**原因**: 圖片 URL 沒有正確保存到 Firestore

**解決**:
1. 打開 Firebase Console → Firestore
2. 檢查 `games` collection 中的文件
3. 確認文件有 `imageUrl` 欄位且值不為空
4. 如果缺少，可能是 Firestore 安全規則問題

---

## ✅ 檢查清單

完成以下檢查確保圖片上傳功能正常：

- [ ] Firebase Storage 安全規則已部署
- [ ] `storageBucket` 設定正確
- [ ] 瀏覽器 Console 顯示圖片上傳成功訊息
- [ ] 遊戲歷史頁面顯示 "📸 有圖片" 標記
- [ ] 點擊「📸 圖片」按鈕可以查看圖片
- [ ] Firebase Console → Storage 中可以看到上傳的圖片

---

## 🔒 生產環境安全建議

目前的 Storage 規則允許任何人讀寫，適合個人專案和開發環境。

**如果要部署到生產環境**，建議修改規則加入驗證：

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /game-images/{imageId} {
      // Anyone can read
      allow read: if true;

      // Only authenticated users can write
      allow write: if request.auth != null;
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

然後在應用中添加 Firebase Authentication。

---

## 📞 需要幫助？

如果按照以上步驟仍然無法上傳圖片，請：

1. 檢查瀏覽器 Console 的完整錯誤訊息
2. 檢查 Firebase Console → Storage → Files 是否有檔案
3. 檢查 Firebase Console → Usage 是否超過免費額度
4. 提供 Console 錯誤截圖以便診斷
