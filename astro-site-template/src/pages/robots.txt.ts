import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

export const GET: APIRoute = async () => {
  const siteUrl = (siteConfig.siteUrl || 'https://example.com').replace(/\/$/, '');

  const body = [`User-agent: *`, `Allow: /`, `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
