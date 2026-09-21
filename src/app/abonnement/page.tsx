import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AbonnementClient from "@/components/studio/AbonnementClient";

export const metadata: Metadata = {
  title: "Acheter des crédits",
  description:
    "Achetez des crédits Studio Ilémi par Mobile Money (Moov, MTN, Celtiis).",
  robots: { index: false, follow: false },
};

export default function AbonnementPage() {
  return (
    <>
      <Header />
      <main id="contenu-principal" className="bg-cream text-ink">
        <Suspense
          fallback={
            <div
              className="mx-auto max-w-[960px] page-pad py-20"
              aria-busy="true"
            >
              <p className="sr-only">Chargement…</p>
              <div className="skeleton h-8 w-48" />
              <div className="skeleton mt-4 h-20 w-full max-w-xl" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="skeleton h-48" />
                <div className="skeleton h-48" />
                <div className="skeleton h-48" />
              </div>
            </div>
          }
        >
          <AbonnementClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
