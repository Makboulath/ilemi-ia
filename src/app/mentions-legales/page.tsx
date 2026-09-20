import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site ilémi.IA.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <p className="section-label">Informations légales</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight md:text-4xl">
            Mentions légales
          </h1>
          <div className="prose-legal mt-8 space-y-6 text-[1.02rem] leading-relaxed text-ink/75">
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Éditeur du site
              </h2>
              <p>
                Le site <strong>ilémi.IA</strong> est édité par Makboulath
                Raoufou, stratégiste en communication digitale &amp; IA,
                opérant sous la marque ilémi.IA (agence IA francophone), basée à
                Cotonou, Bénin, et servant une clientèle francophone
                (Afrique / Europe).
              </p>
              <p>
                Contact :{" "}
                <a
                  href={LINKS.mailto}
                  className="text-terracotta underline-offset-2 hover:underline"
                >
                  {LINKS.email}
                </a>
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Hébergement
              </h2>
              <p>
                Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133,
                Covina, CA 91723, États-Unis,{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta underline-offset-2 hover:underline"
                >
                  vercel.com
                </a>
                .
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Propriété intellectuelle
              </h2>
              <p>
                L&apos;ensemble des contenus présents sur ce site (textes,
                visuels, marques, logos) est protégé. Toute reproduction non
                autorisée est interdite. Les marques tierces citées appartiennent
                à leurs détenteurs respectifs.
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Responsabilité
              </h2>
              <p>
                Les informations publiées le sont à titre indicatif. ilémi.IA
                s&apos;efforce d&apos;en assurer l&apos;exactitude, sans
                garantie d&apos;exhaustivité. L&apos;usage des outils et conseils
                IA reste sous la responsabilité de l&apos;utilisateur.
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Droit applicable
              </h2>
              <p>
                Les présentes mentions sont rédigées pour une activité
                francophone opérant depuis le Bénin et servant notamment des
                clients en France et en Afrique de l&apos;Ouest. Pour toute
                question, écrivez à{" "}
                <a
                  href={LINKS.mailto}
                  className="text-terracotta underline-offset-2 hover:underline"
                >
                  {LINKS.email}
                </a>
                .
              </p>
            </section>
          </div>
          <p className="mt-12">
            <Link
              href="/"
              className="text-sm font-medium text-terracotta underline-offset-2 hover:underline"
            >
              ← Retour à l&apos;accueil
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
