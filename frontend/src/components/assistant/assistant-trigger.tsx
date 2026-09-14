import React from 'react';
import { X } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import chatbotIcon from '../../assets/icons/chatbot.png';

export const AssistantTrigger: React.FC = () => {
  const { isOpen, toggleAssistant } = useAssistantStore();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      <button
        onClick={toggleAssistant}
        aria-label={isOpen ? 'Close CartVerse Assistant' : 'Open CartVerse Assistant'}
        aria-expanded={isOpen}
        className={`group relative flex items-center justify-center p-3.5 sm:px-4 sm:py-3 font-mono font-bold tracking-wider uppercase text-xs transition-all duration-150 border-2 rounded-none sm:rounded-md active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ${
          isOpen
            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-[4px_4px_0px_0px_#FF1E2D] dark:shadow-[4px_4px_0px_0px_#FF1E2D]'
            : 'bg-[#FF1E2D] hover:bg-[#FF3B48] text-white border-neutral-950 dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FFFFFF]'
        }`}
      >
        <div className="relative flex items-center gap-2">
          {isOpen ? (
            <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
          ) : (
            <img
              src={chatbotIcon}
              alt="CartVerse AI Assistant"
              className="w-4 h-4 object-contain brightness-0 invert transition-transform group-hover:scale-110"
            />
          )}

          <span className="hidden sm:inline-block">
            {isOpen ? 'Close Copilot' : 'Hardware Copilot'}
          </span>
          <span className="w-2 h-2 bg-emerald-400 border border-neutral-900 animate-pulse ml-0.5" />
        </div>
      </button>
    </div>
  );
};
