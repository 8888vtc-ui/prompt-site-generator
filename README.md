# prompt-site-generator

Générateur de sites SEO basé sur un pipeline multi-prompt :

- **Claude Sonnet 4.5** pour la rédaction du contenu texte (pages de vente locales, ton premium).
- **GPT (OpenAI)** pour la structuration en JSON, l'analyse SEO 2025 et les repassages d'optimisation.

EcoFunDrive sert uniquement de **site test** (profil + plan de pages) pour démontrer le générateur.

## Objectifs

- Produire des pages de service locales FR/EN de très haute qualité.
- Garantir un niveau SEO minimal (score, grade, structure) via une boucle de contrôle.
- Garder les prompts légers et spécialisés (un moteur écrit, l'autre contrôle).

## Pipeline V2 (vue simple)

1. **Claude**
   - Entrée : profil du site + page du plan.
   - Sortie : texte libre structuré (H1/H2/H3, FAQ, CTA), sans JSON.

2. **GPT – Structuration + SEO**
   - Entrée : texte brut Claude + contexte (mot-clé, URL, type de page…).
   - Sortie JSON : `{ content, seo }` (contenu structuré + rapport SEO complet).

3. **Contrôle SEO**
   - Seuil minimal (ex. score ≥ 75, pas d'issue high/critical).
   - Si OK → page validée.
   - Sinon → repassage.

4. **GPT – Repassage / optimisation**
   - Entrée : texte actuel + liste des problèmes SEO.
   - Sortie : texte optimisé.
   - Retour à l'étape 2 (boucle limitée à N passes).

## Dossiers clés

- `src/core` : cœur du générateur (types, prompts, moteurs Claude/GPT, pipeline).
- `site-profiles/` : profils de sites (dont `ecofundrive`) et plans de pages.
- `scripts/` : scripts CLI (ex. génération de démo EcoFunDrive).
- `docs/` : documentation architecture et règles SEO 2025.

## Prérequis

- Node.js 20+
- Clés API :
  - `ANTHROPIC_API_KEY` pour Claude Sonnet 4.5
  - `OPENAI_API_KEY` pour GPT (structuration + SEO)

## Installation rapide

```bash
npm install
```

## Lancer une génération de démo (ECOFUNDRIVE)

```bash
npm run generate:demo
```

(La commande et le script seront ajoutés progressivement au fur et à mesure du développement.)
