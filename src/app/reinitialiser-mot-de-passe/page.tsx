import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  description: "Choisissez un nouveau mot de passe ilémi.IA.",
  robots: { index: false, follow: false },
};

export default function ReinitialiserMotDePassePage() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <div className="mx-auto max-w-md px-5 py-16 md:px-8 md:py-24">
          <p className="section-label">Compte</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight">
            Nouveau mot de passe
          </h1>
          <p className="mt-3 text-ink/60">
            Choisissez un mot de passe d’au moins 8 caractères.
          </p>
          <div className="mt-8">
            <Suspense
              fallback={
                <p className="text-sm text-ink/50">Chargement…</p>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-ink/55">
            <Link
              href="/mot-de-passe-oublie"
              className="font-medium text-terracotta underline-offset-2 hover:underline"
            >
              Demander un nouveau lien
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
