import type { PipelineInput, PipelineResult, SEOIssue } from './types.js';
import { generateRawTextWithClaude } from './engines/claude.js';
import { structureAndEvaluateWithGPT, optimizeRawTextWithGPT } from './engines/gpt.js';

const SEO_SCORE_MIN = 95;
const MAX_PASSES = 4;

export async function runV2Pipeline(input: PipelineInput): Promise<PipelineResult> {
  let rawText = await generateRawTextWithClaude(input);

  let finalContent: PipelineResult['content'] | null = null;
  let finalSeo: PipelineResult['seo'] | null = null;

  for (let pass = 1; pass <= MAX_PASSES; pass++) {
    const { content, seo } = await structureAndEvaluateWithGPT(rawText, input);

    finalContent = content;
    finalSeo = seo;

    const isGoodScore = seo.score >= SEO_SCORE_MIN;
    const isGradeA = seo.grade === 'A';
    const hasBadIssues = (seo.issues || []).some(
      (i: SEOIssue) => i.severity === 'high' || i.severity === 'critical'
    );

    if (isGoodScore && isGradeA && !hasBadIssues) {
      break;
    }

    rawText = await optimizeRawTextWithGPT(rawText, seo.issues || []);
  }

  if (!finalContent || !finalSeo) {
    throw new Error('Pipeline terminé sans résultat valide');
  }

  return {
    content: finalContent,
    seo: finalSeo,
    rawText
  };
}
