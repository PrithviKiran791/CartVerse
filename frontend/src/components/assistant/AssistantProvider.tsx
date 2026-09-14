import React, { createContext, useContext, useMemo } from 'react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useChatRuntime, AssistantChatTransport } from '@assistant-ui/ai-sdk';
import { useAssistantContext } from '../../hooks/useAssistantContext';
import { useCartStore } from '../../store/useCartStore';
import { usePCBuilderStore } from '../../store/usePCBuilderStore';
import { mockProducts } from '../../data/mockProducts';
import { validateBuild } from '../../utils/compatibilityEngine';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pageContext = useAssistantContext();
  const cartStore = useCartStore();
  const builderStore = usePCBuilderStore();

  // Create runtime with tools and system context
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: `${BASE_URL}/chat`,
      body: {
        system: `CURRENT APPLICATION CONTEXT:
- Active Route: ${pageContext.pathname} (Page Type: ${pageContext.pageType})
- Cart Contents: ${pageContext.cartSummary.itemCount} items, Subtotal ₹${pageContext.cartSummary.subtotal}. Items: ${JSON.stringify(pageContext.cartSummary.itemsBrief)}
- PC Builder Rig: ${pageContext.builderSummary.filledSlotsCount} parts selected. Est. Wattage: ${pageContext.builderSummary.estimatedWattage}W. Parts: ${JSON.stringify(pageContext.builderSummary.componentsBrief)}
- Compatibility Status: ${pageContext.builderSummary.isCompatible ? 'COMPATIBLE' : 'WARNINGS/ISSUES DETECTED'} (${pageContext.builderSummary.issuesCount} issues)
- User: ${pageContext.authStatus.userName} (Authenticated: ${pageContext.authStatus.isAuthenticated})`,
      },
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
};
