import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface UIStore {
  globalSearch: string;
  isSearchOpen: boolean;
  toasts: ToastMessage[];

  // Actions
  setGlobalSearch: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  globalSearch: '',
  isSearchOpen: false,
  toasts: [],

  setGlobalSearch: (query: string) => set({ globalSearch: query }),
  setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
