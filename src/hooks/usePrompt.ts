import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { DEFAULT_PROMPT } from '@/lib/openai';

const PROMPT_DOC_ID = 'vision_prompt';
const SETTINGS_COLLECTION = 'settings';

export function usePrompt() {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [loading, setLoading] = useState(true);

  /** 從 Firestore 讀取 prompt */
  const loadPrompt = async () => {
    const db = getDb();
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, SETTINGS_COLLECTION, PROMPT_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.content) {
          setPrompt(data.content);
        }
      }
    } catch (error) {
      console.error('讀取 prompt 失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  /** 儲存 prompt 到 Firestore */
  const savePrompt = async (newPrompt: string) => {
    const db = getDb();
    if (!db) throw new Error('Firebase not initialized');

    try {
      const docRef = doc(db, SETTINGS_COLLECTION, PROMPT_DOC_ID);
      await setDoc(docRef, {
        content: newPrompt,
        updatedAt: new Date(),
      });
      setPrompt(newPrompt);
    } catch (error) {
      console.error('儲存 prompt 失敗:', error);
      throw error;
    }
  };

  /** 重設為預設 prompt */
  const resetPrompt = async () => {
    await savePrompt(DEFAULT_PROMPT);
  };

  useEffect(() => {
    loadPrompt();
  }, []);

  return {
    prompt,
    loading,
    savePrompt,
    resetPrompt,
  };
}
