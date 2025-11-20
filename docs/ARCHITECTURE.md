# Architecture V2 – prompt-site-generator

## Objectif

`prompt-site-generator` est un moteur générique de génération de sites SEO basé sur un **pipeline multi-prompt premium** :

- **Claude Sonnet 4.5** génère le contenu texte brut (pages de vente locales premium).
- **GPT‑4.1 (OpenAI)** structure ce texte en JSON, réalise l'analyse SEO 2025 et effectue des repassages d'optimisation jusqu'à atteindre un niveau de qualité A+.

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
    ecofundrive/            # Profil complet + plan de pages du site test (JSON)

  scripts/
    generate-demo-ecofundrive.ts   # Script de génération d'une page de démo EcoFunDrive
    generate-ecofundrive-batch.ts  # Script de génération batch (plusieurs pages EcoFunDrive)

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

3. **Contrôle SEO (mode test premium actuel)**
- Paramètres (configurés dans `pipeline.ts`) :
  - `SEO_SCORE_MIN = 95`
  - `seo.grade` doit être strictement égal à `"A"`.
  - aucune issue de sévérité `high` ou `critical`.
- Si ces conditions sont remplies : **validation**.
- Sinon : repassage.

4. **GPT – Repassage / optimisation**
   - Fonction : `optimizeRawTextWithGPT(rawText, seo.issues)`
   - Entrée : texte brut actuel + liste d'issues SEO.
   - Sortie : `rawText` révisé.

5. **Boucle de passes**
- La pipeline boucle sur les étapes 2 → 4 jusqu’à :
  - atteindre le seuil SEO A+ (score ≥ 95 + grade A), ou
  - atteindre `MAX_PASSES = 4` (nombre maximum de repassages en mode test premium).

> Remarque : pour la production, des modes plus économiques pourront être introduits
> (par exemple seuils différents selon le type de page et le niveau d'importance,
> avec moins de passes et des volumes de mots adaptés), tout en conservant le même
> principe de contrôle qualité via le bloc `seo`.

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

## Génération complète & déploiement (A → Z)

L'objectif du projet est que **le déploiement d'un site génère tout automatiquement** à partir d'un profil + plan de pages :

- **Contenu** : pages complètes (`content.json`) avec titre, meta, sections, FAQ, maillage interne.
- **SEO** : rapport par page (`seo.json`) avec score, grade, issues, métriques et recommandations.
- **CSS** : feuille de style de base générée par GPT dans `content.base_css`, injectée dans le HTML et dans les templates Astro (slot `<style>`).
- **Menus / maillage interne** : liens internes suffisants pour construire header/footer, pages pilier, localités, pages légales, etc.
- **Fichiers techniques** : structure de dossiers, JSON, et, côté site final, intégration dans les templates Astro + configuration Netlify.

Des **scripts Node** (par exemple `scripts/generate-<site>-batch.ts` et variantes "fast") orchestrent cette génération de bout en bout. À terme, ces scripts seront appelés par une API/endpoint derrière un formulaire (ex : formulaire EcoFunDrive V1) pour aller **du formulaire → génération complète → déclenchement du build Netlify**.

On peut conserver dans le dépôt une **bibliothèque d'exemples** (blocs de mise en page, styles de base, structures de menus) que GPT‑4 peut utiliser comme références / inspirations. Mais par défaut, pour chaque nouveau site, **tout doit être généré et cohérent avec le profil** (activité, template de page, zone géographique), sans copier/coller aveugle depuis un autre projet.

### Profils de design & modèles techniques (à venir)

Pour **alléger la charge de l'IA** (coût et tokens) tout en gardant une génération complète et cohérente, la suite du projet introduira :

- Des **profils de design** par site (couleurs, typographies, style général, ambiance) décrits dans le profil ou un fichier dédié.
- Des **presets CSS** et structures de mise en page (ex : transport de luxe, service local, coaching) stockés dans le dépôt comme base d'inspiration.
- Des **modèles techniques** (manifest global, menus types, structures de pages) utilisés comme squelettes pour accélérer la génération des fichiers.

L'IA (GPT‑4 / modèles plus légers) s'appuiera sur ces profils et presets pour générer `base_css`, le maillage interne et les fichiers techniques, au lieu de réinventer chaque fois un design complet à partir de zéro. L'objectif reste que, au final, le site soit **entièrement généré à partir du profil + plan de pages**, mais en réutilisant intelligemment ces modèles pour optimiser vitesse et coût.

## Vision produit : MisterPrompt

MisterPrompt est le futur produit construit au‑dessus de ce moteur :

- **Cible principale** : petites boîtes locales, indépendants et TPE qui n’ont pas d’équipe technique interne.
- **Rôle** : devenir une **zone de vraie information** sur l’IA et le web, loin du bullshit marketing :
  - expliquer ce qu’est une IDE et un outil comme GitHub,
  - montrer pourquoi les hébergeurs classiques sont bousculés par des approches Netlify/GitHub,
  - démystifier l’IA (une IA seule est limitée, besoin de pipeline + validation humaine),
  - rappeler qu'une IA brute, c'est comme un processeur sans mémoire : elle devient pilotable seulement quand on l'entoure d'un IDE, de code, de scripts et d'un vrai pipeline,
  - expliquer pourquoi la plupart des contenus YouTube sont orientés affiliation.

### Modèle économique : affiliation SEO transparente

Le modèle économique visé pour MisterPrompt repose principalement sur **l’affiliation SEO** autour d’outils IA / web **réellement testés et validés** par l’auteur :

- Présentation honnête du parcours (ex : expérience terrain en VTC, galères SEO, découverte des IDE, GitHub, Netlify, IA).
- Tests concrets d’outils (hébergement, IA, IDE, builders front, analytics, etc.) avec **captures d’écran** et retours détaillés.
- Recommandations limitées à des produits **utilisés en vrai dans les projets** (ex : EcoFunDrive, générateur V2, futurs sites de démo).
- Liens d’affiliation assumés et signalés comme tels, uniquement vers des services qui apportent une **vraie valeur** (pas de promesses SEO irréalistes, pas de bullshit marketing).

Les choix d’outils seront **faits et validés progressivement**, en testant chaque solution IA disponible dans des scénarios réels (génération de sites, optimisation de contenu, intégration technique). MisterPrompt doit devenir un **"site laboratoire" public** : on y voit les essais, les limites et les usages recommandés, plutôt qu’un simple catalogue d’offres IA.
- **Offre** : combiner des **guides pédagogiques** (MisterPrompt en tant que média) et un **générateur de sites SEO A+** (le moteur V2) avec des templates Astro par type de page.

EcoFunDrive sert de site pilote pour valider le moteur et les templates. MisterPrompt (misterprompt.fr) sera ensuite la vitrine et le laboratoire public de ces approches (guides, exemples concrets, futures offres packagées pour petites entreprises locales).
