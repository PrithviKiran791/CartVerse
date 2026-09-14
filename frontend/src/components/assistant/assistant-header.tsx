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
    <div className="flex items-center justify-between px-4 py-3 border-b-2 border-neutral-900 dark:border-neutral-800 bg-neutral-100 dark:bg-[#121214]">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-none bg-red-600/15 dark:bg-red-500/20 border-2 border-neutral-900 dark:border-[#FF1E2D] shadow-[2px_2px_0px_0px_#FF1E2D] flex items-center justify-center p-1.5">
          <img
            src={chatbotIcon}
            alt="CartVerse Assistant"
            className="w-full h-full object-contain dark:brightness-0 dark:invert"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100 leading-none">
              CartVerse Assistant
            </h2>
            <span className="font-mono text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-[#FF1E2D]/15 text-[#FF1E2D] border border-[#FF1E2D]/60 rounded-none">
              SYS.ONLINE
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {onNewChat && (
          <button
            onClick={onNewChat}
            title="Start new conversation"
            className="p-1.5 text-neutral-800 hover:text-white dark:text-neutral-300 dark:hover:text-white hover:bg-[#FF1E2D] dark:hover:bg-[#FF1E2D] border border-neutral-900 dark:border-neutral-700 rounded-none shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FF1E2D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={closeAssistant}
          title="Close assistant"
          aria-label="Close assistant"
          className="p-1.5 text-neutral-800 hover:text-white dark:text-neutral-300 dark:hover:text-white hover:bg-[#FF1E2D] dark:hover:bg-[#FF1E2D] border border-neutral-900 dark:border-neutral-700 rounded-none shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FF1E2D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
