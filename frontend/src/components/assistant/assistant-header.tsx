import React from 'react';
import { X, PlusCircle } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import chatbotIcon from '../../assets/icons/chatbot.png';

interface AssistantHeaderProps {
  onNewChat?: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({ onNewChat }) => {
  const { closeAssistant } = useAssistantStore();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-red-600/10 dark:bg-red-500/20 border border-red-500/30 flex items-center justify-center p-1.5">
          <img
            src={chatbotIcon}
            alt="CartVerse Assistant"
            className="w-full h-full object-contain dark:brightness-0 dark:invert"
          />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 leading-none">
            CartVerse Assistant
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onNewChat && (
          <button
            onClick={onNewChat}
            title="Start new conversation"
            className="p-1.5 text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={closeAssistant}
          title="Close assistant"
          aria-label="Close assistant"
          className="p-1.5 text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
