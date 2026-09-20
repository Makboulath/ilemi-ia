import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { ensureDb } from "@/lib/db";
import { requireDbUser } from "@/lib/session-user";
import {
  PATH_QUIZZES,
  QUIZ_PASS_SCORE,
  QUIZ_TOTAL,
  getPathById,
} from "@/lib/apprendre/content";
import { shuffleQuizQuestions } from "@/lib/apprendre/shuffle";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  const pathId = new URL(request.url).searchParams.get("path") || "";
  const path = getPathById(pathId);
  const bank = PATH_QUIZZES[pathId as keyof typeof PATH_QUIZZES];
  if (!path || !bank) {
    return NextResponse.json({ ok: false, message: "Parcours inconnu." }, { status: 400 });
  }

  const prisma = await ensureDb();
  const progress = await prisma.courseProgress.findUnique({
    where: { userId_pathId: { userId: auth.user.id, pathId } },
  });
  let completed: string[] = [];
  try {
    completed = JSON.parse(progress?.completedLessonIds || "[]");
  } catch {
    completed = [];
  }
  const allDone = path.lessons.every((l) => completed.includes(l.id));
  if (!allDone) {
    return NextResponse.json(
      {
        ok: false,
        locked: true,
        message: "Terminez toutes les leçons pour débloquer le quiz.",
        completedCount: completed.length,
        totalLessons: path.lessons.length,
      },
      { status: 403 }
    );
  }

  const shuffled = shuffleQuizQuestions(bank).slice(0, QUIZ_TOTAL);
  // Do not send `correct` / `explain` until submit — strip answers
  const questions = shuffled.map((q) => ({
    id: q.id,
    q: q.q,
    choices: q.choices,
  }));

  // Store correct map in a short-lived signed-ish token (opaque base64 of answers)
  const answerKey = Buffer.from(
    JSON.stringify(
      shuffled.map((q) => ({ id: q.id, correct: q.correct, explain: q.explain }))
    ),
    "utf8"
  ).toString("base64url");

  return NextResponse.json({
    ok: true,
    pathId,
    pathLabel: path.label,
    passScore: QUIZ_PASS_SCORE,
    total: QUIZ_TOTAL,
    questions,
    attemptToken: answerKey,
  });
}

export async function POST(request: Request) {
  const auth = await requireDbUser();
  if (!auth) {
    return NextResponse.json({ ok: false, message: "Non authentifié." }, { status: 401 });
  }
  let body: {
    pathId?: string;
    attemptToken?: string;
    answers?: { id: string; choice: number }[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const pathId = String(body.pathId || "");
  const path = getPathById(pathId);
  if (!path || !PATH_QUIZZES[pathId as keyof typeof PATH_QUIZZES]) {
    return NextResponse.json({ ok: false, message: "Parcours inconnu." }, { status: 400 });
  }

  let key: { id: string; correct: number; explain: string }[] = [];
  try {
    key = JSON.parse(
      Buffer.from(String(body.attemptToken || ""), "base64url").toString("utf8")
    );
  } catch {
    return NextResponse.json({ ok: false, message: "Tentative invalide." }, { status: 400 });
  }

  const answers = Array.isArray(body.answers) ? body.answers : [];
  let score = 0;
  const details = key.map((k) => {
    const ans = answers.find((a) => a.id === k.id);
    const ok = ans != null && Number(ans.choice) === k.correct;
    if (ok) score += 1;
    return {
      id: k.id,
      correct: k.correct,
      explain: k.explain,
      yourChoice: ans?.choice ?? null,
      ok,
    };
  });

  const passed = score >= QUIZ_PASS_SCORE;
  const prisma = await ensureDb();
  await prisma.quizAttempt.create({
    data: {
      userId: auth.user.id,
      pathId,
      score,
      passed,
    },
  });

  let certificate: { code: string; downloadUrl: string } | null = null;
  if (passed) {
    const learnerName =
      auth.user.displayName?.trim() ||
      auth.user.email.split("@")[0] ||
      auth.user.email;
    const existing = await prisma.certificate.findUnique({
      where: { userId_pathId: { userId: auth.user.id, pathId } },
    });
    if (existing) {
      certificate = {
        code: existing.code,
        downloadUrl: `/api/apprendre/certificate?path=${encodeURIComponent(pathId)}`,
      };
    } else {
      const code = `ILEMI-${pathId.toUpperCase()}-${randomBytes(4).toString("hex").toUpperCase()}`;
      const cert = await prisma.certificate.create({
        data: {
          userId: auth.user.id,
          pathId,
          code,
          learnerName,
        },
      });
      certificate = {
        code: cert.code,
        downloadUrl: `/api/apprendre/certificate?path=${encodeURIComponent(pathId)}`,
      };
    }
  }

  return NextResponse.json({
    ok: true,
    score,
    total: key.length,
    passed,
    passScore: QUIZ_PASS_SCORE,
    details,
    certificate,
  });
}
