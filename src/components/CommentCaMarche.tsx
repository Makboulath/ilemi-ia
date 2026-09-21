"use client";

import { PROCESS_STEPS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

export default function CommentCaMarche() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="bg-cream text-ink py-14 sm:py-16 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-8">
        <FadeIn className="mb-12 max-w-xl">
          <p className="section-label">Comment ça marche</p>
          <h2
            id="process-heading"
            className="font-[family-name:var(--font-montserrat)] text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em]"
          >
            Quatre étapes.
            <br />
            Zéro jargon.
          </h2>
          <p className="mt-4 text-ink/60 leading-relaxed">
            Un parcours clair pour intégrer l&apos;IA à votre activité, de
            l&apos;audit jusqu&apos;à l&apos;autonomie.
          </p>
        </FadeIn>

        <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((s) => (
            <StaggerItem key={s.n}>
              <article className="group card-lift rounded-2xl border border-ink/10 bg-white p-8 transition-colors hover:border-transparent hover:bg-navy">
                <span className="mb-5 block font-[family-name:var(--font-montserrat)] text-5xl font-extrabold tracking-tight text-terracotta/90 group-hover:text-terracotta/70">
                  {s.n}
                </span>
                <h3 className="mb-3 font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink group-hover:text-cream">
                  {s.title}
                </h3>
                <p className="text-[0.95rem] leading-relaxed text-ink/60 group-hover:text-cream/70">
                  {s.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
