import type { PipelineInput } from '../types.js';

export function buildClaudeContentPrompt(input: PipelineInput): string {
  const { profile, page } = input;
  const template = page.template || 'service_pillar';

  const templateInstructions = (() => {
    switch (template) {
      case 'homepage':
        return `
TYPE DE TEMPLATE
- Template : HOME / PAGE D'ACCUEIL
- Objectif : présenter la marque, résumer les principaux services et orienter vers les pages clés (services, tarifs, contact, à propos).
- Structure : hero fort, sections services, bénéfices-clients, éléments de preuve sociale, appels à l'action clairs.`;
      case 'location':
        return `
TYPE DE TEMPLATE
- Template : PAGE LOCALE / VILLE
- Objectif : présenter le même service mais ciblé sur une ville ou une zone précise.
- Structure : rappeler le service, détailler les usages typiques dans cette ville, mettre en avant la connaissance locale et les avantages pour cette zone.`;
      case 'pricing':
        return `
TYPE DE TEMPLATE
- Template : TARIFS / OFFRES
- Objectif : expliquer clairement la logique de prix et de valeur sans inventer de chiffres précis.
- Structure : présenter les grandes familles d'offres, ce qui est inclus/non inclus, répondre aux questions fréquentes sur les prix et orienter vers le contact/devis.`;
      case 'contact':
        return `
TYPE DE TEMPLATE
- Template : CONTACT / RÉSERVATION
- Objectif : pousser l'utilisateur à prendre contact (formulaire, téléphone, WhatsApp) en rassurant sur le process et les délais de réponse.
- Structure : bloc d'introduction court, explication du déroulé après la demande, éléments de réassurance, FAQ courte centrée sur la prise de contact.`;
      case 'about':
        return `
TYPE DE TEMPLATE
- Template : À PROPOS / MARQUE
- Objectif : construire la confiance (histoire, valeurs, équipe, engagement qualité/RSE).
- Structure : présentation de la marque, mission, valeurs, éventuellement portrait du fondateur et preuves de crédibilité.`;
      case 'faq':
        return `
TYPE DE TEMPLATE
- Template : FAQ GLOBALE
- Objectif : centraliser les questions fréquentes importantes (service, réservation, paiement, annulation...).
- Structure : introduction courte + liste de questions/réponses organisées par thème.`;
      case 'legal':
        return `
TYPE DE TEMPLATE
- Template : LÉGAL / RGPD / MENTIONS
- Objectif : présenter des informations légales et de conformité à partir des données fournies par l'utilisateur.
- Règle critique : ne PAS inventer de données juridiques ; rester générique et utiliser des formulations neutres si une information manque.`;
      case 'service_secondary':
      default:
        return `
TYPE DE TEMPLATE
- Template : PAGE SERVICE (PRINCIPALE OU SECONDAIRE)
- Objectif : détailler un service ou cas d'usage clé, avec bénéfices, déroulé, preuves et FAQ.
- Structure : proche d'une page de vente, orientée conversion.`;
    }
  })();

  return `
Tu es un expert en rédaction web et SEO local.
Ta mission : écrire une page claire, convaincante et premium en respectant le type de template indiqué.

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
- Template : ${template}
- Localisation précise : ${page.location}
- Longueur cible : ${page.wordcount} mots (approx., pas besoin d'être exact)

${templateInstructions}

CONTRAINTES
- Ne JAMAIS mentionner l'IA, les modèles, le fait que le texte est généré.
- Ne pas inventer de données légales, de chiffres précis, ni de coordonnées.
- Tu peux parler de "formulaire de contact", "WhatsApp", "appel téléphonique" sans donner de numéro.
- Style : phrases claires, paragraphes courts (3-4 lignes max), ton premium, rassurant, orienté bénéfices clients.

STRUCTURE ATTENDUE (MARKDOWN OU HTML SIMPLE)
- Un seul H1 au début (titre principal).
- H2 et H3 adaptés au template :
  - pour un service : présentation, avantages, déroulé, preuves, FAQ.
  - pour une page locale : service + contexte local, zones desservies, bénéfices spécifiques à la ville/zone.
  - pour une page tarifs : explication des offres et conditions sans inventer de chiffres précis.
  - pour une page contact : mise en avant des actions de contact et du process.
- 1 à 3 appels à l'action clairs dans le texte (ex : "Demander un devis", "Réserver", "Nous contacter").
- Une section FAQ avec 5 questions/réponses utiles (ou davantage pour un template de type FAQ).
- Conclusion courte qui rappelle le bénéfice principal et invite à l'action.

FOCUS SERVICES LOCAUX (quand applicable)
- Mettre en avant : gain de temps, confort, discrétion, sécurité, parfaite connaissance des itinéraires, gestion des trajets complexes si pertinent.
- Utiliser naturellement les villes et zones : ${profile.zones}.

SORTIE ATTENDUE
- Contenu texte uniquement, en markdown ou HTML simple.
- PAS de JSON.
- PAS de balises \`\`\` ni de code.
- Le texte doit pouvoir être utilisé tel quel comme corps de page.
`.trim();
}
