import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  let body: { plan?: string; note?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* ok */
  }
  const prisma = await ensureDb();
  await prisma.conversion.create({
    data: {
      type: "sub_intent",
      meta: JSON.stringify({
        userId: auth.user.id,
        email: auth.user.email,
        plan: body.plan || "monthly",
        note: body.note || "",
      }),
    },
  });
  return NextResponse.json({ ok: true });
}
