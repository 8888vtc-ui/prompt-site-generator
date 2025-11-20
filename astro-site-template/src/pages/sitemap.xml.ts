import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { siteConfig } from '../config/site';

async function getAllUrls(): Promise<string[]> {
  const siteId = siteConfig.siteId || 'ecofundrive';
  const siteUrl = (siteConfig.siteUrl || 'https://example.com').replace(/\/$/, '');

  const baseDir = new URL(`../content/sites/${siteId}/`, import.meta.url).pathname;
  const urls: string[] = [];

  try {
    const langs = await fs.readdir(baseDir);
    for (const lang of langs) {
      const langDir = path.join(baseDir, lang);
      const langStat = await fs.stat(langDir).catch(() => null);
      if (!langStat || !langStat.isDirectory()) continue;

      const slugs = await fs.readdir(langDir);
      for (const slug of slugs) {
        const slugDir = path.join(langDir, slug);
        const slugStat = await fs.stat(slugDir).catch(() => null);
        if (!slugStat || !slugStat.isDirectory()) continue;

        urls.push(`${siteUrl}/${lang}/${slug}`);
      }
    }
  } catch (err) {
    console.error('Erreur lors de la génération du sitemap.xml', err);
  }

  return urls;
}

export const GET: APIRoute = async () => {
  const urls = await getAllUrls();
  const xmlItems = urls
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlItems}\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
