import type { PipelineInput } from '../types.js';

export function buildClaudeContentPrompt(input: PipelineInput): string {
  const { profile, page } = input;

  return `
Tu es un expert en rédaction web et SEO local.
Ta mission : écrire une page de présentation de service, claire, convaincante et premium.

CONTEXTE DU SITE
- Marque : ${profile.name}
- Activité principale : ${profile.activity}
- Positionnement : ${profile.positioning}
- Zone principale : ${profile.zones}
- Cœur de cible : ${profile.targetAudience}
- Objectif business : ${profile.mainGoal}
- Ton de la marque : ${profile.tone}

PARAMÈTRES DE LA PAGE
- Mot-clé principal : ${page.keyword}
- Langue : ${page.language}
- Type de page : ${page.pageType}
- Localisation précise : ${page.location}
- Longueur cible : ${page.wordcount} mots (approx., pas besoin d'être exact)

CONTRAINTES
- Ne JAMAIS mentionner l'IA, les modèles, le fait que le texte est généré.
- Ne pas inventer de données légales, de chiffres précis, ni de coordonnées.
- Tu peux parler de "formulaire de contact", "WhatsApp", "appel téléphonique" sans donner de numéro.
- Style : phrases claires, paragraphes courts (3-4 lignes max), ton premium, rassurant, orienté bénéfices clients.

STRUCTURE ATTENDUE (MARKDOWN OU HTML SIMPLE)
- Un seul H1 au début (titre principal).
- 4 à 6 H2 logiques (présentation du service, avantages, zones desservies, déroulé, pourquoi choisir la marque, etc.).
- H3 facultatifs pour détailler certains points (confort, sécurité, électrique, etc.).
- 1 à 3 appels à l'action clairs dans le texte (ex : "Demander un devis", "Réserver votre trajet").
- Une section FAQ avec 5 questions/réponses utiles.
- Conclusion courte qui rappelle le bénéfice principal et invite à l'action.

FOCUS SERVICES LOCAUX
- Mettre en avant : gain de temps, confort, discrétion, sécurité, parfaite connaissance des itinéraires, gestion des trajets complexes (aéroports, événements, longues distances).
- Utiliser naturellement les villes et zones : ${profile.zones}.

SORTIE ATTENDUE
- Contenu texte uniquement, en markdown ou HTML simple.
- PAS de JSON.
- PAS de balises \`\`\` ni de code.
- Le texte doit pouvoir être utilisé tel quel comme corps de page.
`.trim();
}
