"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LINKS } from "@/lib/constants";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-ink"
      aria-labelledby="hero-heading"
    >
      <Image
        src="/hero-fondatrice.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center] md:object-[78%_center]"
        aria-hidden
      />
      {/* Voile sur la photo uniquement, le texte reste net au-dessus */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,20,26,0.88) 0%, rgba(20,20,26,0.72) 42%, rgba(20,20,26,0.45) 68%, rgba(20,20,26,0.35) 100%), linear-gradient(180deg, rgba(20,20,26,0.25) 0%, transparent 30%, rgba(20,20,26,0.55) 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-[1200px] flex-col justify-center px-5 py-20 md:px-8 md:py-28">
        <motion.p
          className="section-label mb-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          L&apos;agence IA francophone
        </motion.p>
        <motion.h1
          id="hero-heading"
          className="max-w-3xl font-[family-name:var(--font-montserrat)] text-[clamp(2.4rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          L&apos;IA, enfin
          <br />
          chez vous.
        </motion.h1>
        <motion.p
          className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-cream/90 md:text-[1.15rem] drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          Que vous vouliez apprendre, créer un projet avec l&apos;IA ou
          l&apos;intégrer dans votre entreprise, vous êtes au bon endroit.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href={LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Prendre rendez-vous
          </a>
          <a href="/#offre" className="btn-ghost">
            Découvrir les offres
          </a>
        </motion.div>
      </div>
    </section>
  );
}
