import { create } from 'zustand';

interface AssistantStore {
  isOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  queuedPrompt: string | null;
  setQueuedPrompt: (prompt: string | null) => void;
}

export const useAssistantStore = create<AssistantStore>((set) => ({
  isOpen: false,
  openAssistant: () => set({ isOpen: true }),
  closeAssistant: () => set({ isOpen: false }),
  toggleAssistant: () => set((state) => ({ isOpen: !state.isOpen })),
  queuedPrompt: null,
  setQueuedPrompt: (prompt) => set({ queuedPrompt: prompt }),
}));
