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
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-400 uppercase tracking-wider px-1">
        <Sparkles className="w-3 h-3 text-[#FF1E2D]" />
        Contextual Recommendations
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {suggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="group flex items-center justify-between text-left px-3 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 hover:border-[#FF1E2D]/50 dark:hover:border-[#FF1E2D]/50 hover:bg-red-50/30 dark:hover:bg-red-950/20 text-neutral-700 dark:text-neutral-300 transition-all duration-150"
          >
            <span className="line-clamp-2 leading-relaxed">{prompt}</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FF1E2D] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
};
