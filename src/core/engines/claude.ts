import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import type { PipelineInput } from '../types.js';
import { buildClaudeContentPrompt } from '../prompts/claudeContent.js';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

if (!anthropicApiKey) {
  throw new Error(
    'ANTHROPIC_API_KEY manquante. Définis-la dans tes variables d\'environnement ou dans un fichier .env à la racine de prompt-site-generator.'
  );
}

const anthropic = new Anthropic({
  apiKey: anthropicApiKey
});

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateRawTextWithClaude(input: PipelineInput): Promise<string> {
  const prompt = buildClaudeContentPrompt(input);

  const maxRetries = 3;
  const baseDelayMs = 1500;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const first = response.content?.[0];
      const text = first && first.type === 'text' ? first.text : '';

      if (!text) {
        throw new Error('Réponse vide de Claude');
      }

      return text.trim();
    } catch (err: any) {
      lastError = err;
      const status = err?.status as number | undefined;
      const shouldRetryHeader = err?.headers && err.headers['x-should-retry'];
      const isOverloaded = status === 529 || shouldRetryHeader === 'true';
      const isServerError = typeof status === 'number' && status >= 500 && status < 600;

      const canRetry = isOverloaded || isServerError;
      const isLastAttempt = attempt === maxRetries;

      if (!canRetry || isLastAttempt) {
        throw err;
      }

      const delay = baseDelayMs * attempt;
      await sleep(delay);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Erreur inconnue lors de l’appel à Claude');
}
