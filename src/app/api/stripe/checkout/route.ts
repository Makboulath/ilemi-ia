import { NextResponse } from "next/server";
import { requireDbUser } from "@/lib/session-user";
import { ensureDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const priceId = process.env.STRIPE_PRICE_ID_MONTHLY?.trim();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  if (!secret || !priceId) {
    return NextResponse.json(
      {
        ok: false,
        code: "STRIPE_UNAVAILABLE",
        message: "Paiement bientôt disponible.",
      },
      { status: 503 }
    );
  }

  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("success_url", `${siteUrl}/abonnement?success=1`);
  params.set("cancel_url", `${siteUrl}/abonnement?cancel=1`);
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("client_reference_id", auth.user.id);
  params.set("customer_email", auth.user.email);
  params.set("metadata[userId]", auth.user.id);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      { ok: false, message: `Stripe erreur: ${text.slice(0, 200)}` },
      { status: 502 }
    );
  }

  const session = (await res.json()) as { id: string; url?: string };
  await ensureDb();
  return NextResponse.json({ ok: true, url: session.url, id: session.id });
}
