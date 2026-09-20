import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import { getPathById } from "@/lib/apprendre/content";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const pathId = searchParams.get("path") || "";
  const prisma = await ensureDb();

  if (pathId) {
    const row = await prisma.courseProgress.findUnique({
      where: { userId_pathId: { userId: auth.user.id, pathId } },
    });
    const cert = await prisma.certificate.findUnique({
      where: { userId_pathId: { userId: auth.user.id, pathId } },
    });
    const lastPass = await prisma.quizAttempt.findFirst({
      where: { userId: auth.user.id, pathId, passed: true },
      orderBy: { createdAt: "desc" },
    });
    let completedLessonIds: string[] = [];
    try {
      completedLessonIds = JSON.parse(row?.completedLessonIds || "[]");
    } catch {
      completedLessonIds = [];
    }
    return NextResponse.json({
      ok: true,
      pathId,
      completedLessonIds,
      certificate: cert
        ? { code: cert.code, issuedAt: cert.issuedAt, learnerName: cert.learnerName }
        : null,
      passed: !!lastPass || !!cert,
    });
  }

  const rows = await prisma.courseProgress.findMany({
    where: { userId: auth.user.id },
  });
  const certs = await prisma.certificate.findMany({
    where: { userId: auth.user.id },
  });
  const progress: Record<string, string[]> = {};
  for (const row of rows) {
    try {
      progress[row.pathId] = JSON.parse(row.completedLessonIds || "[]");
    } catch {
      progress[row.pathId] = [];
    }
  }
  return NextResponse.json({
    ok: true,
    progress,
    certificates: certs.map((c) => ({
      pathId: c.pathId,
      code: c.code,
      issuedAt: c.issuedAt,
    })),
    email: auth.user.email,
    displayName: auth.user.displayName,
  });
}

export async function POST(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  let body: { pathId?: string; lessonId?: string; completed?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }
  const pathId = String(body.pathId || "");
  const lessonId = String(body.lessonId || "");
  const path = getPathById(pathId);
  if (!path || !path.lessons.some((l) => l.id === lessonId)) {
    return NextResponse.json({ ok: false, message: "Parcours ou leçon inconnu." }, { status: 400 });
  }

  const prisma = await ensureDb();
  const existing = await prisma.courseProgress.findUnique({
    where: { userId_pathId: { userId: auth.user.id, pathId } },
  });
  let ids: string[] = [];
  try {
    ids = JSON.parse(existing?.completedLessonIds || "[]");
  } catch {
    ids = [];
  }
  const set = new Set(ids);
  if (body.completed === false) set.delete(lessonId);
  else set.add(lessonId);
  const completedLessonIds = JSON.stringify(Array.from(set));

  const row = await prisma.courseProgress.upsert({
    where: { userId_pathId: { userId: auth.user.id, pathId } },
    create: {
      userId: auth.user.id,
      pathId,
      completedLessonIds,
    },
    update: { completedLessonIds },
  });

  return NextResponse.json({
    ok: true,
    completedLessonIds: JSON.parse(row.completedLessonIds),
  });
}
