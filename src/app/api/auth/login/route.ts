import { NextResponse } from "next/server";
import {
  authenticate,
  applySessionCookie,
  createSessionToken,
} from "@/lib/auth";

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

  const email = String(body.email || "").trim();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Email et mot de passe requis." },
      { status: 400 }
    );
  }

  try {
    const session = await authenticate(email, password);
    if (!session) {
      return NextResponse.json(
        { ok: false, message: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(session);
    const res = NextResponse.json({
      ok: true,
      role: session.role,
      email: session.email,
    });
    applySessionCookie(res, token);
    return res;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Authentification indisponible (configuration serveur). Réessayez plus tard.",
      },
      { status: 503 }
    );
  }
}
