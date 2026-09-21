import { NextResponse } from "next/server";
import {
  applySessionCookie,
  createSessionToken,
  hashPassword,
  hashResetToken,
} from "@/lib/auth";
import { ensureDb } from "@/lib/db";

export async function POST(request: Request) {
  let body: { token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 }
    );
  }

  const rawToken = String(body.token || "").trim();
  const password = String(body.password || "");

  if (!rawToken || rawToken.length < 32) {
    return NextResponse.json(
      { ok: false, message: "Lien invalide ou expiré." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, message: "Mot de passe : 8 caractères minimum." },
      { status: 400 }
    );
  }

  try {
    const prisma = await ensureDb();
    const tokenHash = hashResetToken(rawToken);
    const user = await prisma.user.findFirst({
      where: {
        passwordResetHash: tokenHash,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Lien invalide ou expiré. Demandez un nouveau lien depuis « Mot de passe oublié ».",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetHash: null,
        passwordResetExpires: null,
      },
    });

    const sessionToken = await createSessionToken({
      sub: updated.id,
      email: updated.email,
      role: updated.role,
    });
    const res = NextResponse.json({
      ok: true,
      message: "Mot de passe mis à jour. Vous êtes connecté·e.",
      role: updated.role,
    });
    applySessionCookie(res, sessionToken);
    return res;
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Réinitialisation indisponible. Réessayez plus tard.",
      },
      { status: 503 }
    );
  }
}
