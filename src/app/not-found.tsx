import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="contenu-principal"
        className="bg-cream text-ink"
      >
        <div className="mx-auto max-w-lg page-pad py-20 text-center md:py-28">
          <p className="section-label !mb-3">Erreur 404</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight md:text-4xl">
            Page introuvable
          </h1>
          <p className="mt-4 text-ink/60">
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/studio"
              className="btn-ghost !border-ink/20 !text-ink"
            >
              Ouvrir le Studio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
