import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace Ilémi.IA.",
  robots: { index: false, follow: false },
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/espace";

  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <div className="mx-auto max-w-md px-5 py-16 md:px-8 md:py-24">
          <p className="section-label">Compte</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight">
            Connexion
          </h1>
          <p className="mt-3 text-ink/60">
            Accédez à votre espace membre ou à l&apos;administration.
          </p>
          <div className="mt-8">
            <AuthForm mode="login" nextPath={next} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
