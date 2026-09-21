import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisez votre mot de passe ilémi.IA.",
  robots: { index: false, follow: false },
};

export default function MotDePasseOubliePage() {
  return (
    <>
      <Header />
      <main id="contenu-principal" className="bg-cream text-ink">
        <div className="mx-auto max-w-md page-pad py-14 sm:py-16 md:py-24">
          <p className="section-label">Compte</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight">
            Mot de passe oublié
          </h1>
          <p className="mt-3 text-ink/60">
            Indiquez l’email de votre compte. Si un compte existe, vous recevrez
            un lien valable 1 heure.
          </p>
          <div className="mt-8">
            <ForgotPasswordForm />
          </div>
          <p className="mt-6 text-center text-sm text-ink/55">
            <Link
              href="/connexion"
              className="font-medium text-terracotta underline-offset-2 hover:underline"
            >
              ← Retour à la connexion
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
