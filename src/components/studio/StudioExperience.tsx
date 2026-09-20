"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LINKS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

type Zone = {
  id: "image" | "video" | "son";
  label: string;
  icon: string;
  title: string;
  desc: string;
  previewHint: string;
};

const ZONES: Zone[] = [
  {
    id: "image",
    label: "Image",
    icon: "◈",
    title: "Créer des images",
    desc: "Moodboards, visuels réseaux, concepts de marque — bientôt dans le Studio, avec un accompagnement Ilémi.",
    previewHint: "Décrivez une scène… (démo locale)",
  },
  {
    id: "video",
    label: "Vidéo",
    icon: "▶",
    title: "Imaginer la vidéo",
    desc: "Storyboards, scripts et premières idées animées. L'espace vidéo arrivera sans clés API côté navigateur.",
    previewHint: "Pitch de 2 phrases… (démo locale)",
  },
  {
    id: "son",
    label: "Son",
    icon: "♩",
    title: "Explorer le son",
    desc: "Voix off, jingles, ambiances — un atelier audio pensé pour créer sans jargon.",
    previewHint: "Ambiance ou voix… (démo locale)",
  },
];

export default function StudioExperience() {
  const [active, setActive] = useState<Zone | null>(null);
  const [prompt, setPrompt] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [previewLabel, setPreviewLabel] = useState("");
  const reduce = useReducedMotion();

  function openZone(z: Zone) {
    setActive(z);
    setPrompt("");
    setPreviewing(false);
    setPreviewLabel("");
  }

  function runFakePreview() {
    if (!prompt.trim()) return;
    setPreviewing(true);
    setPreviewLabel("");
    window.setTimeout(() => {
      setPreviewLabel(
        `Aperçu simulé · « ${prompt.trim().slice(0, 48)}${prompt.trim().length > 48 ? "…" : ""} »`,
      );
      setPreviewing(false);
    }, reduce ? 200 : 1400);
  }

  return (
    <div className="relative overflow-hidden bg-ink text-cream">
      {/* Ambient glow — decorative only, not a content blur */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-terracotta/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
      />

      <section className="relative mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
        <FadeIn>
          <p className="section-label !text-gold">Espace membre</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            Studio Ilémi
          </h1>
          <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-cream/65">
            Un atelier créatif immersif pour Image, Vidéo et Son. Les
            générateurs réels arrivent bientôt — en attendant, explorez
            l&apos;expérience et réservez un échange pour être notifié·e.
          </p>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-5 md:grid-cols-3">
          {ZONES.map((z) => (
            <StaggerItem key={z.id}>
              <motion.button
                type="button"
                onClick={() => openZone(z)}
                whileHover={reduce ? undefined : { y: -6 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-cream/12 bg-navy/80 p-7 text-left transition hover:border-terracotta/50"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(600px circle at 50% 0%, rgba(193,98,45,0.18), transparent 55%)",
                  }}
                />
                <span className="relative text-3xl text-gold" aria-hidden>
                  {z.icon}
                </span>
                <p className="relative mt-5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-terracotta">
                  Zone {z.label}
                </p>
                <h2 className="relative mt-1 font-[family-name:var(--font-montserrat)] text-xl font-bold">
                  {z.title}
                </h2>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-cream/55">
                  {z.desc}
                </p>
                <span className="relative mt-6 text-sm font-medium text-gold">
                  Ouvrir →
                </span>
              </motion.button>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn className="mt-16" delay={0.1}>
          <div className="rounded-2xl border border-dashed border-cream/15 bg-cream/[0.03] p-6 md:p-8">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-gold">
              Démo locale
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-montserrat)] text-lg font-bold">
              Essayez un prompt — aperçu simulé
            </h3>
            <p className="mt-2 max-w-xl text-sm text-cream/50">
              Aucune API externe. C&apos;est une animation placeholder pour
              sentir le futur Studio.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex. Une maison chaleureuse au crépuscule, style éditorial…"
                className="flex-1 rounded border border-cream/15 bg-ink/60 px-4 py-3 text-sm text-cream outline-none placeholder:text-cream/30 focus:border-terracotta"
              />
              <button
                type="button"
                onClick={runFakePreview}
                disabled={previewing || !prompt.trim()}
                className="btn-primary shrink-0 disabled:opacity-50"
              >
                {previewing ? "Génération…" : "Prévisualiser"}
              </button>
            </div>
            <div className="relative mt-5 min-h-[140px] overflow-hidden rounded-xl border border-cream/10 bg-gradient-to-br from-navy to-ink">
              <AnimatePresence mode="wait">
                {previewing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      className="h-16 w-16 rounded-full border-2 border-terracotta/40 border-t-terracotta"
                      animate={reduce ? undefined : { rotate: 360 }}
                      transition={
                        reduce
                          ? undefined
                          : { repeat: Infinity, duration: 0.9, ease: "linear" }
                      }
                    />
                  </motion.div>
                ) : previewLabel ? (
                  <motion.div
                    key="result"
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 p-6 text-center"
                  >
                    <div className="h-20 w-full max-w-xs rounded-lg bg-gradient-to-r from-terracotta/30 via-gold/25 to-cream/10" />
                    <p className="text-sm text-cream/70">{previewLabel}</p>
                    <p className="text-xs text-cream/40">
                      Placeholder · pas de génération réelle
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="empty"
                    className="absolute inset-0 flex items-center justify-center text-sm text-cream/35"
                  >
                    Votre aperçu apparaîtra ici
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </FadeIn>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="studio-modal-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/70"
              aria-label="Fermer"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={reduce ? false : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: 24, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-lg rounded-2xl border border-cream/15 bg-navy p-7 text-cream shadow-2xl"
            >
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-gold">
                {active.label} · bientôt disponible
              </p>
              <h2
                id="studio-modal-title"
                className="mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold"
              >
                {active.title}
              </h2>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-cream/65">
                {active.desc} On prépare un espace soigné, sans exposer de clés
                API dans le navigateur. Soyez parmi les premier·ères informé·es.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={LINKS.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Être notifié·e / réserver
                </a>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="btn-ghost !border-cream/25"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
