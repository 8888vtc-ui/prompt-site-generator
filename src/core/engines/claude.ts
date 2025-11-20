import Anthropic from '@anthropic-ai/sdk';
import type { PipelineInput } from '../types.js';
import { buildClaudeContentPrompt } from '../prompts/claudeContent.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

export async function generateRawTextWithClaude(input: PipelineInput): Promise<string> {
  const prompt = buildClaudeContentPrompt(input);

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
}
