# astro-site-template

Template Astro générique pour rendre les pages générées par `prompt-site-generator`.

- Lit les JSON générés par la pipeline V2 (`content.json` + `seo.json`).
- Choisit un layout en fonction du `template` (homepage, service_pillar, location, pricing, contact, etc.).
- Construit automatiquement le header/footer à partir de `internal_links`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

> Remarque : pour qu'une page s'affiche, il faut copier les JSON générés
> dans `src/content/sites/<site>/<lang>/<slug>/content.json` et `seo.json`.
