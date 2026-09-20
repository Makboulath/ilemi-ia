import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site ilémi.IA.",
};

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <p className="section-label">Vie privée</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight md:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-3 text-sm text-ink/50">Dernière mise à jour : septembre 2026</p>

          <div className="mt-8 space-y-6 text-[1.02rem] leading-relaxed text-ink/75">
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Qui est responsable ?
              </h2>
              <p>
                ilémi.IA (Makboulath Raoufou) est responsable du traitement des
                données collectées via ce site. Contact :{" "}
                <a
                  href={LINKS.mailto}
                  className="text-terracotta underline-offset-2 hover:underline"
                >
                  {LINKS.email}
                </a>
                .
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Quelles données collectons-nous ?
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Données fournies volontairement via le formulaire de contact
                  (nom, email, sujet, message).
                </li>
                <li>
                  Données techniques minimales liées à l&apos;hébergement
                  (journaux serveur, adresse IP anonymisée le cas échéant).
                </li>
                <li>
                  Si vous réservez via Calendly ou WhatsApp, ces services
                  traitent vos données selon leurs propres politiques.
                </li>
              </ul>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Finalités
              </h2>
              <p>
                Répondre à vos demandes, organiser un rendez-vous, améliorer le
                site et respecter nos obligations légales. Nous ne vendons pas
                vos données.
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Base légale &amp; conservation
              </h2>
              <p>
                Traitement fondé sur votre consentement (formulaire) et/ou
                l&apos;intérêt légitime (réponse commerciale). Les messages sont
                conservés le temps nécessaire au suivi de la relation, puis
                archivés ou supprimés.
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Sous-traitants
              </h2>
              <p>
                Hébergement (Vercel), formulaire (Formspree, si configuré),
                prise de rendez-vous (Calendly), messagerie (WhatsApp / Meta).
                Ces prestataires peuvent traiter des données hors UE ; des
                garanties contractuelles appropriées s&apos;appliquent selon
                leurs conditions.
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Vos droits
              </h2>
              <p>
                Conformément au RGPD (si applicable) et aux lois béninoises
                relatives aux données personnelles, vous pouvez demander
                l&apos;accès, la rectification, l&apos;effacement ou la
                limitation du traitement de vos données en écrivant à{" "}
                <a
                  href={LINKS.mailto}
                  className="text-terracotta underline-offset-2 hover:underline"
                >
                  {LINKS.email}
                </a>
                .
              </p>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-ink">
                Cookies
              </h2>
              <p>
                Ce site marketing n&apos;utilise pas de cookies publicitaires
                tiers. Des cookies techniques liés à l&apos;hébergement ou à la
                sécurité peuvent être déposés. Aucun chat IA ni tracking
                marketing n&apos;est activé en v1.
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
