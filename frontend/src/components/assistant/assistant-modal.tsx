import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartVerseThread } from './cartverse-thread';
import { Send, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useAssistantStore } from '../../store/useAssistantStore';
import { useAssistantContext } from '../../hooks/useAssistantContext';
import { AssistantHeader } from './assistant-header';
import { AssistantEmptyState } from './assistant-empty-state';
import {
  SearchProductsTool,
  GetProductTool,
  CompareProductsTool,
  CheckCompatibilityTool,
  GetCartTool,
  GetBuildTool,
} from './tools/assistant-tools';

export const AssistantModal: React.FC = () => {
  const { isOpen, closeAssistant, queuedPrompt, setQueuedPrompt } = useAssistantStore();
  const { contextualSuggestions } = useAssistantContext();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAssistant]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAssistant}
            className="fixed inset-0 bg-black/50 z-40 sm:hidden backdrop-blur-xs"
          />

          {/* Assistant window with Technical Brutalism Effect */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-label="CartVerse Assistant"
            className="fixed bottom-0 right-0 sm:bottom-20 sm:right-6 z-50 w-full sm:w-[450px] h-[92vh] sm:h-[680px] sm:max-h-[85vh] bg-white dark:bg-[#0E0E10] border-2 border-neutral-900 dark:border-neutral-700 rounded-none sm:rounded-md shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#FF1E2D] flex flex-col overflow-hidden font-sans"
          >
            {/* Registered tool UIs */}
            <SearchProductsTool />
            <GetProductTool />
            <CompareProductsTool />
            <CheckCompatibilityTool />
            <GetCartTool />
            <GetBuildTool />

            {/* Custom Header */}
            <AssistantHeader />

            {/* Main Thread Body */}
            <div className="flex-1 min-h-0 relative flex flex-col">
              <CartVerseThread />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
