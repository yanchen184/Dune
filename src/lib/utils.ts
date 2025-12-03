import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import clsx, { ClassValue } from 'clsx';

/**
 * Merge className strings
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Convert File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/xxx;base64, prefix
      const base64 = result.split(',')[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Format Firestore Timestamp to readable string
 */
export function formatTimestamp(timestamp: Timestamp): string {
  return format(timestamp.toDate(), 'yyyy-MM-dd HH:mm');
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Generate unique filename for image
 */
export function generateImageFilename(gameNumber: number): string {
  const timestamp = Date.now();
  return `game-${gameNumber}-${timestamp}.webp`;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File, maxSize: number): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.floor(maxSize / 1024 / 1024)}MB limit`,
    };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File must be JPEG, PNG, or WebP format',
    };
  }

  return { valid: true };
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
