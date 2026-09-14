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
        className={`group relative flex items-center justify-center p-3.5 sm:px-4 sm:py-3 rounded-full font-medium transition-all duration-300 shadow-xl active:scale-95 ${
          isOpen
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border border-neutral-700 dark:border-neutral-300'
            : 'bg-[#FF1E2D] hover:bg-[#FF3B48] text-white shadow-red-500/20 hover:shadow-red-500/35 border border-red-500/30'
        }`}
      >
        {/* Glow halo */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-red-600/30 opacity-75 blur-sm animate-pulse group-hover:opacity-100 transition-opacity" />
        )}

        <div className="relative flex items-center gap-2">
          {isOpen ? (
            <X className="w-5 h-5 transition-transform group-hover:scale-110" />
          ) : (
            <img
              src={chatbotIcon}
              alt="CartVerse AI Assistant"
              className="w-5 h-5 object-contain brightness-0 invert transition-transform group-hover:scale-110 drop-shadow-sm"
            />
          )}

          <span className="hidden sm:inline-block text-xs font-bold tracking-wide uppercase">
            {isOpen ? 'Close Assistant' : 'PC Build Assistant'}
          </span>
        </div>
      </button>
    </div>
  );
};
