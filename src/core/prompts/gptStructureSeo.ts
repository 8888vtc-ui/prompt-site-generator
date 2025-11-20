import type { PipelineInput } from '../types.js';

export function buildGptStructureSeoPrompt(rawText: string, input: PipelineInput): string {
  const { page, url } = input;
  const template = page.template || 'service_pillar';

  return `
Tu es un expert SEO technique et on-page.
On te fournit :
1) les paramètres de la page
2) le contenu texte brut rédigé par un rédacteur

Tu dois produire :
A) un JSON structuré conforme au schéma ci-dessous
B) une analyse SEO détaillée pour cette page

PARAMÈTRES
- Mot-clé principal : ${page.keyword}
- Langue : ${page.language}
- Type de page : ${page.pageType}
- Template : ${template}
- Localisation : ${page.location}
- URL cible : ${url}
- Longueur cible approx. : ${page.wordcount} mots

CONTENU SOURCE
${rawText}

SCHÉMA JSON ATTENDU
{
  "content": {
    "title": "H1 de la page",
    "meta_title": "Title SEO (50-60 caractères)",
    "meta_description": "Meta description (150-160 caractères)",
    "introduction": "Résumé introductif",
    "hero_image": {
      "alt": "Texte alternatif descriptif pour l'image principale (avec le mot-clé si pertinent, une seule fois)",
      "description": "Brève description de ce que doit montrer l'image (contexte interne, non affiché)",
      "prompt": "Prompt détaillé pour générer l'image via un modèle d'image (sans noms de lieux, sans logos, sans visages reconnaissables)",
      "src": "Chemin ou nom de fichier suggéré pour l'image (ex: /images/<slug>-hero-1.jpg)"
    },
    "sections": [
      {
        "h2": "Titre de section",
        "content": "Texte de la section",
        "h3": [
          { "title": "Sous-titre", "content": "Texte du sous-paragraphe" }
        ]
      }
    ],
    "faq": [
      { "question": "Question fréquente", "answer": "Réponse utile" }
    ],
    "internal_links": [
      { "anchor": "Texte du lien", "url": "/chemin/relatif", "context": "Phrase complète avec le lien" }
    ],
    "wordcount": 0,
    "base_css": "Feuille de style CSS complète pour la page (voir instructions CSS ci-dessous)"
  },
  "seo": {
    "score": 0,
    "grade": "A|B|C|D|E|F",
    "issues": [
      { "code": "short_title", "message": "Description du problème", "severity": "low|medium|high|critical" }
    ],
    "metrics": {
      "titleLength": 0,
      "metaDescriptionLength": 0,
      "headingCount": { "h1": 0, "h2": 0, "h3": 0 },
      "wordCount": 0,
      "keywordDensity": 0,
      "internalLinks": 0,
      "externalLinks": 0,
      "readabilityScore": 0
    },
    "recommendations": [
      "Recommandation concrète"
    ],
    "passedChecks": [
      "h1_unique"
    ],
    "failedChecks": [
      "keyword_density_basse"
    ]
  }
}

RÈGLES QUALITÉ & SEO
- STRUCTURE : reconstitue H1, sections H2/H3, FAQ à partir du texte, de manière logique et hiérarchisée en fonction du template.
- ADAPTATION AU TEMPLATE :
  - homepage : mettre l'accent sur le hero, les blocs de services, la preuve sociale et les liens vers les pages clés (services, tarifs, contact, à propos).
  - service_pillar / service_secondary : structurer comme une page de service (présentation, avantages, déroulé, preuves, FAQ, CTA).
  - location : reprendre la logique de service mais ancrée fortement dans la ville/zone donnée.
  - pricing : insister sur la lisibilité des offres, ce qui est inclus/non inclus, sans inventer de prix précis si non fournis.
  - contact : mettre en avant les moyens de contact et le déroulé après la prise de contact.
  - about : axer sur l'histoire, la mission, les valeurs et la crédibilité de la marque.
  - faq : organiser les questions/réponses par thème, même si le corps de page est plus court.
  - legal : conserver une structure simple, claire, sans inventer de données juridiques.
- MOT-CLÉ : intègre le mot-clé principal dans le title, le H1, l'introduction, quelques H2/H3 et de manière naturelle dans le corps du texte avec une densité cible autour de 1 à 1,5 % (jamais de bourrage).
- META : le "title" fait 50 à 60 caractères, la "meta_description" entre 150 et 155 caractères (ne dépasse jamais 160).
- LIENS INTERNES : fournis AU MOINS 5 liens internes pertinents dans "internal_links" (idéalement 6 à 8) permettant de construire un menu principal et un menu de bas de page (ex : réservation, tarifs/offres, services clés, pages localités, pages à propos, etc.).
  - SCORE : évalue la page sur 100. Un contenu vraiment excellent, prêt à publier, doit obtenir un score ≥ 90 et un grade "A". Réserve les grades A aux pages très abouties ; utilise B/C pour les pages moyennes.
  - Quand la page respecte tous les critères majeurs (grade "A" et aucune issue de sévérité high/critical), ne donne jamais un score inférieur à 95.
  - SEO : respecte les bonnes pratiques 2025 (H1 unique, maillage interne riche, FAQ utile, structure claire, lisibilité correcte).
- CSS DE BASE (base_css)  - Génère dans "content.base_css" une feuille de style CSS complète qui définit le look & feel de la page/site.
  - Style au minimum : body, header, nav, main, section, h1, h2, h3, footer, liens, boutons et la classe ".hero-image".
  - Le CSS doit être autonome : uniquement des règles CSS valides, sans balise <style>, sans @import externe.
  - Utilise des couleurs et un style cohérents avec l'activité, le positionnement, la zone géographique et le template de page.
  - Privilégie une mise en page moderne, lisible, responsive (mobile-first) et avec un contraste suffisant pour l'accessibilité.
- IMAGES (hero_image) :
  - Propose une image principale cohérente avec le service, le ton et la localisation (ex : VTC premium, paysage méditerranéen, ambiance business) **sans afficher de noms de lieux ou de marques** sur l'image.
  - Ne pas inclure de logos reconnaissables, ni de visages identifiables (préférer silhouettes, vues de dos ou cadrages neutres).
  - Le champ "alt" doit être une phrase naturelle, descriptive, avec le mot-clé principal au maximum une fois.
  - Le champ "prompt" doit décrire précisément la scène pour un générateur d'images (type Replicate), en interdisant explicitement noms de villes visibles, panneaux, marques, immatriculations lisibles.
- Ne pas inventer de données légales ni de coordonnées.
- Retourne UNIQUEMENT le JSON final, sans texte autour.
- Le JSON doit être strictement valide (aucun commentaire, aucune virgule en trop).
`.trim();
}
