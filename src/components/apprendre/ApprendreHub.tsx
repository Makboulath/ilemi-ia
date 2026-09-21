"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LINKS } from "@/lib/constants";
import {
  LEARNING_PATHS,
  QUIZ_PASS_SCORE,
  QUIZ_TOTAL,
  allLessonIds,
  type LearningPath,
  type Lesson,
} from "@/lib/apprendre/content";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

type QuizQ = { id: string; q: string; choices: string[] };

export default function ApprendreHub() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [progress, setProgress] = useState<Record<string, string[]>>({});
  const [certs, setCerts] = useState<
    Record<string, { code: string; issuedAt: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [pathId, setPathId] = useState<LearningPath["id"]>("debutant");
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const reduce = useReducedMotion();

  const load = useCallback(async () => {
    try {
      const me = await fetch("/api/auth/me", { credentials: "same-origin" }).then(
        (r) => r.json(),
      );
      // Only bounce to login when the session cookie itself is missing/invalid.
      // Progress API failures (DB race, transient 5xx) must NOT look like logout.
      if (!me?.ok || !me?.user) {
        router.replace("/connexion?next=/apprendre");
        return;
      }
      setEmail(me.user.email || "");
      const data = await fetch("/api/apprendre/progress", {
        credentials: "same-origin",
      }).then((r) => r.json());
      if (!data.ok) {
        setSaveError(
          data.message ||
            "Impossible de charger la progression. Réessayez dans un instant.",
        );
        setProgress({});
        setCerts({});
        return;
      }
      setSaveError("");
      setProgress(data.progress || {});
      setDisplayName(data.displayName || "");
      const map: Record<string, { code: string; issuedAt: string }> = {};
      for (const c of data.certificates || []) {
        map[c.pathId] = { code: c.code, issuedAt: c.issuedAt };
      }
      setCerts(map);
    } catch {
      setSaveError("Erreur réseau — impossible de charger le hub.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const done = useMemo(() => {
    const s = new Set<string>();
    for (const ids of Object.values(progress)) {
      for (const id of ids) s.add(id);
    }
    return s;
  }, [progress]);

  const path = LEARNING_PATHS.find((p) => p.id === pathId)!;
  const pathDoneIds = progress[pathId] || [];
  const pathAllDone = path.lessons.every((l) => pathDoneIds.includes(l.id));
  const total = allLessonIds().length;
  const doneCount = useMemo(
    () => allLessonIds().filter((id) => done.has(id)).length,
    [done],
  );
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  async function toggleDone(lessonId: string) {
    const currently = pathDoneIds.includes(lessonId);
    setSaveError("");
    try {
      const res = await fetch("/api/apprendre/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathId,
          lessonId,
          completed: !currently,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setProgress((prev) => ({ ...prev, [pathId]: data.completedLessonIds }));
      } else {
        setSaveError(data.message || "Impossible d'enregistrer la progression.");
      }
    } catch {
      setSaveError("Erreur réseau — progression non enregistrée.");
    }
  }

  if (loading) {
    return (
      <div
        className="mx-auto max-w-[1200px] page-pad py-16 md:py-20"
        aria-busy="true"
        aria-live="polite"
      >
        <p className="sr-only">Chargement du hub…</p>
        <div className="skeleton h-4 w-28" />
        <div className="skeleton mt-4 h-10 w-72 max-w-full" />
        <div className="skeleton mt-3 h-16 w-full max-w-xl" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="skeleton h-36" />
          <div className="skeleton h-36" />
          <div className="skeleton h-36" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] page-pad py-14 md:py-20">
      <FadeIn>
        <p className="section-label">Espace membre</p>
        <h1 className="font-[family-name:var(--font-montserrat)] text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
          Apprendre avec Ilémi
        </h1>
        <p className="mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-ink/65">
          Parcours Débutant, Créateur ou Pro : leçons, quiz final (≥{" "}
          {QUIZ_PASS_SCORE}/{QUIZ_TOTAL}), certificat PDF. Progression
          sauvegardée{email ? ` pour ${email}` : ""}.
        </p>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-8">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink/70">Votre progression</p>
              <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold">
                {doneCount}/{total} leçons · {pct}%
              </p>
            </div>
            <p className="text-xs text-ink/45">
              Synchronisée en base
              {email ? ` · ${email}` : ""}
            </p>
          </div>
          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-ink/8"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progression globale : ${pct} pour cent`}
          >
            <motion.div
              className="h-full rounded-full bg-terracotta"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: reduce ? 0 : 0.4 }}
            />
          </div>
        </div>
      </FadeIn>

      <StaggerChildren className="mt-10 grid gap-4 md:grid-cols-3">
        {LEARNING_PATHS.map((p) => {
          const active = p.id === pathId;
          const pathDone = (progress[p.id] || []).length;
          const hasCert = !!certs[p.id];
          return (
            <StaggerItem key={p.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setPathId(p.id);
                  setOpenLesson(null);
                }}
                className={`card-lift w-full rounded-2xl border p-5 text-left transition sm:p-6 ${
                  active
                    ? "border-terracotta border-t-[3px] bg-navy text-cream"
                    : "border-ink/10 bg-white text-ink hover:border-ink/20"
                }`}
              >
                <p
                  className={`text-[0.7rem] font-medium uppercase tracking-[0.1em] ${
                    active ? "text-gold" : "text-terracotta"
                  }`}
                >
                  Parcours
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-montserrat)] text-xl font-bold">
                  {p.label}
                </h2>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    active ? "text-cream/65" : "text-ink/55"
                  }`}
                >
                  {p.tagline}
                </p>
                <p
                  className={`mt-4 text-xs ${
                    active ? "text-cream/45" : "text-ink/40"
                  }`}
                >
                  {pathDone}/{p.lessons.length} terminées
                  {hasCert ? " · Certificat ✓" : ""}
                </p>
              </button>
            </StaggerItem>
          );
        })}
      </StaggerChildren>

      <FadeIn className="mt-12" delay={0.05}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label !mb-1">Leçons · {path.label}</p>
            <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-bold">
              {path.tagline}
            </h3>
          </div>
          <Link
            href="/studio"
            className="text-sm font-medium text-terracotta underline-offset-2 hover:underline"
          >
            Explorer le Studio →
          </Link>
        </div>

        <div className="space-y-3">
          {path.lessons.map((lesson, i) => (
            <LessonAccordion
              key={lesson.id}
              lesson={lesson}
              index={i + 1}
              open={openLesson === lesson.id}
              onToggle={() =>
                setOpenLesson((cur) =>
                  cur === lesson.id ? null : lesson.id,
                )
              }
              isDone={pathDoneIds.includes(lesson.id)}
              onToggleDone={() => toggleDone(lesson.id)}
            />
          ))}
        </div>
        {saveError && (
          <p className="mt-3 text-sm text-terracotta" role="alert">
            {saveError}
          </p>
        )}
      </FadeIn>

      <FadeIn className="mt-10" delay={0.05}>
        <PathQuizPanel
          pathId={pathId}
          pathLabel={path.label}
          unlocked={pathAllDone}
          completedCount={pathDoneIds.length}
          totalLessons={path.lessons.length}
          existingCert={certs[pathId] || null}
          learnerHint={displayName || email}
          onCertified={(code, issuedAt) =>
            setCerts((prev) => ({
              ...prev,
              [pathId]: { code, issuedAt },
            }))
          }
        />
      </FadeIn>

      <FadeIn className="mt-14" delay={0.05}>
        <div className="rounded-2xl border border-ink/10 bg-navy p-7 text-cream md:p-10">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-gold">
            Passez à l&apos;action
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold tracking-tight">
            Envie d&apos;un accompagnement réel ?
          </h3>
          <p className="mt-3 max-w-xl text-cream/65">
            Atelier, parcours Créer avec l&apos;IA, ou diagnostic entreprise,
            on clarifie votre besoin en 30 minutes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Réserver sur Calendly
            </a>
            <Link
              href="/#offre"
              className="btn-ghost !border-cream/30 !text-cream"
            >
              Voir les offres
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function PathQuizPanel({
  pathId,
  pathLabel,
  unlocked,
  completedCount,
  totalLessons,
  existingCert,
  learnerHint,
  onCertified,
}: {
  pathId: LearningPath["id"];
  pathLabel: string;
  unlocked: boolean;
  completedCount: number;
  totalLessons: number;
  existingCert: { code: string; issuedAt: string } | null;
  learnerHint: string;
  onCertified: (code: string, issuedAt: string) => void;
}) {
  const [questions, setQuestions] = useState<QuizQ[]>([]);
  const [attemptToken, setAttemptToken] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    details: {
      id: string;
      correct: number;
      explain: string;
      yourChoice: number | null;
      ok: boolean;
    }[];
    certificate: { code: string; downloadUrl: string } | null;
  } | null>(null);
  const [error, setError] = useState("");

  async function startQuiz() {
    setError("");
    setResult(null);
    setAnswers({});
    setLoadingQuiz(true);
    try {
      const res = await fetch(
        `/api/apprendre/quiz?path=${encodeURIComponent(pathId)}`,
      );
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "Quiz indisponible.");
        return;
      }
      setQuestions(data.questions);
      setAttemptToken(data.attemptToken);
    } catch {
      setError("Impossible de charger le quiz.");
    } finally {
      setLoadingQuiz(false);
    }
  }

  async function submitQuiz() {
    if (questions.some((q) => answers[q.id] == null)) {
      setError("Répondez à toutes les questions.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/apprendre/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathId,
          attemptToken,
          answers: questions.map((q) => ({
            id: q.id,
            choice: answers[q.id],
          })),
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "Échec de l'envoi.");
        return;
      }
      setResult(data);
      if (data.passed && data.certificate) {
        onCertified(data.certificate.code, new Date().toISOString());
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-terracotta">
        Quiz final · {pathLabel}
      </p>
      <h3 className="mt-1 font-[family-name:var(--font-montserrat)] text-xl font-bold">
        Validez le parcours et obtenez votre certificat
      </h3>
      <p className="mt-2 text-sm text-ink/55">
        {QUIZ_TOTAL} questions · réussite ≥ {QUIZ_PASS_SCORE}/{QUIZ_TOTAL}. En
        cas d&apos;échec, les questions et options sont remélangées.
      </p>
      <p className="mt-1 text-xs text-ink/40">Apprenant : {learnerHint}</p>

      {!unlocked && (
        <div className="mt-5 rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink/60">
          Quiz verrouillé — terminez les {totalLessons} leçons (
          {completedCount}/{totalLessons}).
        </div>
      )}

      {existingCert && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>
            Certificat obtenu · code <strong>{existingCert.code}</strong>
          </span>
          <a
            href={`/api/apprendre/certificate?path=${encodeURIComponent(pathId)}`}
            className="font-medium text-terracotta underline-offset-2 hover:underline"
          >
            Télécharger le PDF
          </a>
        </div>
      )}

      {unlocked && (
        <div className="mt-5">
          {questions.length === 0 && !result && (
            <button
              type="button"
              onClick={startQuiz}
              disabled={loadingQuiz}
              className="btn-primary disabled:opacity-50"
            >
              {loadingQuiz
                ? "Préparation…"
                : existingCert
                  ? "Repasser le quiz (entraînement)"
                  : "Lancer le quiz"}
            </button>
          )}

          {questions.length > 0 && !result && (
            <div className="space-y-5">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-ink/10 p-4"
                >
                  <p className="font-medium">
                    {idx + 1}. {q.q}
                  </p>
                  <div
                    className="mt-3 space-y-2"
                    role="radiogroup"
                    aria-label={`Question ${idx + 1}`}
                  >
                    {q.choices.map((c, i) => (
                      <button
                        key={`${q.id}-${i}`}
                        type="button"
                        role="radio"
                        aria-checked={answers[q.id] === i}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: i }))
                        }
                        className={`min-h-11 w-full rounded-lg border px-3 py-2.5 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                          answers[q.id] === i
                            ? "border-terracotta bg-terracotta/10"
                            : "border-ink/12 hover:border-terracotta/40"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={submitQuiz}
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? "Correction…" : "Valider mes réponses"}
              </button>
            </div>
          )}

          {result && (
            <div className="mt-4 space-y-4">
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  result.passed
                    ? "border border-emerald-600/30 bg-emerald-50 text-emerald-800"
                    : "border border-terracotta/30 bg-terracotta/5 text-terracotta"
                }`}
              >
                Score : {result.score}/{result.total}.{" "}
                {result.passed
                  ? "Félicitations, parcours validé !"
                  : `Échec — il faut ≥ ${QUIZ_PASS_SCORE}/${QUIZ_TOTAL}. Retentez (questions remélangées).`}
              </div>
              {result.details.map((d) => {
                const q = questions.find((x) => x.id === d.id);
                return (
                  <div
                    key={d.id}
                    className="rounded-lg border border-ink/8 p-3 text-sm"
                  >
                    <p className="font-medium">{q?.q}</p>
                    <p
                      className={`mt-1 ${
                        d.ok ? "text-emerald-700" : "text-terracotta"
                      }`}
                    >
                      {d.ok ? "✓ Exact. " : "Pas exact. "}
                      {d.explain}
                    </p>
                  </div>
                );
              })}
              {result.passed && result.certificate && (
                <a
                  href={result.certificate.downloadUrl}
                  className="btn-primary inline-flex"
                >
                  Télécharger mon certificat PDF
                </a>
              )}
              {!result.passed && (
                <button
                  type="button"
                  onClick={startQuiz}
                  className="btn-primary"
                >
                  Retenter le quiz
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-terracotta" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function LessonAccordion({
  lesson,
  index,
  open,
  onToggle,
  isDone,
  onToggleDone,
}: {
  lesson: Lesson;
  index: number;
  open: boolean;
  onToggle: () => void;
  isDone: boolean;
  onToggleDone: () => void;
}) {
  const reduce = useReducedMotion();
  const [quizChoice, setQuizChoice] = useState<number | null>(null);

  useEffect(() => {
    setQuizChoice(null);
  }, [lesson.id, open]);

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 md:px-6"
        aria-expanded={open}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 font-[family-name:var(--font-montserrat)] text-sm font-bold text-terracotta">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-[family-name:var(--font-montserrat)] font-bold leading-snug">
              {lesson.title}
            </h4>
            {isDone && (
              <span className="rounded bg-terracotta/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-terracotta">
                Fait
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-ink/45">≈ {lesson.minutes} min</p>
        </div>
        <span className="text-ink/40" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink/8 px-5 pb-6 pt-2 md:px-6 md:pl-[4.5rem]">
              <div className="space-y-3 text-[0.98rem] leading-relaxed text-ink/70">
                {lesson.body.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
              {lesson.tips && lesson.tips.length > 0 && (
                <ul className="mt-4 space-y-2 rounded-xl bg-cream/80 p-4">
                  {lesson.tips.map((t) => (
                    <li
                      key={t}
                      className="flex gap-2 text-sm text-ink/65"
                    >
                      <span className="text-terracotta" aria-hidden>
                        ✦
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}

              {lesson.quiz && (
                <div className="mt-5 rounded-xl border border-ink/10 p-4">
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-terracotta">
                    Mini-quiz
                  </p>
                  <p className="mt-1 font-medium">{lesson.quiz.q}</p>
                  <div className="mt-3 space-y-2">
                    {lesson.quiz.choices.map((c, i) => {
                      const selected = quizChoice === i;
                      const revealed = quizChoice !== null;
                      const isCorrect = i === lesson.quiz!.correct;
                      let cls =
                        "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ";
                      if (!revealed) {
                        cls +=
                          "border-ink/12 hover:border-terracotta/50 hover:bg-terracotta/5";
                      } else if (isCorrect) {
                        cls += "border-emerald-600/40 bg-emerald-50 text-ink";
                      } else if (selected) {
                        cls +=
                          "border-terracotta/40 bg-terracotta/5 text-ink/70";
                      } else {
                        cls += "border-ink/8 text-ink/45";
                      }
                      return (
                        <button
                          key={c}
                          type="button"
                          disabled={revealed}
                          className={cls}
                          onClick={() => setQuizChoice(i)}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  {quizChoice !== null && (
                    <p
                      className={`mt-3 text-sm ${
                        quizChoice === lesson.quiz.correct
                          ? "text-emerald-700"
                          : "text-terracotta"
                      }`}
                    >
                      {quizChoice === lesson.quiz.correct
                        ? "✓ Exact. "
                        : "Pas tout à fait. "}
                      {lesson.quiz.explain}
                    </p>
                  )}
                </div>
              )}

              <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={onToggleDone}
                  className="h-4 w-4 accent-[var(--color-terracotta)]"
                />
                Marquer cette leçon comme terminée
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
