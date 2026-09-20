import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { ensureDb } from "@/lib/db";
import { PRO_MONTHLY_CREDITS } from "@/lib/studio/credits";

export const dynamic = "force-dynamic";

function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string
): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k, v];
    })
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const signed = `${t}.${payload}`;
  const expected = createHmac("sha256", secret).update(signed).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const payload = await request.text();

  if (secret) {
    const sig = request.headers.get("stripe-signature");
    if (!verifyStripeSignature(payload, sig, secret)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // In prod without webhook secret, reject to avoid spoofing
    return NextResponse.json(
      { ok: false, message: "Webhook non configuré." },
      { status: 503 }
    );
  }

  let event: {
    type?: string;
    data?: {
      object?: {
        client_reference_id?: string;
        metadata?: { userId?: string };
        customer?: string;
      };
    };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "invoice.paid"
  ) {
    const obj = event.data?.object;
    const userId =
      obj?.metadata?.userId || obj?.client_reference_id || "";
    if (userId) {
      const prisma = await ensureDb();
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "PRO",
          credits: { increment: PRO_MONTHLY_CREDITS },
          ...(obj?.customer
            ? { stripeCustomerId: String(obj.customer) }
            : {}),
        },
      });
      await prisma.conversion.create({
        data: {
          type: "stripe_sub",
          meta: JSON.stringify({ userId, event: event.type }),
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
