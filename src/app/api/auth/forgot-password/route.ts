import { NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/auth";
import { ensureDb } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail/password-reset";

const GENERIC_OK =
  "Si un compte existe pour cet email, un lien de réinitialisation vient d’être envoyé. Vérifiez aussi vos spams.";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 }
    );
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, message: "Email invalide." },
      { status: 400 }
    );
  }

  // Always same success message (no user enumeration)
  try {
    const prisma = await ensureDb();
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const { rawToken, tokenHash, expiresAt } = createPasswordResetToken();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetHash: tokenHash,
          passwordResetExpires: expiresAt,
        },
      });
      const mail = await sendPasswordResetEmail(user.email, rawToken);
      if (!mail.sent) {
        console.info(
          "[forgot-password] email not sent",
          mail.skipped,
          user.email
        );
      }
    }
  } catch (err) {
    console.error("[forgot-password]", err);
    // Still return generic OK — avoid leaking DB errors as "user exists"
  }

  return NextResponse.json({ ok: true, message: GENERIC_OK });
}
