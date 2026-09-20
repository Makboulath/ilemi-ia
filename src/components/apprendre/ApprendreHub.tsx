"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LINKS } from "@/lib/constants";
import {
  LEARNING_PATHS,
  allLessonIds,
  type LearningPath,
  type Lesson,
} from "@/lib/apprendre/content";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

function progressKey(email: string) {
  return `ilemi-apprendre-progress:${email || "anonymous"}`;
}

export default function ApprendreHub() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [pathId, setPathId] = useState<LearningPath["id"]>("debutant");
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const em = data?.user?.email || "";
        setEmail(em);
        try {
          const raw = localStorage.getItem(progressKey(em));
          if (raw) {
            const ids = JSON.parse(raw) as string[];
            setDone(new Set(ids));
          }
        } catch {
          /* ignore */
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(
    (next: Set<string>) => {
      setDone(next);
      try {
        localStorage.setItem(
          progressKey(email),
          JSON.stringify(Array.from(next)),
        );
      } catch {
        /* ignore */
      }
    },
    [email],
  );

  const path = LEARNING_PATHS.find((p) => p.id === pathId)!;
  const total = allLessonIds().length;
  const doneCount = useMemo(
    () => allLessonIds().filter((id) => done.has(id)).length,
    [done],
  );
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  function toggleDone(id: string) {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    persist(next);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-8 md:py-20">
      <FadeIn>
        <p className="section-label">Espace membre</p>
        <h1 className="font-[family-name:var(--font-montserrat)] text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
          Apprendre avec Ilémi
        </h1>
        <p className="mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-ink/65">
          Un hub de formation clair : parcours Débutant, Créateur ou Pro —
          leçons en accordéon, quiz instantanés, progression sauvegardée sur
          cet appareil{email ? ` pour ${email}` : ""}.
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
              Stockée localement (navigateur)
              {email ? ` · ${email}` : ""}
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/8">
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
          const pathDone = p.lessons.filter((l) => done.has(l.id)).length;
          return (
            <StaggerItem key={p.id}>
              <button
                type="button"
                onClick={() => {
                  setPathId(p.id);
                  setOpenLesson(null);
                }}
                className={`card-lift w-full rounded-2xl border p-6 text-left transition ${
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
              isDone={done.has(lesson.id)}
              onToggleDone={() => toggleDone(lesson.id)}
            />
          ))}
        </div>
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
            Atelier, parcours Créer avec l&apos;IA, ou diagnostic entreprise —
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
        className="flex w-full items-start gap-4 px-5 py-4 text-left md:px-6"
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
                    Quiz
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
                        cls += "border-terracotta/40 bg-terracotta/5 text-ink/70";
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
