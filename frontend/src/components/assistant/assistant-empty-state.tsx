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
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF1E2D]/20 to-red-500/5 border border-[#FF1E2D]/30 flex items-center justify-center shadow-lg shadow-red-500/10 p-3">
        <img
          src={chatbotIcon}
          alt="CartVerse AI Assistant"
          className="w-full h-full object-contain dark:brightness-0 dark:invert"
        />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
          How can I help you build your PC?
        </h3>
        <p className="text-xs text-neutral-700 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
          I can help you discover parts, check compatibility, compare hardware, and plan complete builds for your budget.
        </p>
      </div>

      <div className="w-full text-left pt-2">
        <AssistantSuggestions suggestions={suggestions} onSelectPrompt={onSelectPrompt} />
      </div>
    </div>
  );
};
