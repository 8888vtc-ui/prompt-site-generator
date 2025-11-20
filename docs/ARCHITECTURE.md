# Architecture V2 – prompt-site-generator

## Objectif

`prompt-site-generator` est un moteur générique de génération de sites SEO basé sur un **pipeline multi-prompt** :

- **Claude Sonnet 4.5** génère le contenu texte brut (pages de vente locales premium).
- **GPT (OpenAI)** structure ce texte en JSON, réalise l'analyse SEO 2025 et effectue des repassages d'optimisation jusqu'à atteindre un seuil de qualité.

EcoFunDrive est utilisé comme **site de test** (profil + plan de pages) pour valider le générateur.

---

## Structure des dossiers

```text
prompt-site-generator/
  package.json
  tsconfig.json
  README.md
  .gitignore

  src/
    core/
      types.ts              # Types génériques : profil, plan de pages, contenu, SEO, pipeline
      pipeline.ts           # runV2Pipeline : enchaînement Claude → GPT → boucle SEO
      prompts/
        claudeContent.ts    # Prompt V2 pour Claude (texte libre structuré)
        gptStructureSeo.ts  # Prompt V2 pour GPT (structuration JSON + SEO)
      engines/
        claude.ts           # Wrapper Anthropic (Sonnet 4.5) → texte brut
        gpt.ts              # Wrapper OpenAI GPT → structuration + SEO + optimisation

  site-profiles/
    ecofundrive/            # (à venir) Profil complet + plan de pages du site test

  scripts/
    generate-demo-ecofundrive.ts  # (à venir) Script de génération de démo EcoFunDrive

  docs/
    ARCHITECTURE.md         # (ce fichier)
    SEO-2025-GUIDE.md       # (à venir) Règles SEO 2025
```

---

## Types principaux (`src/core/types.ts`)

- **SiteProfile**
  - Identité et positionnement global du site (activité, zones, cible, ton, objectifs, CTA, canaux de contact).
- **PagePlanEntry**
  - Une entrée de plan de pages (slug, mot-clé, langue, type de page, localisation, wordcount cible, autorité ou non).
- **GeneratedContent**
  - Structure de contenu utilisée par le générateur (title, meta_title, meta_description, introduction, sections, FAQ, liens internes, wordcount).
- **SEOResult**
  - Résultat de l'analyse SEO (score, grade, issues, metrics, recommendations, checks passés/échoués).
- **PipelineInput / PipelineResult**
  - Entrée/sortie de `runV2Pipeline` (profil + page → contenu + SEO + texte brut final).

---

## Pipeline V2 (`src/core/pipeline.ts`)

Pour une page donnée, `runV2Pipeline(input)` exécute :

1. **Claude Sonnet 4.5 – Contenu brut**
   - Fonction : `generateRawTextWithClaude(input)`
   - Prompt : `buildClaudeContentPrompt(input)`
   - Entrée : `PipelineInput` (profil + PagePlanEntry + URL).
   - Sortie : `rawText` (markdown/HTML léger, H1/H2/H3, FAQ, CTA, sans JSON).

2. **GPT – Structuration + analyse SEO**
   - Fonction : `structureAndEvaluateWithGPT(rawText, input)`
   - Prompt : `buildGptStructureSeoPrompt(rawText, input)`
   - Sortie JSON :
     - `content` : `GeneratedContent`
     - `seo` : `SEOResult`

3. **Contrôle SEO**
   - Seuil minimal (configuré dans `pipeline.ts`) :
     - `SEO_SCORE_MIN` (ex. 75)
     - aucune issue de sévérité `high` ou `critical`.
   - Si la page respecte le seuil : **validation**.
   - Sinon : repassage.

4. **GPT – Repassage / optimisation**
   - Fonction : `optimizeRawTextWithGPT(rawText, seo.issues)`
   - Entrée : texte brut actuel + liste d'issues SEO.
   - Sortie : `rawText` révisé.

5. **Boucle de passes**
   - La pipeline boucle sur les étapes 2 → 4 jusqu’à :
     - atteindre le seuil SEO, ou
     - atteindre `MAX_PASSES` (nombre maximum de repassages, ex. 3).

6. **Résultat final**
   - `PipelineResult` :
     - `content` : contenu structuré validé
     - `seo` : dernier rapport SEO
     - `rawText` : version finale du texte brut

---

## Rôle des prompts

### Claude (`src/core/prompts/claudeContent.ts`)

- Produire un texte de page de service locale :
  - H1 unique, H2/H3, FAQ, CTA
  - ton premium, orienté bénéfices, ancré dans la géographie locale.
- Aucune contrainte JSON.
- Interdictions :
  - Ne jamais mentionner l’IA ou la génération automatique.
  - Ne pas inventer de données légales, de chiffres précis ni de coordonnées.

### GPT (`src/core/prompts/gptStructureSeo.ts`)

- Transformer le texte brut + contexte en :
  - `content` (JSON conforme au schéma `GeneratedContent`)
  - `seo` (score, issues, metrics, recommandations, checks).
- Appliquer les règles SEO 2025 :
  - longueur title/meta
  - structure H1/H2/H3
  - densité mot-clé raisonnable
  - FAQ utile
  - maillage interne.
- Sortir un JSON strictement valide, sans texte ni commentaires autour.

---

## Stratégie globale

- **Claude** = moteur de rédaction premium (texte libre).
- **GPT** = moteur de structuration + contrôle qualité SEO.
- Le générateur combine les deux dans une boucle maîtrisée (score minimal, nombre de passes limité) pour produire des pages :
  - lisibles et convaincantes pour l’humain,
  - techniquement solides pour le SEO 2025.

EcoFunDrive sera le premier "/site test" branché sur ce moteur via un profil dédié (`site-profiles/ecofundrive`) et un script de génération de démo.
