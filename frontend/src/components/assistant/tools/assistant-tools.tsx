import { makeAssistantToolUI } from '@assistant-ui/react';
import { AssistantToolResult } from '../assistant-tool-result';

export const SearchProductsTool = makeAssistantToolUI({
  toolName: 'searchProducts',
  render: ({ result }) => {
    return <AssistantToolResult toolName="searchProducts" result={result} />;
  },
});

export const GetProductTool = makeAssistantToolUI({
  toolName: 'getProduct',
  render: ({ result }) => {
    return <AssistantToolResult toolName="getProduct" result={result} />;
  },
});

export const CompareProductsTool = makeAssistantToolUI({
  toolName: 'compareProducts',
  render: ({ result }) => {
    return <AssistantToolResult toolName="compareProducts" result={result} />;
  },
});

export const CheckCompatibilityTool = makeAssistantToolUI({
  toolName: 'checkCompatibility',
  render: ({ result }) => {
    return <AssistantToolResult toolName="checkCompatibility" result={result} />;
  },
});

export const GetCartTool = makeAssistantToolUI({
  toolName: 'getCart',
  render: ({ result }) => {
    return <AssistantToolResult toolName="getCart" result={result} />;
  },
});

export const GetBuildTool = makeAssistantToolUI({
  toolName: 'getBuild',
  render: ({ result }) => {
    return <AssistantToolResult toolName="getBuild" result={result} />;
  },
});
