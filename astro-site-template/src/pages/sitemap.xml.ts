import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

// On utilise import.meta.glob pour découvrir tous les content.json générés
// sans accéder directement au système de fichiers de dist/.
const contentModules = import.meta.glob('../content/sites/*/*/*/content.json');

export const GET: APIRoute = async () => {
  const siteId = siteConfig.siteId || 'ecofundrive';
  const siteUrl = (siteConfig.siteUrl || 'https://example.com').replace(/\/$/, '');

  const urls: string[] = [];

  for (const filePath in contentModules) {
    const segments = filePath.split('/');
    const sitesIndex = segments.indexOf('sites');
    if (sitesIndex === -1) continue;

    const currentSiteId = segments[sitesIndex + 1];
    const lang = segments[sitesIndex + 2];
    const slug = segments[sitesIndex + 3];

    if (currentSiteId === siteId) {
      urls.push(`${siteUrl}/${lang}/${slug}`);
    }
  }

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
