import { escapeHtml, sendResendEmail, siteBaseUrl } from "@/lib/mail/resend";

export async function sendPasswordResetEmail(
  to: string,
  rawToken: string
): Promise<{ sent: boolean; skipped?: string }> {
  const url = `${siteBaseUrl()}/reinitialiser-mot-de-passe?token=${encodeURIComponent(rawToken)}`;
  const subject = "Réinitialisation de votre mot de passe — ilémi.IA";
  const text = [
    "Bonjour,",
    "",
    "Vous avez demandé à réinitialiser votre mot de passe ilémi.IA.",
    "Ce lien expire dans 1 heure :",
    "",
    url,
    "",
    "Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.",
    "",
    "— L’équipe ilémi.IA",
  ].join("\n");

  const html = `
    <p>Bonjour,</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe <strong>ilémi.IA</strong>.</p>
    <p><a href="${escapeHtml(url)}">Choisir un nouveau mot de passe</a></p>
    <p style="color:#666;font-size:14px">Ce lien expire dans <strong>1 heure</strong>.</p>
    <p style="color:#666;font-size:14px">Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.</p>
    <p>— L’équipe ilémi.IA</p>
  `.trim();

  return sendResendEmail({
    to,
    subject,
    text,
    html,
    tag: "password-reset",
  });
}
