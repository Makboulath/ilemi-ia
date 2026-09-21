import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import { ensureWallet, snapshot } from "@/lib/studio/credits";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const auth = await requireDbUser();
  if (!auth) return null;
  if (auth.session.role !== "ADMIN" && auth.user.role !== "ADMIN") return null;
  return auth;
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Accès refusé." }, { status: 403 });
  }

  const prisma = await ensureDb();
  const orders = await prisma.creditOrder.findMany({
    where: { status: { in: ["PENDING", "SUBMITTED"] } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { id: true, email: true, displayName: true } },
    },
  });

  return NextResponse.json({ ok: true, orders });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Accès refusé." }, { status: 403 });
  }

  let body: { orderId?: string; action?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const orderId = String(body.orderId || "").trim();
  const action = String(body.action || "").trim().toLowerCase();
  const note = String(body.note || "").trim().slice(0, 500);

  if (!orderId || (action !== "approve" && action !== "reject")) {
    return NextResponse.json(
      { ok: false, message: "Paramètres invalides." },
      { status: 400 }
    );
  }

  const prisma = await ensureDb();
  const order = await prisma.creditOrder.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json(
      { ok: false, message: "Commande introuvable." },
      { status: 404 }
    );
  }

  if (order.status === "APPROVED" || order.status === "REJECTED") {
    return NextResponse.json(
      { ok: false, message: `Commande déjà ${order.status.toLowerCase()}.` },
      { status: 400 }
    );
  }

  if (action === "reject") {
    const updated = await prisma.creditOrder.update({
      where: { id: order.id },
      data: {
        status: "REJECTED",
        reviewedBy: auth.user.id,
        reviewedAt: new Date(),
        reviewNote: note || null,
      },
    });
    await prisma.conversion.create({
      data: {
        type: "mm_order_rejected",
        meta: JSON.stringify({
          orderId: order.id,
          code: order.code,
          by: auth.user.id,
        }),
      },
    });
    return NextResponse.json({ ok: true, order: updated });
  }

  // approve — grant imageCredits → User.credits, videoCredits → User.videoCredits
  await ensureWallet(prisma, order.userId);

  const [updatedOrder, user] = await prisma.$transaction([
    prisma.creditOrder.update({
      where: { id: order.id },
      data: {
        status: "APPROVED",
        reviewedBy: auth.user.id,
        reviewedAt: new Date(),
        reviewNote: note || null,
      },
    }),
    prisma.user.update({
      where: { id: order.userId },
      data: {
        credits: { increment: order.imageCredits },
        videoCredits: { increment: order.videoCredits },
      },
    }),
  ]);

  await prisma.conversion.create({
    data: {
      type: "mm_order_approved",
      meta: JSON.stringify({
        orderId: order.id,
        code: order.code,
        by: auth.user.id,
        imageCredits: order.imageCredits,
        videoCredits: order.videoCredits,
        userId: order.userId,
      }),
    },
  });

  return NextResponse.json({
    ok: true,
    order: updatedOrder,
    wallet: snapshot(user),
  });
}
