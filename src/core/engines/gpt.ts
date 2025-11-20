import OpenAI from 'openai';
import type { PipelineInput, GeneratedContent, SEOResult, SEOIssue } from '../types.js';
import { buildGptStructureSeoPrompt } from '../prompts/gptStructureSeo.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export async function structureAndEvaluateWithGPT(
  rawText: string,
  input: PipelineInput
): Promise<{ content: GeneratedContent; seo: SEOResult }> {
  const prompt = buildGptStructureSeoPrompt(rawText, input);

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  const text = response.choices[0]?.message?.content || '';
  if (!text) throw new Error('Réponse vide de GPT structuration/SEO');

  const json = JSON.parse(text);
  return {
    content: json.content as GeneratedContent,
    seo: json.seo as SEOResult
  };
}

export async function optimizeRawTextWithGPT(
  rawText: string,
  issues: SEOIssue[]
): Promise<string> {
  if (!issues.length) return rawText;

  const prompt = `
Tu es un expert SEO. Améliore ce contenu pour corriger les problèmes suivants :

${issues.map(i => `- [${i.severity}] ${i.code}: ${i.message}`).join('\n')}

CONTENU ACTUEL:
${rawText}

RÈGLES:
- Garde le même ton et la même structure globale.
- Corrige uniquement ce qui est nécessaire.
- Retourne UNIQUEMENT le texte révisé (sans JSON, sans commentaires).
`.trim();

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4
  });

  return response.choices[0]?.message?.content?.trim() || rawText;
}
