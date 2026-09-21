"use client";

import { LINKS, OFFERS } from "@/lib/constants";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { motion, useReducedMotion } from "framer-motion";

export default function Offres() {
  const reduce = useReducedMotion();

  return (
    <section
      id="offre"
      aria-labelledby="offre-heading"
      className="bg-cream text-ink py-14 sm:py-16 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-8">
        <motion.div
          className="mb-10 max-w-xl md:mb-14"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">Nos offres</p>
          <h2
            id="offre-heading"
            className="font-[family-name:var(--font-montserrat)] text-[clamp(1.9rem,4.2vw,3.4rem)] font-extrabold leading-[1.06] tracking-[-0.04em]"
          >
            Ilémi est votre maison.
            <br />
            Entrez par la porte qui vous convient.
          </h2>
          <p className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-ink/60">
            Trois portes d&apos;entrée. Vous commencez là où vous êtes, et vous
            avancez à votre rythme.
          </p>
        </motion.div>

        <StaggerChildren className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
          {OFFERS.map((pillar) => {
            const products = pillar.produits ?? [];
            const highlight =
              products.find((p) => p.accent) ??
              products.find((p) => p.badge) ??
              products[0];
            return (
              <StaggerItem key={pillar.id} className="h-full">
                <article className="card-lift relative flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 md:p-7">
                  {highlight?.badge ? (
                    <span className="absolute right-4 top-4 rounded-full bg-terracotta/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-terracotta">
                      {highlight.badge}
                    </span>
                  ) : null}
                  <p className="mb-3 pr-20 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-terracotta">
                    <span className="mr-1.5" aria-hidden>
                      {pillar.icon}
                    </span>
                    {pillar.label}
                  </p>
                  <h3 className="mb-3 font-[family-name:var(--font-montserrat)] text-[1.25rem] font-bold leading-snug tracking-tight text-ink">
                    {highlight?.titre ?? pillar.label}
                  </h3>
                  <p className="mb-5 text-[0.95rem] leading-relaxed text-ink/60">
                    {highlight?.desc ?? pillar.intro}
                  </p>
                  {highlight?.inclus && (
                    <ul className="mb-6 flex-1 space-y-2">
                      {highlight.inclus.slice(0, 4).map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm leading-snug text-ink/55"
                        >
                          <span
                            className="shrink-0 font-bold text-terracotta"
                            aria-hidden
                          >
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <a
                    href={LINKS.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto block min-h-11 rounded-[3px] border-[1.5px] border-terracotta px-5 py-3 text-center text-[0.8rem] font-[family-name:var(--font-montserrat)] font-bold text-terracotta transition hover:bg-terracotta/5 active:scale-[0.98]"
                  >
                    En savoir plus
                  </a>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <p className="mt-8 text-sm text-ink/55">
          30 minutes gratuites pour clarifier votre besoin,{" "}
          <a
            href={LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-terracotta underline-offset-2 hover:underline"
          >
            réserver sur Calendly
          </a>
          .
        </p>
      </div>
    </section>
  );
}
