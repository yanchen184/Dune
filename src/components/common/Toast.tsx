import { motion, AnimatePresence } from 'framer-motion';
import { Toast as ToastType } from '@/lib/types';
import { useToast } from '@/hooks/useToast';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastType; onDismiss: () => void }) {
  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  return (
    <motion.div
      className={`${bgColors[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      onClick={onDismiss}
    >
      <p className="font-rajdhani">{toast.message}</p>
    </motion.div>
  );
}

export default Toast;
