import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import {
  IMAGE_CREDIT_COST,
  ensureWallet,
  snapshot,
} from "@/lib/studio/credits";
import {
  generateImage,
  hasImageProvider,
  pollinationsImageUrl,
} from "@/lib/studio/providers";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
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
        message: "Génération image indisponible pour le moment.",
      },
      { status: 503 }
    );
  }

  const auth = await requireDbUser();

  if (!auth) {
    const result = pollinationsImageUrl(prompt);
    return NextResponse.json({
      ok: true,
      url: result.url,
      provider: result.provider,
      guest: true,
    });
  }

  try {
    const prisma = await ensureDb();
    const user = await ensureWallet(prisma, auth.user.id);
    if (user.credits < IMAGE_CREDIT_COST) {
      const result = pollinationsImageUrl(prompt);
      return NextResponse.json({
        ok: true,
        url: result.url,
        provider: result.provider,
        wallet: snapshot(user),
        note: "Mode gratuit Pollinations HD (crédits épuisés).",
      });
    }

    // Try Gemini (if quota), else improved Pollinations
    const result = await generateImage(prompt, { preferFree: false });
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: IMAGE_CREDIT_COST } },
    });
    await prisma.studioGeneration.create({
      data: {
        userId: user.id,
        type: "image",
        prompt,
        url: result.url.slice(0, 2000),
        meta: JSON.stringify({ provider: result.provider }),
      },
    });
    return NextResponse.json({
      ok: true,
      url: result.url,
      provider: result.provider,
      wallet: snapshot(updated),
    });
  } catch {
    const result = pollinationsImageUrl(prompt);
    return NextResponse.json({
      ok: true,
      url: result.url,
      provider: result.provider,
      guest: true,
      note: "Mode démo HD (base temporaire indisponible).",
    });
  }
}
