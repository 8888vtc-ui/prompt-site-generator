import fs from 'node:fs/promises';
import path from 'node:path';

import { runV2Pipeline } from '../src/core/pipeline.js';
import type { PipelineInput, SiteProfile, PagePlanEntry, SEOIssue } from '../src/core/types.js';

async function loadJson<T>(filePath: string): Promise<T> {
  const fullPath = path.resolve(filePath);
  const raw = await fs.readFile(fullPath, 'utf8');
  return JSON.parse(raw) as T;
}

async function main() {
  const baseDir = path.resolve(process.cwd(), 'site-profiles', 'ecofundrive');
  const profilePath = path.join(baseDir, 'profile.json');
  const planPath = path.join(baseDir, 'page-plan.json');

  const profile = await loadJson<SiteProfile>(profilePath);
  const pagePlan = await loadJson<PagePlanEntry[]>(planPath);

  if (!pagePlan.length) {
    throw new Error('Le plan de pages ECOFUNDRIVE est vide');
  }

  const limitFromEnv = process.env.ECOFUNDRIVE_BATCH_LIMIT;
  const limit = limitFromEnv ? parseInt(limitFromEnv, 10) : 5;
  const pages = pagePlan.slice(0, limit);

  console.log('🔧 Génération V2 ECOFUNDRIVE (batch)', `(${pages.length} pages)`);
  console.log('Site :', profile.name);

  for (const page of pages) {
    const url = `${profile.domain || 'https://example.com'}/${page.slug}`;

    const input: PipelineInput = {
      profile,
      page,
      url
    };

    console.log('────────────────────────────────────────────');
    console.log('Page :', `${page.language.toUpperCase()} - ${page.keyword}`);

    const result = await runV2Pipeline(input);

    const outDir = path.resolve(process.cwd(), 'out', 'ecofundrive-v2-batch', page.slug);
    await fs.mkdir(outDir, { recursive: true });

    const htmlPath = path.join(outDir, 'index.html');
    const contentPath = path.join(outDir, 'content.json');
    const seoPath = path.join(outDir, 'seo.json');

    const html = buildHtmlFromResult(result);
    const contentWithTemplate = {
      ...result.content,
      template: page.template,
    };

    await fs.writeFile(htmlPath, html, 'utf8');
    await fs.writeFile(contentPath, JSON.stringify(contentWithTemplate, null, 2), 'utf8');
    await fs.writeFile(seoPath, JSON.stringify(result.seo, null, 2), 'utf8');

    const hasBadIssues = (result.seo.issues || []).some(
      (i: SEOIssue) => i.severity === 'high' || i.severity === 'critical'
    );
    const qualityOk = result.seo.grade === 'A' && result.seo.score >= 95 && !hasBadIssues;

    console.log('✅ Page générée :', htmlPath);
    console.log('   Score SEO :', result.seo.score, '-', 'Grade :', result.seo.grade);
    console.log('   Quality gate A+ :', qualityOk ? 'OK' : 'NON VALIDE');
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtmlFromResult(result: Awaited<ReturnType<typeof runV2Pipeline>>): string {
  const { content } = result;

  const allLinks = content.internal_links || [];
  const mainMenuLinks = allLinks.slice(0, 5);
  const footerLinks = allLinks;
  const baseCss = content.base_css || '';

  const sectionsHtml = content.sections
    .map(section => {
      const h3Html = (section.h3 || [])
        .map(sub => `<h3>${escapeHtml(sub.title)}</h3><p>${escapeHtml(sub.content)}</p>`)
        .join('\n');

      return `<section><h2>${escapeHtml(section.h2)}</h2><p>${escapeHtml(section.content)}</p>${h3Html}</section>`;
    })
    .join('\n');

  const faqHtml = content.faq
    .map(item => `<section><h2>${escapeHtml(item.question)}</h2><p>${escapeHtml(item.answer)}</p></section>`)
    .join('\n');

  const mainMenuHtml = mainMenuLinks
    .map(link => `<li><a href="${escapeHtml(link.url)}">${escapeHtml(link.anchor)}</a></li>`)
    .join('\n');

  const footerLinksHtml = footerLinks
    .map(link => `<li><a href="${escapeHtml(link.url)}">${escapeHtml(link.anchor)}</a></li>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(content.title)}</title>
  <meta name="description" content="${escapeHtml(content.meta_description)}" />
  ${baseCss ? `<style>\n${baseCss}\n</style>` : ''}
</head>
<body>
  <header>
    <nav>
      <ul>
        ${mainMenuHtml}
      </ul>
    </nav>
  </header>
  <main>
    <h1>${escapeHtml(content.title)}</h1>
    <section>
      <p>${escapeHtml(content.introduction)}</p>
    </section>
    ${sectionsHtml}
    <section>
      <h2>FAQ</h2>
      ${faqHtml}
    </section>
  </main>
  <footer>
    <nav>
      <ul>
        ${footerLinksHtml}
      </ul>
    </nav>
  </footer>
</body>
</html>`;
}

main().catch(err => {
  console.error('❌ Erreur lors de la génération batch ECOFUNDRIVE V2:', err);
  process.exit(1);
});
