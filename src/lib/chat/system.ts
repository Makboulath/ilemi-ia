import { LINKS } from "@/lib/constants";

export const CHAT_MODEL = "llama-3.3-70b-versatile";

export const CHAT_SYSTEM_PROMPT = `Tu es l'assistant chaleureux d'Ilémi.IA, une maison IA francophone accessible. Ton objectif : évaluer en 3-4 échanges courts le besoin et le niveau de l'utilisateur, puis lui recommander l'offre la plus adaptée.

CATALOGUE (offres actuelles) :
- La Maison : Atelier découverte ; Parcours « Créer avec l'IA » (offre phare)
- Entreprises : Diagnostic IA + process 4 étapes (diagnostic → plan → mise en œuvre → autonomie)
- Agents IA : agents sur mesure uniquement

Liens utiles :
- Calendly : ${LINKS.calendly}
- WhatsApp : ${LINKS.whatsapp}
- Email : ${LINKS.email}

RÈGLES : Réponds en français, max 3 phrases. Sois chaleureux et direct. Commence par demander qui est l'utilisateur (particulier / entrepreneur / organisation). Après 3-4 questions, fais une recommandation claire et invite à réserver sur Calendly.`;

export const CHAT_WELCOME =
  "Bonjour ! Ravi de vous accueillir chez Ilémi.IA. Pour mieux vous orienter : êtes-vous plutôt un particulier qui souhaite apprendre l'IA, un entrepreneur, ou une organisation ?";

/** Offline keyword fallback when Groq is unavailable. */
export function offlineReply(
  userText: string,
  priorUserCount: number
): string {
  const n = userText.toLowerCase();
  if (/prix|tarif|combien|coût|cout|cher/i.test(n)) {
    return `Les tarifs varient selon l'offre et votre situation. Pour un devis précis, réservez un appel gratuit (30 min) : ${LINKS.calendly}`;
  }
  if (/agent|automatisa|workflow|bot/i.test(n)) {
    return `Notre pilier Agents IA propose des agents sur mesure pour votre activité. Décrivez votre cas d'usage, ou réservez : ${LINKS.calendly}`;
  }
  if (/apprendre|débutant|formation|comprendre|curieux|étudiant|particulier|freelance/i.test(n)) {
    return `Parfait pour La Maison ! L'Atelier découverte est idéal pour commencer, et le Parcours « Créer avec l'IA » vous accompagne jusqu'à un livrable. On en parle ? ${LINKS.calendly}`;
  }
  if (/entreprise|pme|organisation|société|boite|boîte|diagnostic/i.test(n)) {
    return `Pour les entreprises, on commence souvent par un Diagnostic IA pour voir où l'IA fait vraiment gagner du temps. Réservez 30 min : ${LINKS.calendly}`;
  }
  if (/bonjour|salut|hello|bonsoir|hey/i.test(n) || priorUserCount === 0) {
    return CHAT_WELCOME;
  }
  if (priorUserCount >= 3) {
    return `Je vous recommande de clarifier ça en 30 minutes gratuites avec l'équipe. Réservez ici : ${LINKS.calendly}`;
  }
  return `Merci ! Pour mieux cibler : vous êtes plutôt intéressé·e par apprendre (La Maison), un diagnostic entreprise, ou un agent IA sur mesure ?`;
}
