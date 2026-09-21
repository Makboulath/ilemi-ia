/**
 * Admin email alerts for Mobile Money credit orders (Resend).
 * Graceful no-op when RESEND_API_KEY is missing — order APIs must not fail.
 */

export type CreditOrderNotifyPayload = {
  event: "created" | "paid_pending";
  code: string;
  packName: string;
  amountFcfa: number;
  status: string;
  userEmail: string;
  smsRef?: string | null;
};

const DEFAULT_NOTIFY = "makboulathraoufou@gmail.com";
const ADMIN_URL = "https://ilemi-ia.vercel.app/admin";

function notifyTo(): string {
  return (
    process.env.CREDITS_NOTIFY_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    DEFAULT_NOTIFY
  );
}

function statusLabelFr(
  status: string,
  event: CreditOrderNotifyPayload["event"]
): string {
  if (event === "paid_pending" || status === "SUBMITTED") {
    return "payé — en attente de validation (SUBMITTED)";
  }
  if (status === "PENDING") return "en attente de paiement (PENDING)";
  return status;
}

function buildSubject(p: CreditOrderNotifyPayload): string {
  if (p.event === "paid_pending") {
    return `[ilémi.IA] Paiement signalé — ${p.code} · ${p.amountFcfa} XOF`;
  }
  return `[ilémi.IA] Nouvelle commande crédits — ${p.code} · ${p.amountFcfa} XOF`;
}

function buildBodies(p: CreditOrderNotifyPayload): {
  text: string;
  html: string;
} {
  const label = statusLabelFr(p.status, p.event);
  const headline =
    p.event === "paid_pending"
      ? "Un utilisateur a marqué « J’ai payé »."
      : "Une nouvelle commande de crédits Mobile Money a été créée.";

  const lines = [
    headline,
    "",
    `Code commande : ${p.code}`,
    `Pack : ${p.packName}`,
    `Montant : ${p.amountFcfa} XOF`,
    `Statut : ${label}`,
    `Email utilisateur : ${p.userEmail}`,
  ];
  if (p.smsRef) lines.push(`Réf. SMS : ${p.smsRef}`);
  lines.push("", `Admin : ${ADMIN_URL}`);

  const text = lines.join("\n");

  const html = `
    <p>${headline}</p>
    <ul>
      <li><strong>Code commande :</strong> ${escapeHtml(p.code)}</li>
      <li><strong>Pack :</strong> ${escapeHtml(p.packName)}</li>
      <li><strong>Montant :</strong> ${p.amountFcfa} XOF</li>
      <li><strong>Statut :</strong> ${escapeHtml(label)}</li>
      <li><strong>Email utilisateur :</strong> ${escapeHtml(p.userEmail)}</li>
      ${
        p.smsRef
          ? `<li><strong>Réf. SMS :</strong> ${escapeHtml(p.smsRef)}</li>`
          : ""
      }
    </ul>
    <p><a href="${ADMIN_URL}">Ouvrir l’admin</a></p>
  `.trim();

  return { text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Fire-and-forget safe: never throws to the caller.
 * Returns whether an email was attempted/accepted (for tests/logs).
 */
export async function notifyAdminCreditOrder(
  payload: CreditOrderNotifyPayload
): Promise<{ sent: boolean; skipped?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info(
      "[credits-notify] RESEND_API_KEY missing — skip email",
      payload.event,
      payload.code
    );
    return { sent: false, skipped: "no_api_key" };
  }

  const to = notifyTo();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "ilémi.IA <onboarding@resend.dev>";
  const subject = buildSubject(payload);
  const { text, html } = buildBodies(payload);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        "[credits-notify] Resend error",
        res.status,
        body.slice(0, 500),
        payload.code
      );
      return { sent: false, skipped: "resend_error" };
    }

    console.info(
      "[credits-notify] sent",
      payload.event,
      payload.code,
      "→",
      to
    );
    return { sent: true };
  } catch (err) {
    console.error("[credits-notify] send failed", err);
    return { sent: false, skipped: "exception" };
  }
}
