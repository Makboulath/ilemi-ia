"use server";

export type ContactState = {
  ok: boolean;
  message: string;
  fallback?: boolean;
};

function getFormspreeId(): string | null {
  const id =
    process.env.FORMSPREE_ID?.trim() ||
    process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim() ||
    "";
  if (!id) return null;
  // Never treat an email address as a Formspree form ID
  if (id.includes("@")) return null;
  return id;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return {
      ok: false,
      message: "Merci de remplir au minimum votre nom, email et message.",
    };
  }

  const formId = getFormspreeId();
  if (!formId) {
    return {
      ok: false,
      fallback: true,
      message:
        "Le formulaire n'est pas encore configuré. Utilisez Calendly, WhatsApp ou l'email ci-dessous — on répond sous 24h.",
    };
  }

  try {
    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject: subject || "Contact ilémi.IA",
        message,
        _subject: subject || `Contact ilémi.IA — ${name}`,
      }),
    });

    if (!res.ok) {
      return {
        ok: false,
        fallback: true,
        message:
          "L'envoi a échoué. Réessayez plus tard, ou contactez-nous via Calendly, WhatsApp ou email.",
      };
    }

    try {
      const { ensureDb } = await import("@/lib/db");
      const prisma = await ensureDb();
      await prisma.conversion.create({
        data: { type: "contact_form", meta: email },
      });
    } catch {
      // tracking must not break contact
    }

    return {
      ok: true,
      message: "Message envoyé. Merci — on revient vers vous rapidement.",
    };
  } catch {
    return {
      ok: false,
      fallback: true,
      message:
        "Impossible d'envoyer le message pour le moment. Utilisez Calendly, WhatsApp ou l'email.",
    };
  }
}
