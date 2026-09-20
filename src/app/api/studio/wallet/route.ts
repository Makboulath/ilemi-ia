import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import { ensureWallet, snapshot } from "@/lib/studio/credits";
import { hasImageProvider, hasVideoProvider } from "@/lib/studio/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  const prisma = await ensureDb();
  const user = await ensureWallet(prisma, auth.user.id);
  return NextResponse.json({
    ok: true,
    wallet: snapshot(user),
    providers: {
      image: hasImageProvider(),
      video: hasVideoProvider(),
    },
    adsense: {
      configured: !!(
        process.env.NEXT_PUBLIC_ADSENSE_CLIENT &&
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_REWARD
      ),
      allowFake: process.env.ALLOW_FAKE_ADS === "true",
    },
  });
}
