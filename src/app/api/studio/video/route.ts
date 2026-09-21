import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import {
  VIDEO_CREDIT_COST,
  VIDEO_DAILY_CAP,
  ensureWallet,
  snapshot,
  videosLeftToday,
} from "@/lib/studio/credits";
import { generateVideo, hasVideoProvider } from "@/lib/studio/providers";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

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
  const prompt = String(body.prompt || "").trim().slice(0, 500);
  if (prompt.length < 3) {
    return NextResponse.json({ ok: false, message: "Prompt trop court." }, { status: 400 });
  }

  if (!hasVideoProvider()) {
    return NextResponse.json(
      {
        ok: false,
        code: "NO_PROVIDER",
        message:
          "Génération vidéo indisponible : configurez FAL_KEY (fal.ai).",
      },
      { status: 503 }
    );
  }

  const prisma = await ensureDb();
  let user = await ensureWallet(prisma, auth.user.id);

  if (videosLeftToday(user) <= 0) {
    return NextResponse.json(
      {
        ok: false,
        code: "DAILY_CAP",
        message: `Limite atteinte : ${VIDEO_DAILY_CAP} vidéos / jour.`,
        wallet: snapshot(user),
      },
      { status: 429 }
    );
  }

  if (user.videoCredits < VIDEO_CREDIT_COST) {
    return NextResponse.json(
      {
        ok: false,
        code: "NO_CREDITS",
        message:
          "Crédits vidéo insuffisants. Achetez un pack Créateur ou Studio.",
        wallet: snapshot(user),
      },
      { status: 402 }
    );
  }

  try {
    const result = await generateVideo(prompt);
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        videoCredits: { decrement: VIDEO_CREDIT_COST },
        videoCountToday: { increment: 1 },
      },
    });
    await prisma.studioGeneration.create({
      data: {
        userId: user.id,
        type: "video",
        prompt,
        url: result.url,
        meta: JSON.stringify({ provider: result.provider }),
      },
    });
    return NextResponse.json({
      ok: true,
      url: result.url,
      provider: result.provider,
      wallet: snapshot(user),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur génération";
    return NextResponse.json(
      { ok: false, message: `Échec génération vidéo (${msg}).` },
      { status: 502 }
    );
  }
}
