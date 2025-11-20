# Astro Site Template – Intégration du générateur V2

Ce document décrit le projet Astro générique qui servira à rendre les contenus générés par `prompt-site-generator`.

Objectif :
- Lire les `content.json` / `seo.json` produits par la pipeline V2.
- Choisir un **layout** en fonction du `template` / `archetype` (homepage, service_pillar, location, pricing, contact, about, faq, legal).
- Construire automatiquement le **header** (menu) et le **footer** (maillage interne) via `internal_links`.
- Ne faire **aucun appel IA** côté Astro (site 100 % statique une fois les JSON générés).

---

## 1. Structure proposée du projet Astro

Dossier dédié (exemple) :

```text
astro-site-template/
  package.json
  astro.config.mjs
  tsconfig.json

  src/
    content/
      sites/
        ecofundrive/
          fr/
            chauffeur-prive-cote-d-azur/
              content.json
              seo.json
            vtc-luxe-cote-d-azur/
              content.json
              seo.json
            vtc-nice/
              content.json
              seo.json
          en/
            ...

    layouts/
      BaseLayout.astro
      SeoHead.astro

    templates/
      HomePage.astro            # template: homepage
      ServicePillarPage.astro   # template: service_pillar
      ServiceSecondaryPage.astro# template: service_secondary
      LocationPage.astro        # template: location
      PricingPage.astro         # template: pricing
      ContactPage.astro         # template: contact
      AboutPage.astro           # template: about
      FaqPage.astro             # template: faq
      LegalPage.astro           # template: legal

    components/
      HeaderNav.astro
      FooterNav.astro
      SectionBlock.astro
      FaqAccordion.astro

    pages/
      [lang]/[...slug].astro
```

Remarques :
- Les JSON générés par `prompt-site-generator` (V2) sont copiés dans `src/content/sites/<site>/...`.
- La route dynamique `[lang]/[...slug].astro` lit le bon `content.json` / `seo.json` en fonction de l’URL.

---

## 2. Format des JSON attendus

### 2.1. `content.json`

Issu de `GeneratedContent` dans `src/core/types.ts` :

```ts
interface GeneratedContent {
  title: string;
  meta_title: string;
  meta_description: string;
  introduction: string;
  sections: {
    h2: string;
    content: string;
    h3?: { title: string; content: string }[];
  }[];
  faq: { question: string; answer: string }[];
  internal_links: { anchor: string; url: string; context: string }[];
  wordcount: number;
}
```

### 2.2. `seo.json`

Issu de `SEOResult` :

```ts
interface SEOResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  issues: SEOIssue[];         // code, message, severity
  metrics: SEOMetrics;        // titleLength, metaDescriptionLength, headingCount, wordCount, keywordDensity, internalLinks, externalLinks, readabilityScore
  recommendations: string[];
  passedChecks: string[];
  failedChecks: string[];
}
```

`seo.json` est surtout utile pour l’admin / debug, pas affiché brut à l’utilisateur.

---

## 3. Route dynamique `[lang]/[...slug].astro`

Responsabilités :

1. Extraire `lang` et `slug` de l’URL.
2. Construire le chemin du JSON :
   - exemple : `/fr/chauffeur-prive-cote-d-azur` → `src/content/sites/ecofundrive/fr/chauffeur-prive-cote-d-azur/content.json`.
3. Charger `content.json` et `seo.json` via `Astro.glob` ou `import` dynamique.
4. Déterminer le `template` associé (aujourd’hui dans `PagePlanEntry.template` côté générateur ; on pourra soit le recopier dans `content.json`, soit avoir un petit fichier de mapping).
5. Choisir le bon composant dans `src/templates/`.

Pseudo‑code :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SeoHead from '../layouts/SeoHead.astro';
import HomePage from '../templates/HomePage.astro';
import ServicePillarPage from '../templates/ServicePillarPage.astro';
import ServiceSecondaryPage from '../templates/ServiceSecondaryPage.astro';
import LocationPage from '../templates/LocationPage.astro';
// ... autres templates

