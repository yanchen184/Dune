import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface PromptEditModalProps {
  isOpen: boolean;
  prompt: string;
  onClose: () => void;
  onSave: (prompt: string) => Promise<void>;
  onReset: () => Promise<void>;
}

export default function PromptEditModal({
  isOpen,
  prompt,
  onClose,
  onSave,
  onReset,
}: PromptEditModalProps) {
  const [editValue, setEditValue] = useState(prompt);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditValue(prompt);
  }, [prompt]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editValue);
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('確定要重設為預設提示詞嗎？')) return;
    setSaving(true);
    try {
      await onReset();
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-dune-deep border-2 border-dune-spice rounded-lg p-6 max-w-3xl w-full max-h-[90vh] flex flex-col">
              <h2 className="text-2xl font-orbitron font-bold text-dune-spice mb-2">
                AI 辨識提示詞
              </h2>
              <p className="text-dune-sand/70 font-rajdhani mb-4 text-sm">
                修改後會影響所有圖片辨識的結果。告訴 AI 你的玩家名稱、常見錯誤等。
              </p>

              <textarea
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                className="flex-1 min-h-[300px] bg-dune-sky/30 border border-dune-sand/30 rounded-lg p-4 text-dune-sand font-rajdhani text-sm focus:border-dune-spice focus:outline-none resize-none font-mono leading-relaxed"
                disabled={saving}
              />

              <div className="flex gap-3 mt-4 pt-4 border-t border-dune-sand/20">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? '儲存中...' : '儲存'}
                </Button>
                <Button variant="secondary" onClick={handleReset} disabled={saving}>
                  重設為預設
                </Button>
                <Button variant="secondary" onClick={onClose} disabled={saving}>
                  取消
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
