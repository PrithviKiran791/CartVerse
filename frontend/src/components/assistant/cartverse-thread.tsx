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
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#141417]/80 backdrop-blur-md">
        <ComposerPrimitive.Root className="flex items-end gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 focus-within:border-[#FF1E2D] focus-within:ring-1 focus-within:ring-[#FF1E2D]/30 transition-all shadow-xs">
          <ComposerPrimitive.Input
            placeholder="Ask about PC parts, comparisons, compatibility, or builds..."
            className="flex-1 max-h-32 min-h-[38px] resize-none bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden leading-relaxed py-1 px-1"
            rows={1}
            autoFocus
          />

          <AuiIf condition={(s) => !s.thread.isRunning}>
            <ComposerPrimitive.Send asChild>
              <button
                type="submit"
                aria-label="Send message"
                className="p-2 rounded-lg bg-[#FF1E2D] hover:bg-[#FF3B48] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0 active:scale-95 shadow-xs cursor-pointer"
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
                className="p-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors shrink-0 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </ComposerPrimitive.Cancel>
          </AuiIf>
        </ComposerPrimitive.Root>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1.5 px-1">
          <span>CartVerse AI Hardware Copilot</span>
          <span>Inter Tight</span>
        </div>
      </div>
    </ThreadPrimitive.Root>
  );
};

// User Message Component
const UserMessageItem: React.FC = () => {
  return (
    <MessagePrimitive.Root className="flex justify-end gap-2 my-2.5">
      <div className="max-w-[85%] rounded-2xl rounded-br-xs px-3.5 py-2.5 bg-[#FF1E2D] text-white text-xs font-medium shadow-sm leading-relaxed whitespace-pre-wrap">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
};

// In-progress pulse dots shown while assistant is preparing response
const AssistantLoadingDots: React.FC = () => (
  <div className="flex items-center gap-1.5 py-1 text-neutral-400" aria-label="Thinking...">
    <span className="w-1.5 h-1.5 bg-[#FF1E2D] rounded-full animate-bounce [animation-delay:-0.3s]" />
    <span className="w-1.5 h-1.5 bg-[#FF1E2D] rounded-full animate-bounce [animation-delay:-0.15s]" />
    <span className="w-1.5 h-1.5 bg-[#FF1E2D] rounded-full animate-bounce" />
  </div>
);

// Assistant Message Component
const AssistantMessageItem: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  return (
    <MessagePrimitive.Root className="flex gap-3 my-3 text-xs leading-relaxed group">
      {/* Assistant Avatar */}
      <div className="w-7 h-7 rounded-lg bg-red-600/10 dark:bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5 p-1">
        <img
          src={chatbotIcon}
          alt="AI Assistant"
          className="w-3.5 h-3.5 object-contain dark:brightness-0 dark:invert"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="prose prose-neutral dark:prose-invert max-w-none text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
          <MessagePrimitive.Content
            components={{
              Empty: AssistantLoadingDots,
              Text: MarkdownText,
            }}
          />
          <MessagePrimitive.Error>
            <ErrorPrimitive.Root className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-700 dark:text-red-300">
              <ErrorPrimitive.Message className="font-medium" />
            </ErrorPrimitive.Root>
          </MessagePrimitive.Error>
        </div>

        {/* Action bar (Copy, Reload) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-neutral-400 text-[11px] pt-0.5">
          <ActionBarPrimitive.Copy asChild>
            <button
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              title="Copy message"
              className="p-1 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 text-[10px]"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </ActionBarPrimitive.Copy>

          <ActionBarPrimitive.Reload asChild>
            <button
              title="Regenerate response"
              className="p-1 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 text-[10px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </ActionBarPrimitive.Reload>
        </div>
      </div>
    </MessagePrimitive.Root>
  );
};
