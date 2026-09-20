import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import { ensureWallet, snapshot } from "@/lib/studio/credits";

export const dynamic = "force-dynamic";

/**
 * Grant +1 credit after a rewarded ad.
 * Real AdSense reward verification is limited client-side; we accept
 * a client signal when AdSense is configured, or ALLOW_FAKE_ADS=true in dev.
 */
export async function POST(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }

  const adsenseConfigured = !!(
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT &&
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_REWARD
  );
  const allowFake = process.env.ALLOW_FAKE_ADS === "true";

  let body: { fake?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    /* empty body ok */
  }

  if (!adsenseConfigured) {
    if (!(allowFake && body.fake)) {
      return NextResponse.json(
        {
          ok: false,
          code: "ADS_UNAVAILABLE",
          message: "Pub bientôt disponible.",
        },
        { status: 503 }
      );
    }
  }

  const prisma = await ensureDb();
  await ensureWallet(prisma, auth.user.id);
  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data: { credits: { increment: 1 } },
  });
  await prisma.conversion.create({
    data: {
      type: "ad_reward",
      meta: JSON.stringify({ fake: !!body.fake, userId: auth.user.id }),
    },
  });

  return NextResponse.json({ ok: true, wallet: snapshot(updated) });
}
