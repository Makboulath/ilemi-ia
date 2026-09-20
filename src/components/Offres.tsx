"use client";

import { useState } from "react";
import { LINKS, OFFERS, type OfferProduct } from "@/lib/constants";

export default function Offres() {
  const [tab, setTab] = useState(0);
  const current = OFFERS[tab];

  return (
    <section
      id="offre"
      aria-labelledby="offre-heading"
      className="bg-cream text-ink py-16 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="mb-10 md:mb-12 max-w-xl">
          <p className="section-label">Nos offres</p>
          <h2
            id="offre-heading"
            className="font-[family-name:var(--font-montserrat)] text-[clamp(1.9rem,4.2vw,3.4rem)] font-extrabold leading-[1.06] tracking-[-0.04em]"
          >
            Ilémi est votre maison.
            <br />
            Entrez par la porte qui vous convient.
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/60 max-w-lg">
            Chaque offre est une porte d&apos;entrée. Vous commencez là où vous
            êtes, et vous avancez à votre rythme.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Piliers d'offres"
          className="mb-8 flex flex-wrap gap-2 border-b border-ink/10 pb-1"
        >
          {OFFERS.map((pillar, i) => {
            const active = i === tab;
            return (
              <button
                key={pillar.id}
                role="tab"
                type="button"
                aria-selected={active}
                id={`tab-${pillar.id}`}
                aria-controls={`panel-${pillar.id}`}
                onClick={() => setTab(i)}
                className={`rounded-t px-4 py-3 text-sm font-[family-name:var(--font-montserrat)] font-bold transition ${
                  active
                    ? "bg-ink text-cream"
                    : "text-ink/55 hover:text-ink hover:bg-ink/5"
                }`}
              >
                <span className="mr-2 opacity-80" aria-hidden>
                  {pillar.icon}
                </span>
                {pillar.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
        >
          <p className="mb-8 max-w-2xl text-[1.02rem] leading-relaxed text-ink/65">
            {current.intro}
          </p>

          {current.produits && (
            <div className="grid gap-5 md:grid-cols-3">
              {current.produits.map((p) => (
                <ProductCard key={p.titre} product={p} />
              ))}
            </div>
          )}

          {current.steps && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {current.steps.map((s) => (
                <div
                  key={s.n}
                  className="card-lift rounded-2xl border border-ink/10 bg-white p-7"
                >
                  <span className="mb-4 block font-[family-name:var(--font-montserrat)] text-4xl font-extrabold tracking-tight text-terracotta">
                    {s.n}
                  </span>
                  <h3 className="mb-2 font-[family-name:var(--font-montserrat)] text-lg font-bold">
                    {s.title}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-ink/60">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-sm text-ink/55">
            30 minutes gratuites pour clarifier votre besoin —{" "}
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
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: OfferProduct }) {
  const accent = product.accent;
  return (
    <article
      className={`card-lift relative flex h-full flex-col border p-7 ${
        accent
          ? "border-terracotta border-t-[3px] bg-navy text-cream"
          : "border-ink/10 bg-white text-ink"
      }`}
    >
      {product.badge && (
        <span className="absolute -top-px right-5 bg-gold px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink">
          {product.badge}
        </span>
      )}
      <p className="mb-2.5 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-terracotta">
        {product.pour}
      </p>
      <h3
        className={`mb-3 font-[family-name:var(--font-montserrat)] text-[1.15rem] font-bold leading-snug tracking-tight ${
          accent ? "text-cream" : "text-ink"
        }`}
      >
        {product.titre}
      </h3>
      <p
        className={`mb-5 text-[0.95rem] leading-relaxed ${
          accent ? "text-cream/60" : "text-ink/55"
        }`}
      >
        {product.desc}
      </p>
      <ul className="mb-6 flex-1 space-y-2">
        {product.inclus.map((item) => (
          <li
            key={item}
            className={`flex gap-2.5 text-sm leading-snug ${
              accent ? "text-cream/60" : "text-ink/55"
            }`}
          >
            <span className="shrink-0 font-bold text-terracotta" aria-hidden>
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <a
        href={LINKS.calendly}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto block rounded-[3px] px-5 py-3 text-center text-[0.8rem] font-[family-name:var(--font-montserrat)] font-bold transition ${
          accent
            ? "bg-terracotta text-cream hover:brightness-110"
            : "border-[1.5px] border-terracotta text-terracotta hover:bg-terracotta/5"
        }`}
      >
        En savoir plus
      </a>
    </article>
  );
}
