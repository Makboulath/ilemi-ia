/**
 * Thin Resend helper — graceful no-op when RESEND_API_KEY is missing.
 */

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Log tag, e.g. password-reset */
  tag?: string;
};

export async function sendResendEmail(
  input: SendEmailInput
): Promise<{ sent: boolean; skipped?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info(
      `[mail${input.tag ? `:${input.tag}` : ""}] RESEND_API_KEY missing — skip`,
      input.subject
    );
    return { sent: false, skipped: "no_api_key" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "ilémi.IA <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        `[mail${input.tag ? `:${input.tag}` : ""}] Resend error`,
        res.status,
        body.slice(0, 500)
      );
      return { sent: false, skipped: "resend_error" };
    }

    console.info(
      `[mail${input.tag ? `:${input.tag}` : ""}] sent →`,
      input.to,
      input.subject
    );
    return { sent: true };
  } catch (err) {
    console.error(`[mail${input.tag ? `:${input.tag}` : ""}] send failed`, err);
    return { sent: false, skipped: "exception" };
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://ilemi-ia.vercel.app"
  );
}
