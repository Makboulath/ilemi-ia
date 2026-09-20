import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";

export async function POST(request: Request) {
  let path = "/";
  try {
    const body = await request.json();
    path = String(body.path || "/").slice(0, 500);
  } catch {
    // ignore
  }

  // skip noisy paths
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.includes(".")
  ) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const prisma = await ensureDb();
    await prisma.pageView.create({ data: { path } });
  } catch {
    // analytics must never break the site
  }

  return NextResponse.json({ ok: true });
}
