import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { notifyAdminCreditOrder } from "@/lib/mail/credits-notify";
import { requireDbUser } from "@/lib/session-user";
import {
  getPack,
  makeOrderCode,
  merchantNumber,
  moovUssd,
} from "@/lib/studio/credits";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  const prisma = await ensureDb();
  const orders = await prisma.creditOrder.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({
    ok: true,
    merchantNumber: merchantNumber(),
    orders,
  });
}

export async function POST(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }

  let body: { packId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const pack = getPack(String(body.packId || ""));
  if (!pack) {
    return NextResponse.json(
      { ok: false, message: "Pack inconnu." },
      { status: 400 }
    );
  }

  const prisma = await ensureDb();
  const merchant = merchantNumber();

  let order = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = makeOrderCode();
    try {
      order = await prisma.creditOrder.create({
        data: {
          code,
          userId: auth.user.id,
          packId: pack.id,
          amountFcfa: pack.amountFcfa,
          imageCredits: pack.imageCredits,
          videoCredits: pack.videoCredits,
          status: "PENDING",
          merchantNumber: merchant,
        },
      });
      break;
    } catch {
      /* unique code collision — retry */
    }
  }

  if (!order) {
    return NextResponse.json(
      { ok: false, message: "Impossible de créer la commande." },
      { status: 500 }
    );
  }

  await prisma.conversion.create({
    data: {
      type: "mm_order_created",
      meta: JSON.stringify({
        orderId: order.id,
        code: order.code,
        packId: pack.id,
        userId: auth.user.id,
      }),
    },
  });

  // Admin alert — never block the user response
  void notifyAdminCreditOrder({
    event: "created",
    code: order.code,
    packName: pack.name,
    amountFcfa: order.amountFcfa,
    status: order.status,
    userEmail: auth.user.email,
  }).catch((err) => console.error("[credits-notify] unexpected", err));

  return NextResponse.json({
    ok: true,
    order,
    payment: {
      merchantNumber: merchant,
      amountFcfa: pack.amountFcfa,
      code: order.code,
      moovUssd: moovUssd(pack.amountFcfa, merchant),
    },
  });
}
