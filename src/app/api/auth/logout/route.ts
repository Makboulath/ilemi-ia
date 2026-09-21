import { NextResponse } from "next/server";
import { clearSessionCookieOn } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearSessionCookieOn(res);
  return res;
}
