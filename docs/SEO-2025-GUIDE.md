# Règles SEO 2025 – prompt-site-generator

Ce document résume les règles SEO que le générateur doit respecter pour considérer une page comme « valide » (utilisées par GPT dans l'analyse SEO et par la pipeline pour décider des repassages).

## 1. Titres et meta

- **Title (meta_title)**
  - Longueur cible : **50–60 caractères**.
  - Doit contenir le mot-clé principal si possible.
  - Doit rester lisible et naturel (pas de bourrage de mots-clés).

- **Meta description (meta_description)**
  - Longueur cible : **150–155 caractères** (ne jamais dépasser ~160).
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
  - Pour les pages stratégiques (piliers, pages tarifs/réservation), viser **au moins 5 à 8 liens internes**.
  - Ces liens internes servent à alimenter à la fois le **menu principal** (header) et le **footer** dans les templates Astro.

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

- En **mode test premium actuel** (utilisé pour les démos et sites pilotes) :
  - une page est considérée comme **valide** si :
    - `score >= 95`,
    - `grade === "A"`,
    - aucune issue de sévérité `high` ou `critical`.
  - la pipeline peut effectuer **jusqu’à 4 passes** d’optimisation maximum.

- Stratégie prévue pour la **production** :
  - réserver le mode A+ (score très élevé, plusieurs passes, contenu plus long) aux pages à **fort impact**
    (piliers, pages tarifs, réservation, pages business clés),
  - utiliser un mode plus léger pour la **longue traîne** (villes secondaires, certaines pages transferts/usage) :
    contenu plus court, moins de passes, seuil de score légèrement inférieur mais toujours conforme au guide.

## 9. Backlinks 2025 et rôle de l’IA

En 2025, les signaux de popularité restent importants, mais les stratégies de backlinks doivent être **crédibles** et alignées sur l’IA générative :

- **Liens locaux réels** (prioritaires pour les petites boîtes locales) :
  - sites de la ville/région (mairies, offices de tourisme, blogs locaux),
  - partenaires métiers (hôtels, restaurants, wedding planners, événements, associations),
  - quelques annuaires locaux sérieux.
  - L’IA aide à lister les acteurs et à rédiger des emails/propositions propres, mais l’envoi reste ciblé.
- **Digital PR + contenus “assets”** :
  - guides ou mini‑études utiles (ex. guide des transferts pour un événement local),
  - l’IA sert à structurer ces contenus et à préparer des emails de pitch pour journalistes/blogueurs.
- **Partenariats et co‑contenus** :
  - contenus co‑brandés avec d’autres acteurs locaux (guides communs, checklists, pages partenaires),
  - liens naturels depuis les pages "partenaires" et les guides partagés.
- **Profils et annuaires filtrés** :
  - fiches réellement consultées (Google Business Profile, plateformes métiers, quelques annuaires professionnels),
  - descriptions harmonisées mais adaptées (l’IA aide à produire des variantes non dupliquées).
- **Maillage interne solide** (complément indispensable) :
  - les internal_links générés par la pipeline servent à construire un maillage clair entre pages services, pages villes, tarifs et contact.

Interdictions explicites :
- générer en masse des "guest posts IA" sur des blogs de faible qualité,
- acheter des packs de liens sans cohérence métier/zone,
- automatiser des emails de spam à grande échelle avec l’IA.

L’IA doit être utilisée pour **préparer, accélérer et structurer** ces actions (recherche d’idées, rédaction de premières versions, harmonisation), pas pour fabriquer des schémas de liens artificiels.

---

Ce guide sert de référence pour :
- la conception des prompts GPT (structuration + SEO),
- l’interprétation des résultats SEO dans le code,
- et l’argumentaire produit autour du générateur ("respect des bonnes pratiques SEO 2025").
