import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'success':
        return {
          variant: 'success' as const,
          icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
        };
      case 'warning':
        return {
          variant: 'warning' as const,
          icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
        };
      case 'error':
        return {
          variant: 'destructive' as const,
          icon: <AlertCircle className="w-4 h-4 shrink-0" />,
        };
      default:
        return {
          variant: 'info' as const,
          icon: <Info className="w-4 h-4 shrink-0" />,
        };
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full font-mono">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { variant, icon } = getAlertConfig(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-auto"
            >
              <Alert
                variant={variant}
                className="relative pr-8 shadow-[5px_5px_0px_0px_#000000] dark:shadow-[5px_5px_0px_0px_#FF1E2D]"
              >
                {icon}
                <div className="col-start-2 flex flex-col gap-0.5 min-w-0">
                  <AlertTitle className="font-mono text-xs uppercase tracking-wider">
                    {toast.title}
                  </AlertTitle>
                  <AlertDescription className="font-mono text-xs leading-snug">
                    {toast.message}
                  </AlertDescription>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-2.5 right-2.5 p-1 text-current opacity-70 hover:opacity-100 transition-opacity cursor-pointer active:scale-90"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Alert>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

