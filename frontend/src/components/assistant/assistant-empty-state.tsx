import React from 'react';
import { AssistantSuggestions } from './assistant-suggestions';
import chatbotIcon from '../../assets/icons/chatbot.png';

interface AssistantEmptyStateProps {
  suggestions: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const AssistantEmptyState: React.FC<AssistantEmptyStateProps> = ({
  suggestions,
  onSelectPrompt,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-full max-w-md mx-auto space-y-5">
      <div className="w-14 h-14 rounded-none bg-white dark:bg-[#151518] border-2 border-neutral-900 dark:border-neutral-700 flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] p-3">
        <img
          src={chatbotIcon}
          alt="CartVerse AI Assistant"
          className="w-full h-full object-contain dark:brightness-0 dark:invert"
        />
      </div>

      <div className="space-y-1.5">
        <div className="font-mono text-[10px] text-[#FF1E2D] tracking-wider uppercase font-bold">
          // SYS.READY // HARDWARE_COPILOT
        </div>
        <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight uppercase font-mono">
          How can I help you build your PC?
        </h3>
        <p className="text-xs text-neutral-700 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
          Discover parts, check socket & wattage compatibility, compare benchmarks, and engineer complete builds.
        </p>
      </div>

      <div className="w-full text-left pt-2">
        <AssistantSuggestions suggestions={suggestions} onSelectPrompt={onSelectPrompt} />
      </div>
    </div>
  );
};
