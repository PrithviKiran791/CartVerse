import { useUIStore } from './useUIStore';

export interface ToastMethods {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const toastMethods: ToastMethods = {
  success: (message: string, title: string = 'Success') => {
    useUIStore.getState().addToast({ type: 'success', title, message });
  },
  error: (message: string, title: string = 'Error') => {
    useUIStore.getState().addToast({ type: 'error', title, message });
  },
  warning: (message: string, title: string = 'Warning') => {
    useUIStore.getState().addToast({ type: 'warning', title, message });
  },
  info: (message: string, title: string = 'Notice') => {
    useUIStore.getState().addToast({ type: 'info', title, message });
  },
};

/**
 * Universal Toast Store:
 * Supports both hook syntax `const toast = useToastStore()`
 * and static calls `useToastStore.success()` or `useToastStore.getState().success()`
 */
export function useToastStore(): ToastMethods {
  return toastMethods;
}

// Attach static methods & getState() to the function object
useToastStore.getState = () => toastMethods;
useToastStore.success = toastMethods.success;
useToastStore.error = toastMethods.error;
useToastStore.warning = toastMethods.warning;
useToastStore.info = toastMethods.info;

export default useToastStore;
