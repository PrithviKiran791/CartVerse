import { useUIStore } from './useUIStore';

export const useToastStore = {
  getState: () => ({
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
  }),
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

export default useToastStore;
