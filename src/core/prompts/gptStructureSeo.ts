import type { PipelineInput } from '../types.js';

export function buildGptStructureSeoPrompt(rawText: string, input: PipelineInput): string {
  const { page, url } = input;

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
    "wordcount": 0
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

RÈGLES
- STRUCTURE : reconstitue H1, sections H2/H3, FAQ à partir du texte.
- SEO : respecte les bonnes pratiques 2025 (longueur title/meta, H1 unique, densité raisonnable, FAQ pertinente, maillage interne).
- Ne pas inventer de données légales ni de coordonnées.
- Retourne UNIQUEMENT le JSON final, sans texte autour.
- Le JSON doit être strictement valide (aucun commentaire, aucune virgule en trop).
`.trim();
}
