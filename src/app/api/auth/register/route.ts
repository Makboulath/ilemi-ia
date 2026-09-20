import { NextResponse } from "next/server";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth";
import { ensureDb } from "@/lib/db";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 }
    );
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, message: "Email invalide." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, message: "Mot de passe : 8 caractères minimum." },
      { status: 400 }
    );
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (adminEmail && email === adminEmail) {
    return NextResponse.json(
      {
        ok: false,
        message: "Cet email est réservé. Connectez-vous via Connexion.",
      },
      { status: 400 }
    );
  }

  try {
    const prisma = await ensureDb();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, role: "MEMBER" },
    });

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, role: user.role, email: user.email });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Inscription temporairement indisponible. Réessayez plus tard.",
      },
      { status: 503 }
    );
  }
}
