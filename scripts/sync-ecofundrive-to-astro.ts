import fs from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const outBase = path.resolve(process.cwd(), 'out', 'ecofundrive-v2-batch');
  const astroBase = path.resolve(
    process.cwd(),
    'astro-site-template',
    'src',
    'content',
    'sites',
    'ecofundrive'
  );

  let langs: string[];
  try {
    langs = await fs.readdir(outBase);
  } catch (err) {
    console.error('❌ Dossier de sortie EcoFunDrive V2 introuvable :', outBase);
    process.exit(1);
  }

  for (const lang of langs) {
    const langOutDir = path.join(outBase, lang);
    const langStat = await fs.stat(langOutDir).catch(() => null);
    if (!langStat || !langStat.isDirectory()) continue;

    const slugs = await fs.readdir(langOutDir);
    for (const slug of slugs) {
      const srcDir = path.join(langOutDir, slug);
      const srcStat = await fs.stat(srcDir).catch(() => null);
      if (!srcStat || !srcStat.isDirectory()) continue;

      const destDir = path.join(astroBase, lang, slug);
      await fs.mkdir(destDir, { recursive: true });

      for (const fileName of ['content.json', 'seo.json']) {
        const srcFile = path.join(srcDir, fileName);
        const destFile = path.join(destDir, fileName);

        try {
          await fs.copyFile(srcFile, destFile);
        } catch {
          console.warn('⚠️ Fichier manquant pour la page', lang, slug, ':', fileName);
        }
      }
    }
  }

  console.log('✅ Contenus EcoFunDrive copiés vers astro-site-template pour le build Netlify.');
}

main().catch(err => {
  console.error('❌ Erreur lors de la copie des contenus EcoFunDrive vers Astro :', err);
  process.exit(1);
});
