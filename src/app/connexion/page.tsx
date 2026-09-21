import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";
import { safeNextPath } from "@/lib/safe-next";

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
  const next = safeNextPath(sp.next, "/espace");
  const gated =
    next.startsWith("/apprendre") ||
    next.startsWith("/studio") ||
    next.startsWith("/abonnement");
  const gatedCopy = next.startsWith("/abonnement")
    ? "L’achat de crédits Studio nécessite un compte. Connectez-vous ou créez un compte — vous reviendrez ensuite au paiement Mobile Money."
    : "Apprendre et le Studio sont réservés aux membres. Connectez-vous ou créez un compte pour continuer.";

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
            {gated
              ? gatedCopy
              : "Accédez à votre espace membre ou à l'administration."}
          </p>
          {gated && (
            <p className="mt-3 rounded-lg border border-terracotta/25 bg-terracotta/5 px-3.5 py-2.5 text-sm text-ink/70">
              Pas encore inscrit·e ?{" "}
              <Link
                href={`/inscription?next=${encodeURIComponent(next)}`}
                className="font-medium text-terracotta underline-offset-2 hover:underline"
              >
                Créer un compte
              </Link>
              {next.startsWith("/abonnement")
                ? " — gratuit, puis retour au paiement."
                : " , c'est gratuit pour accéder au hub et au Studio."}
            </p>
          )}
          <div className="mt-8">
            <AuthForm mode="login" nextPath={next} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
