import { type FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/animations';
import { useUIStore, type Toast as ToastType, type ToastType as ToastVariant } from '@/stores';

const DEFAULT_DURATION = 5000;

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
};

const progressBarStyles: Record<ToastVariant, string> = {
  success: 'bg-green-500 dark:bg-green-400',
  error: 'bg-red-500 dark:bg-red-400',
  warning: 'bg-yellow-500 dark:bg-yellow-400',
  info: 'bg-blue-500 dark:bg-blue-400',
};

const iconMap: Record<ToastVariant, FC<{ className?: string }>> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Warianty animacji dla toast
const toastVariants = {
  initial: { opacity: 0, x: 100, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 100, scale: 0.95 },
};

const toastTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const, // easeOut bezier curve
};

interface ToastItemProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const ToastItem: FC<ToastItemProps> = ({ toast, onClose }) => {
  const Icon = iconMap[toast.type];
  const duration = toast.duration ?? DEFAULT_DURATION;
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (duration <= 0) return;

    const startTime = Date.now();
    let animationFrame: number;

    const updateProgress = () => {
      if (isPaused) {
        animationFrame = requestAnimationFrame(updateProgress);
        return;
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, isPaused]);

  return (
    <motion.div
      layout
      variants={reducedMotion ? undefined : toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={toastTransition}
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4 shadow-lg overflow-hidden',
        variantStyles[toast.type]
      )}
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.message && (
          <p className="text-sm opacity-90">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-opacity"
        aria-label="Zamknij powiadomienie"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
          <motion.div
            className={cn('h-full', progressBarStyles[toast.type])}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
};

export const ToastContainer: FC = () => {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-label="Powiadomienia"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

ToastContainer.displayName = 'ToastContainer';

// Helper hook for using toasts
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast);
  const removeToast = useUIStore((state) => state.removeToast);

  return {
    toast: addToast,
    dismiss: removeToast,
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message }),
  };
};
