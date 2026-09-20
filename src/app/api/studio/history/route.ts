import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  const prisma = await ensureDb();
  const items = await prisma.studioGeneration.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json({
    ok: true,
    items: items.map((i) => ({
      id: i.id,
      type: i.type,
      prompt: i.prompt,
      url: i.url,
      createdAt: i.createdAt,
    })),
  });
}
