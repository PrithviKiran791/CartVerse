import { createOpenAI } from '@ai-sdk/openai';
import { frontendTools } from '@assistant-ui/ai-sdk';
import { convertToModelMessages, streamText } from 'ai';
import { CARTVERSE_SYSTEM_PROMPT } from '../config/systemPrompt.js';

export const handleChat = async (req, res) => {
  try {
    const { messages, system, tools } = req.body;

    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.GEMINI_API_KEY;

    if (
      !apiKey ||
      apiKey === 'your_openai_api_key_here' ||
      apiKey === 'your_openrouter_api_key_here'
    ) {
      return res.status(503).json({
        error: 'AI Assistant API key is not configured on the server. Please check your backend .env file.',
      });
    }

    const isExternalOpenRouter =
      apiKey.startsWith('sk-or-') ||
      Boolean(process.env.OPENROUTER_API_KEY);

    const baseURL =
      process.env.AI_BASE_URL ||
      (isExternalOpenRouter ? 'https://openrouter.ai/api/v1' : undefined);

    const candidateModels = [];
    const envModel = process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL;
    if (envModel) candidateModels.push(envModel);
    if (isExternalOpenRouter) {
      if (!candidateModels.includes('google/gemma-4-26b-a4b-it:free')) candidateModels.push('google/gemma-4-26b-a4b-it:free');
      if (!candidateModels.includes('google/gemma-4-31b-it:free')) candidateModels.push('google/gemma-4-31b-it:free');
      if (!candidateModels.includes('openrouter/free')) candidateModels.push('openrouter/free');
    } else {
      if (!candidateModels.includes('gpt-4o')) candidateModels.push('gpt-4o');
    }

    const provider = createOpenAI({
      apiKey,
      baseURL,
      headers: isExternalOpenRouter
        ? {
            'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
            'X-Title': 'CartVerse PC Hardware',
          }
        : undefined,
    });

    const configuredTools =
      tools && typeof tools === 'object' && Object.keys(tools).length > 0
        ? frontendTools(tools)
        : undefined;

    // Normalize messages so convertToModelMessages always succeeds
    const normalizedMessages = (messages || []).map((m) => {
      if (m.parts && Array.isArray(m.parts)) return m;
      return {
        ...m,
        parts: [{ type: 'text', text: typeof m.content === 'string' ? m.content : '' }],
      };
    });

    const modelMessages = await convertToModelMessages(normalizedMessages);

    let successfulStream = null;
    let lastError = null;

    for (const candidate of candidateModels) {
      try {
        console.log(`[ChatController] Connecting to model: ${candidate}`);
        const result = streamText({
          model: provider.chat(candidate),
          system: system ? `${CARTVERSE_SYSTEM_PROMPT}\n\n${system}` : CARTVERSE_SYSTEM_PROMPT,
          messages: modelMessages,
          tools: configuredTools,
          maxRetries: 0,
        });

        const response = result.toUIMessageStreamResponse();
        const reader = response.body.getReader();
        const bufferedChunks = [];
        let hasError = false;

        // Read until we see text-start / text-delta or an error
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bufferedChunks.push(value);
          const chunkStr = Buffer.from(value).toString('utf-8');
          if (chunkStr.includes('error')) {
            console.warn(`[ChatController] Model ${candidate} returned error chunk:`, chunkStr.slice(0, 120));
            hasError = true;
            break;
          }
          if (chunkStr.includes('text-start') || chunkStr.includes('text-delta')) {
            console.log(`[ChatController] Model ${candidate} started text stream successfully`);
            break;
          }
        }

        if (hasError) {
          continue;
        }

        successfulStream = { response, reader, bufferedChunks, model: candidate };
        break;
      } catch (candidateErr) {
        console.warn(`[ChatController] Model ${candidate} threw error: ${candidateErr.message}`);
        lastError = candidateErr;
      }
    }

    if (!successfulStream) {
      throw lastError || new Error('All candidate AI models were busy or rate-limited. Please try again shortly.');
    }

    const { response, reader, bufferedChunks } = successfulStream;

    // Forward headers from UIMessageStreamResponse
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(response.status);

    // Write all pre-buffered chunks
    for (const chunk of bufferedChunks) {
      res.write(Buffer.from(chunk));
    }

    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          res.write(Buffer.from(value));
        }
      } catch (err) {
        console.error('[ChatController Stream Error mid-stream]', err);
        try {
          const errPayload = JSON.stringify({
            type: 'text-delta',
            id: 'err-note',
            delta: '\n\n*(Stream disconnected. Please try asking again.)*',
          });
          res.write(`data: ${errPayload}\n\n`);
        } catch (_) {}
        res.end();
      }
    };
    await pump();
  } catch (error) {
    console.error('[ChatController Error]', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: error?.message || 'Failed to process chat message. Please try again.',
      });
    } else {
      res.end();
    }
  }
};
