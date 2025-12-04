import { useState, useCallback } from 'react';
import { Toast, ToastType } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { TOAST_DURATION } from '@/lib/constants';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = generateId();
    const toast: Toast = { id, message, type };

    setToasts(prev => [...prev, toast]);

    // Auto-dismiss after TOAST_DURATION
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
