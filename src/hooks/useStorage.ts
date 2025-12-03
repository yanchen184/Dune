import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getStorageInstance } from '@/lib/firebase';
import { generateImageFilename } from '@/lib/utils';

export function useStorage() {
  /**
   * Upload image to Firebase Storage
   * Note: In a real app, you would compress the image here
   * For now, we'll upload directly
   */
  const uploadImage = async (file: File, gameNumber: number): Promise<string> => {
    const storage = getStorageInstance();
    if (!storage) throw new Error('Firebase Storage not initialized. Please configure in Settings.');

    try {
      const filename = generateImageFilename(gameNumber);
      const storageRef = ref(storage, `game-images/${filename}`);

      // Add timeout to prevent hanging on CORS errors
      const uploadPromise = (async () => {
        await uploadBytes(storageRef, file, {
          contentType: file.type,
        });
        return await getDownloadURL(storageRef);
      })();

      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout after 10 seconds')), 10000);
      });

      // Race between upload and timeout
      const downloadURL = await Promise.race([uploadPromise, timeoutPromise]);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  /**
   * Delete image from Firebase Storage
   */
  const deleteImage = async (url: string): Promise<void> => {
    const storage = getStorageInstance();
    if (!storage) {
      console.warn('Firebase Storage not initialized');
      return;
    }

    try {
      // Extract path from URL
      // Firebase Storage URLs format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
      const urlObj = new URL(url);
      const path = urlObj.pathname.split('/o/')[1]?.split('?')[0];

      if (!path) {
        throw new Error('Invalid storage URL');
      }

      const decodedPath = decodeURIComponent(path);
      const storageRef = ref(storage, decodedPath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw - failing to delete an image shouldn't block other operations
    }
  };

  return {
    uploadImage,
    deleteImage,
  };
}
