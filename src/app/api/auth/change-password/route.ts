import { NextResponse } from "next/server";
import {
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { ensureDb } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, message: "Non authentifié." },
      { status: 401 }
    );
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 }
    );
  }

  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");

  if (!currentPassword || newPassword.length < 8) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Mot de passe actuel requis ; nouveau mot de passe : 8 caractères minimum.",
      },
      { status: 400 }
    );
  }

  try {
    const prisma = await ensureDb();
    const user =
      session.sub === "env-admin"
        ? await prisma.user.findUnique({ where: { email: session.email } })
        : await prisma.user.findUnique({ where: { id: session.sub } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Compte introuvable." },
        { status: 404 }
      );
    }

    // Env-admin may have placeholder hash "!" — allow ADMIN_PASSWORD match
    let currentOk = false;
    if (user.passwordHash && user.passwordHash !== "!") {
      currentOk = await verifyPassword(currentPassword, user.passwordHash);
    }
    if (!currentOk) {
      const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || "";
      if (
        user.email === adminEmail &&
        adminPassword &&
        currentPassword === adminPassword
      ) {
        currentOk = true;
      }
    }
    if (!currentOk) {
      return NextResponse.json(
        { ok: false, message: "Mot de passe actuel incorrect." },
        { status: 401 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetHash: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Mot de passe mis à jour.",
    });
  } catch (err) {
    console.error("[change-password]", err);
    return NextResponse.json(
      { ok: false, message: "Impossible de changer le mot de passe." },
      { status: 503 }
    );
  }
}
