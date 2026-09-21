import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { notifyAdminCreditOrder } from "@/lib/mail/credits-notify";
import { requireDbUser } from "@/lib/session-user";
import { getPack } from "@/lib/studio/packs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }

  let body: { orderId?: string; smsRef?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const orderId = String(body.orderId || "").trim();
  if (!orderId) {
    return NextResponse.json(
      { ok: false, message: "Commande manquante." },
      { status: 400 }
    );
  }

  const smsRef = String(body.smsRef || "")
    .trim()
    .slice(0, 120);

  const prisma = await ensureDb();
  const order = await prisma.creditOrder.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== auth.user.id) {
    return NextResponse.json(
      { ok: false, message: "Commande introuvable." },
      { status: 404 }
    );
  }

  if (order.status === "APPROVED") {
    return NextResponse.json({
      ok: true,
      order,
      message: "Cette commande est déjà validée.",
    });
  }
  if (order.status === "REJECTED") {
    return NextResponse.json(
      { ok: false, message: "Cette commande a été refusée. Créez-en une nouvelle." },
      { status: 400 }
    );
  }

  const updated = await prisma.creditOrder.update({
    where: { id: order.id },
    data: {
      status: "SUBMITTED",
      ...(smsRef ? { smsRef } : {}),
    },
  });

  await prisma.conversion.create({
    data: {
      type: "mm_order_submitted",
      meta: JSON.stringify({
        orderId: order.id,
        code: order.code,
        userId: auth.user.id,
        smsRef: smsRef || null,
      }),
    },
  });

  const pack = getPack(order.packId);
  // Prefer this alert — user marked « J’ai payé » (actionable for admin)
  void notifyAdminCreditOrder({
    event: "paid_pending",
    code: updated.code,
    packName: pack?.name ?? order.packId,
    amountFcfa: updated.amountFcfa,
    status: updated.status,
    userEmail: auth.user.email,
    smsRef: updated.smsRef,
  }).catch((err) => console.error("[credits-notify] unexpected", err));

  return NextResponse.json({
    ok: true,
    order: updated,
    message:
      "Merci. Un admin vérifiera votre paiement et créditera votre compte.",
  });
}
