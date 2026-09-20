import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte membre Ilémi.IA.",
  robots: { index: false, follow: false },
};

export default function InscriptionPage() {
  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <div className="mx-auto max-w-md px-5 py-16 md:px-8 md:py-24">
          <p className="section-label">Compte</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight">
            Inscription
          </h1>
          <p className="mt-3 text-ink/60">
            Créez un compte membre pour retrouver Apprendre, les offres et le
            contact.
          </p>
          <div className="mt-8">
            <AuthForm mode="register" nextPath="/espace" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
