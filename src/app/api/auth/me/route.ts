import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, user: null });
  }
  return NextResponse.json({
    ok: true,
    user: { email: session.email, role: session.role },
  });
}
