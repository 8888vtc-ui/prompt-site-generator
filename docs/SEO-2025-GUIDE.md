# Règles SEO 2025 – prompt-site-generator

Ce document résume les règles SEO que le générateur doit respecter pour considérer une page comme « valide » (utilisées par GPT dans l'analyse SEO et par la pipeline pour décider des repassages).

## 1. Titres et meta

- **Title (meta_title)**
  - Longueur cible : **50–60 caractères**.
  - Doit contenir le mot-clé principal si possible.
  - Doit rester lisible et naturel (pas de bourrage de mots-clés).

- **Meta description (meta_description)**
  - Longueur cible : **150–160 caractères**.
  - Doit résumer le bénéfice principal + inciter à l’action.
  - Pas de promesse trompeuse ni de résultats garantis.

- **H1**
  - Un seul H1 par page.
  - Cohérent avec le mot-clé principal et le title.

## 2. Structure de contenu

- Hiérarchie logique :
  - 1 H1
  - 4–6 H2 pour les grandes sections
  - H3 pour détailler quand c’est utile (pas obligatoire partout).
- Paragraphes courts (3–4 lignes max) pour la lisibilité.
- Sections recommandées pour les pages de service local :
  - Présentation du service
  - Avantages concrets pour le client
  - Zones desservies
  - Déroulé d’une prestation type
  - Différenciateurs de la marque
  - FAQ

## 3. Densité de mots-clés

- Le mot-clé principal doit apparaître :
  - dans le title
  - dans le H1
  - quelques fois dans le corps, de façon naturelle.
- Densité indicative : **0,7–1,5 %**.
  - Interdiction de bourrage artificiel (répétitions forcées).

## 4. FAQ

- Objectif : répondre à de **vraies questions de prospects**.
- Nombre recommandé : **5 questions** par page service importante.
- Longueur des réponses : **60–120 mots**.
- Contenu : clair, concret, sans jargon inutile.

## 5. Maillage interne

- Chaque page doit contenir plusieurs liens internes pertinents.
- Pour un site comme EcoFunDrive (exemple) :
  - Lien vers la page d’accueil.
  - Lien vers la page services.
  - Lien vers la page devis/réservation.
  - Éventuellement : liens croisés entre villes, transferts, usages.
- Les ancres doivent être descriptives (pas de « cliquez ici »).

## 6. Contenu local (SEO local)

- Utiliser les villes/zones fournies dans le profil (ex. "Marseille, Nice, Cannes, Monaco, Saint-Tropez").
- Rester crédible :
  - ne pas inventer d’adresses précises
  - ne pas promettre de couverture sur tout et n’importe quoi.
- Mettre en avant des bénéfices locaux :
  - connaissance des axes et parkings
  - gestion des événements et des pics de trafic
  - adaptation aux trajets typiques (aéroports, congrès, tourisme, etc.).

## 7. Ton et conformité

- Ton :
  - professionnel
  - rassurant
  - premium (surtout pour les services haut de gamme comme VTC luxe).
- Interdictions :
  - mentionner l’IA ou la génération automatique
  - inventer des données légales, des chiffres exacts (CA, nombre de clients…)
  - faire des promesses de résultats garantis (SEO, chiffre d’affaires).

## 8. Score SEO et décisions de la pipeline

- L’analyse SEO renvoyée par GPT doit produire :
  - `score` : 0–100
  - `grade` : A–F
  - `issues[]` : liste de problèmes avec `severity` (low/medium/high/critical)
  - `metrics` : title/meta length, headings, wordcount, densité, liens, lisibilité…

- La pipeline considère qu’une page est **acceptable** si :
  - `score >= 75`
  - aucune issue de sévérité `high` ou `critical`.

- Si ces conditions ne sont pas remplies :
  - la page passe par un **repassage GPT** guidé par la liste des issues,
  - la pipeline boucle jusqu’à atteindre le seuil ou atteindre un nombre maximum de passes.

---

Ce guide sert de référence pour :
- la conception des prompts GPT (structuration + SEO),
- l’interprétation des résultats SEO dans le code,
- et l’argumentaire produit autour du générateur ("respect des bonnes pratiques SEO 2025").
