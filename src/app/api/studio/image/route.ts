import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import {
  IMAGE_CREDIT_COST,
  ensureWallet,
  snapshot,
} from "@/lib/studio/credits";
import { generateImage, hasImageProvider } from "@/lib/studio/providers";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }

  let body: { prompt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }
  const prompt = String(body.prompt || "").trim().slice(0, 800);
  if (prompt.length < 3) {
    return NextResponse.json({ ok: false, message: "Prompt trop court." }, { status: 400 });
  }

  if (!hasImageProvider()) {
    return NextResponse.json(
      {
        ok: false,
        code: "NO_PROVIDER",
        message:
          "Génération image indisponible : configurez FAL_KEY, OPENAI_API_KEY ou REPLICATE_API_TOKEN.",
      },
      { status: 503 }
    );
  }

  const prisma = await ensureDb();
  const user = await ensureWallet(prisma, auth.user.id);
  if (user.credits < IMAGE_CREDIT_COST) {
    return NextResponse.json(
      {
        ok: false,
        code: "NO_CREDITS",
        message: "Crédits insuffisants.",
        wallet: snapshot(user),
      },
      { status: 402 }
    );
  }

  try {
    const result = await generateImage(prompt);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: IMAGE_CREDIT_COST } },
    });
    await prisma.studioGeneration.create({
      data: {
        userId: user.id,
        type: "image",
        prompt,
        url: result.url,
        meta: JSON.stringify({ provider: result.provider }),
      },
    });
    return NextResponse.json({
      ok: true,
      url: result.url,
      provider: result.provider,
      wallet: snapshot(updated),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur génération";
    return NextResponse.json(
      { ok: false, message: `Échec génération image (${msg}).` },
      { status: 502 }
    );
  }
}
