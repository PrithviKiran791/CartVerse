import React from 'react';
import {
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ActionBarPrimitive,
  ErrorPrimitive,
  AuiIf,
  useAui,
} from '@assistant-ui/react';
import { MarkdownText } from '../assistant-ui/elements/markdown-text';
import {
  ArrowUp,
  Square,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  ArrowDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AssistantEmptyState } from './assistant-empty-state';
import { useAssistantContext } from '../../hooks/useAssistantContext';
import { useAssistantStore } from '../../store/useAssistantStore';
import chatbotIcon from '../../assets/icons/chatbot.png';

export const CartVerseThread: React.FC = () => {
  const { contextualSuggestions } = useAssistantContext();
  const { queuedPrompt, setQueuedPrompt } = useAssistantStore();
  const aui = useAui();

  React.useEffect(() => {
    if (queuedPrompt) {
      aui.composer.setText(queuedPrompt);
      aui.composer.send();
      setQueuedPrompt(null);
    }
  }, [queuedPrompt, setQueuedPrompt, aui]);

  return (
    <ThreadPrimitive.Root className="flex flex-col h-full bg-white dark:bg-[#101012] font-sans text-neutral-900 dark:text-neutral-100 overflow-hidden">
      {/* Scrollable conversation thread */}
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
        <ThreadPrimitive.Empty>
          <AssistantEmptyState
            suggestions={contextualSuggestions}
            onSelectPrompt={(prompt) => {
              aui.composer.setText(prompt);
              aui.composer.send();
            }}
          />
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessageItem,
            AssistantMessage: AssistantMessageItem,
          }}
        />
      </ThreadPrimitive.Viewport>

      {/* Fixed Composer Footer */}
      <div className="p-3 border-t-2 border-neutral-900 dark:border-neutral-800 bg-neutral-100 dark:bg-[#121215]">
        <ComposerPrimitive.Root className="flex items-end gap-2 bg-white dark:bg-[#18181C] border-2 border-neutral-900 dark:border-neutral-700 rounded-none p-2 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D] focus-within:border-[#FF1E2D] focus-within:shadow-[4px_4px_0px_0px_#FF1E2D] transition-all">
          <ComposerPrimitive.Input
            placeholder="Ask about PC parts, comparisons, compatibility, or builds..."
            className="flex-1 max-h-32 min-h-[38px] resize-none bg-transparent text-xs font-mono text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden leading-relaxed py-1 px-1"
            rows={1}
            autoFocus
          />

          <AuiIf condition={(s) => !s.thread.isRunning}>
            <ComposerPrimitive.Send asChild>
              <button
                type="submit"
                aria-label="Send message"
                className="p-2 rounded-none bg-[#FF1E2D] hover:bg-[#FF3B48] text-white border-2 border-neutral-900 dark:border-neutral-700 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </ComposerPrimitive.Send>
          </AuiIf>

          <AuiIf condition={(s) => s.thread.isRunning}>
            <ComposerPrimitive.Cancel asChild>
              <button
                type="button"
                aria-label="Stop generating"
                className="p-2 rounded-none bg-neutral-900 text-white hover:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#FF1E2D] transition-all shrink-0 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </ComposerPrimitive.Cancel>
          </AuiIf>
        </ComposerPrimitive.Root>

        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase tracking-wider mt-1.5 px-0.5">
          <span>SYS // CARTVERSE_COPILOT</span>
          <span>STATUS: ONLINE</span>
        </div>
      </div>
    </ThreadPrimitive.Root>
  );
};

// User Message Component
const UserMessageItem: React.FC = () => {
  return (
    <MessagePrimitive.Root className="flex flex-col items-end gap-1 my-3">
      <div className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
        // USER_QUERY
      </div>
      <div className="max-w-[85%] rounded-none border-2 border-neutral-900 dark:border-white px-3.5 py-2.5 bg-[#FF1E2D] text-white text-xs font-mono font-medium shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] leading-relaxed whitespace-pre-wrap">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
};

// In-progress pulse dots shown while assistant is preparing response
const AssistantLoadingDots: React.FC = () => (
  <div className="flex items-center gap-1.5 py-1 text-neutral-400 font-mono text-[10px]" aria-label="Thinking...">
    <span className="w-2 h-2 bg-[#FF1E2D] border border-black animate-bounce [animation-delay:-0.3s]" />
    <span className="w-2 h-2 bg-[#FF1E2D] border border-black animate-bounce [animation-delay:-0.15s]" />
    <span className="w-2 h-2 bg-[#FF1E2D] border border-black animate-bounce" />
    <span className="ml-1 text-neutral-500 uppercase">PROCESSING...</span>
  </div>
);

// Assistant Message Component
const AssistantMessageItem: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  return (
    <MessagePrimitive.Root className="flex gap-3 my-3 text-xs leading-relaxed group">
      {/* Assistant Avatar */}
      <div className="w-7 h-7 rounded-none bg-white dark:bg-[#18181C] border-2 border-neutral-900 dark:border-neutral-700 shadow-[2px_2px_0px_0px_#FF1E2D] flex items-center justify-center shrink-0 mt-0.5 p-1">
        <img
          src={chatbotIcon}
          alt="AI Assistant"
          className="w-3.5 h-3.5 object-contain dark:brightness-0 dark:invert"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="font-mono text-[9px] text-[#FF1E2D] uppercase tracking-wider font-bold">
          // COPILOT_RESPONSE
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-xs text-neutral-900 dark:text-neutral-200 leading-relaxed font-sans">
          <MessagePrimitive.Content
            components={{
              Empty: AssistantLoadingDots,
              Text: MarkdownText,
            }}
          />
          <MessagePrimitive.Error>
            <ErrorPrimitive.Root className="mt-2 rounded-none border-2 border-red-600 bg-red-500/10 p-2.5 text-xs font-mono text-red-700 dark:text-red-300 shadow-[2px_2px_0px_0px_#FF1E2D]">
              <ErrorPrimitive.Message className="font-bold" />
            </ErrorPrimitive.Root>
          </MessagePrimitive.Error>
        </div>

        {/* Action bar (Copy, Reload) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-neutral-400 text-[10px] font-mono pt-1">
          <ActionBarPrimitive.Copy asChild>
            <button
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              title="Copy message"
              className="px-2 py-0.5 rounded-none border border-neutral-400 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-300 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1 shadow-[1px_1px_0px_0px_#000000] dark:shadow-[1px_1px_0px_0px_#FF1E2D] cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </ActionBarPrimitive.Copy>

          <ActionBarPrimitive.Reload asChild>
            <button
              title="Regenerate response"
              className="px-2 py-0.5 rounded-none border border-neutral-400 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-300 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1 shadow-[1px_1px_0px_0px_#000000] dark:shadow-[1px_1px_0px_0px_#FF1E2D] cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <RefreshCw className="w-3 h-3" />
              <span>RETRY</span>
            </button>
          </ActionBarPrimitive.Reload>
        </div>
      </div>
    </MessagePrimitive.Root>
  );
};
