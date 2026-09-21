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
      <main className="bg-cream text-ink">
        <Suspense
          fallback={
            <div className="mx-auto max-w-[800px] px-5 py-20 text-ink/50">
              Chargement…
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
