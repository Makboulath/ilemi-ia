import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import { getPathById } from "@/lib/apprendre/content";
import { buildCertificatePdf } from "@/lib/apprendre/certificate-pdf";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  const pathId = new URL(request.url).searchParams.get("path") || "";
  const path = getPathById(pathId);
  if (!path) {
    return NextResponse.json({ ok: false, message: "Parcours inconnu." }, { status: 400 });
  }

  const prisma = await ensureDb();
  const cert = await prisma.certificate.findUnique({
    where: { userId_pathId: { userId: auth.user.id, pathId } },
  });
  if (!cert) {
    return NextResponse.json(
      { ok: false, message: "Aucun certificat pour ce parcours." },
      { status: 404 }
    );
  }

  const pdf = await buildCertificatePdf({
    learnerName: cert.learnerName,
    pathLabel: path.label,
    code: cert.code,
    issuedAt: cert.issuedAt,
  });

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificat-ilemi-${pathId}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
