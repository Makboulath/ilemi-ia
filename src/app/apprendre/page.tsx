import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Apprendre avec Ilémi",
  description:
    "Apprendre l'IA sans jargon, à son rythme — ateliers, parcours et guides avec Ilémi.IA.",
};

const CARDS = [
  {
    titre: "Atelier découverte",
    pour: "Débutants et curieux",
    desc: "Une session courte en groupe pour démystifier l'IA sans jargon. Des cas concrets, des outils utilisables dès le lendemain.",
    inclus: [
      "Session collective de quelques heures",
      "Panorama des outils IA accessibles",
      "Exercices pratiques sur des cas réels",
      "Guide de ressources à emporter",
    ],
  },
  {
    titre: "Parcours « Créer avec l'IA »",
    pour: "Porteurs de projet",
    desc: "Vous arrivez avec une idée. On vous accompagne jusqu'à un livrable qui fonctionne vraiment — pas un slide, un résultat.",
    inclus: [
      "Accompagnement individuel sur plusieurs semaines",
      "Audit de l'idée et de sa faisabilité",
      "Suivi entre chaque session",
      "Livrable fonctionnel en sortie",
    ],
    accent: true,
    badge: "Offre phare",
  },
  {
    titre: "Guides & ressources",
    pour: "À votre rythme",
    desc: "Des contenus clairs pour progresser seul·e entre les sessions : checklists, glossaire sans jargon, et pistes d'outils.",
    inclus: [
      "Guides pratiques en français",
      "Checklists pour démarrer",
      "Sélection d'outils accessibles",
      "Mises à jour au fil de La Maison",
    ],
  },
];

export default function ApprendrePage() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <section className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
          <p className="section-label">Apprendre</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
            Apprendre avec Ilémi
          </h1>
          <p className="mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-ink/65">
            Apprendre l&apos;IA sans jargon, à son rythme. Des portes
            d&apos;entrée concrètes — atelier, parcours accompagné, ou
            ressources pour avancer seul·e.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {CARDS.map((c) => (
              <article
                key={c.titre}
                className={`card-lift relative flex h-full flex-col border p-7 ${
                  c.accent
                    ? "border-terracotta border-t-[3px] bg-navy text-cream"
                    : "border-ink/10 bg-white text-ink"
                }`}
              >
                {c.badge && (
                  <span className="absolute -top-px right-5 bg-gold px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink">
                    {c.badge}
                  </span>
                )}
                <p className="mb-2.5 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-terracotta">
                  {c.pour}
                </p>
                <h2
                  className={`mb-3 font-[family-name:var(--font-montserrat)] text-[1.15rem] font-bold leading-snug tracking-tight ${
                    c.accent ? "text-cream" : "text-ink"
                  }`}
                >
                  {c.titre}
                </h2>
                <p
                  className={`mb-5 text-[0.95rem] leading-relaxed ${
                    c.accent ? "text-cream/60" : "text-ink/55"
                  }`}
                >
                  {c.desc}
                </p>
                <ul className="mb-6 flex-1 space-y-2">
                  {c.inclus.map((item) => (
                    <li
                      key={item}
                      className={`flex gap-2.5 text-sm leading-snug ${
                        c.accent ? "text-cream/60" : "text-ink/55"
                      }`}
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
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-white/60 p-6 md:p-8">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-terracotta">
              Bientôt
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-montserrat)] text-lg font-bold">
              Studio — bientôt
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/55">
              Un espace pour expérimenter image, vidéo et audio avec l&apos;IA
              arrivera plus tard. Pour l&apos;instant, on priorise la clarté et
              l&apos;accompagnement — sans clés API côté navigateur.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Réserver un échange
            </a>
            <Link href="/#offre" className="btn-ghost !border-ink/20 !text-ink">
              Voir les offres
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
