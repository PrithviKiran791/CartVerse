import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AssistantSuggestionsProps {
  suggestions: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const AssistantSuggestions: React.FC<AssistantSuggestionsProps> = ({
  suggestions,
  onSelectPrompt,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider px-1">
        <Sparkles className="w-3 h-3 text-[#FF1E2D]" />
        PROMPT_SUGGESTIONS
      </div>
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="group flex items-center justify-between text-left px-3 py-2 text-xs rounded-none border-2 border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#151518] shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FF1E2D] hover:translate-x-[1px] hover:translate-y-[1px] text-neutral-800 dark:text-neutral-200 transition-all font-mono active:shadow-none cursor-pointer"
          >
            <span className="line-clamp-2 leading-relaxed text-[11px] font-medium">{prompt}</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FF1E2D] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
};