const { lang, slug } = Astro.params;
const siteId = 'ecofundrive'; // plus tard, pourra venir du domaine / config

const contentModule = await import(`../content/sites/${siteId}/${lang}/${slug}/content.json`);
const seoModule = await import(`../content/sites/${siteId}/${lang}/${slug}/seo.json`);

const content = contentModule.default;
const seo = seoModule.default;

// Hypothèse : le générateur ajoute plus tard `template` dans content,
// sinon on peut avoir un mapping local [slug -> template].
const template = content.template ?? 'service_pillar';

let PageTemplate = ServicePillarPage;
if (template === 'homepage') PageTemplate = HomePage;
else if (template === 'location') PageTemplate = LocationPage;
else if (template === 'service_secondary') PageTemplate = ServiceSecondaryPage;
// ...etc.
---

<BaseLayout>
  <SeoHead title={content.meta_title} description={content.meta_description} />
  <PageTemplate content={content} seo={seo} />
</BaseLayout>
```

---

## 4. Layouts & composants

### 4.1. `BaseLayout.astro`

- Gère le `<html>`, `<body>`, le shell global (header/footer génériques éventuels, mais le menu principal sera plutôt dans le template de page pour pouvoir utiliser `internal_links`).

### 4.2. `SeoHead.astro`

- Reçoit `title`, `description` (et plus tard éventuellement `seo` pour og:title, og:description…)
- Remplit l’`<head>`.

### 4.3. `HeaderNav.astro` / `FooterNav.astro`

- Reçoivent `internal_links` et sélectionnent :
  - pour le header : 4–6 liens clés (accueil, services, tarifs, contact, villes clés).
  - pour le footer : l’ensemble des liens internes pertinents.
- Les liens sont déjà pensés par GPT‑4 dans le JSON, donc le composant ne fait que du mapping.

---

## 5. Exemples de templates

### 5.1. `ServicePillarPage.astro` (service_pillar)

- Utilise `content` + `internal_links`.
- Structure type :
  - Hero : H1 + intro + CTA principal (vers une URL de type contact/réservation).
  - Sections `sections[h2/h3]` rendues en blocs.
  - Bloc FAQ (`faq` → accordéon).
  - Header/Footer via `internal_links`.

### 5.2. `LocationPage.astro` (location)

- Proche de `ServicePillar`, mais met davantage en avant `content.introduction` et les parties parlant de la ville.
- Peut ajouter un sous‑titre avec le nom de la ville.

### 5.3. `PricingPage.astro` (pricing)

- Utilise les sections pour structurer les offres.
- Met en avant les conditions tarifaires, ce qui est inclus / non inclus.

### 5.4. `ContactPage.astro` (contact)

- H1 + intro courte.
- Sections centrées sur le process de prise de contact.
- CTA principaux (boutons) reliés aux URLs (formulaire, WhatsApp, téléphone) définies côté site.

Les autres (`AboutPage`, `FaqPage`, `LegalPage`) suivront la même logique : mêmes données, rendu différent.

---

## 6. Points à décider plus tard

- Où stocker exactement l’info `template` côté Astro :
  - recopiée dans `content.json` par le générateur V2,
  - ou dans un petit mapping JSON par site (slug → template).
- Comment choisir le `siteId` (`ecofundrive` / autre) :
  - par config (fichier),
  - par domaine (dans une future version multi‑tenant).
- Gestion des pages spécifiques légales (mentions, RGPD, cookies) qui seront en partie remplies par l’utilisateur plutôt que par l’IA.

---

## 7. Résumé

- Le projet Astro "site-template" sera un **renderer générique** des JSON V2.
- Il ne fera jamais d’appel IA, ce qui le rend stable, prévisible et économique.
- Les templates (homepage, service_pillar, location, pricing, contact, about, faq, legal) sont pilotés par le champ `template` dans les entrées du générateur.
- EcoFunDrive sera le **premier site** branché, mais la même structure servira ensuite à n’importe quel autre site généré (autres métiers, MisterPrompt, etc.).
