import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";
import { LINKS } from "@/lib/constants";
import LogoutButton from "@/components/LogoutButton";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Mon espace",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EspacePage() {
  const session = await getSession();
  if (!session) redirect("/connexion?next=/espace");

  return (
    <>
      <Header />
      <main id="contenu-principal" className="bg-cream text-ink">
        <div className="mx-auto max-w-[900px] page-pad py-14 sm:py-16 md:py-24">
          <p className="section-label">Espace membre</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight md:text-4xl">
            Bienvenue
          </h1>
          <p className="mt-3 text-ink/60">
            Connecté·e en tant que{" "}
            <strong className="font-medium text-ink">{session.email}</strong>
            {session.role === "ADMIN" ? " (admin)" : ""}.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/apprendre"
              className="card-lift flex min-h-[7.5rem] flex-col rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-terracotta/40 sm:p-6"
            >
              <h2 className="font-[family-name:var(--font-montserrat)] font-bold">
                Apprendre
              </h2>
              <p className="mt-2 text-sm text-ink/55">
                Leçons, quiz et certificat.
              </p>
            </Link>
            <Link
              href="/studio"
              className="card-lift flex min-h-[7.5rem] flex-col rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-terracotta/40 sm:p-6"
            >
              <h2 className="font-[family-name:var(--font-montserrat)] font-bold">
                Studio
              </h2>
              <p className="mt-2 text-sm text-ink/55">
                Image, vidéo, liens audio.
              </p>
            </Link>
            <Link
              href="/abonnement"
              className="card-lift flex min-h-[7.5rem] flex-col rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-terracotta/40 sm:p-6"
            >
              <h2 className="font-[family-name:var(--font-montserrat)] font-bold">
                Acheter des crédits
              </h2>
              <p className="mt-2 text-sm text-ink/55">
                Packs Mobile Money (USSD).
              </p>
            </Link>
            <Link
              href="/#contact"
              className="card-lift flex min-h-[7.5rem] flex-col rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-terracotta/40 sm:p-6"
            >
              <h2 className="font-[family-name:var(--font-montserrat)] font-bold">
                Contact
              </h2>
              <p className="mt-2 text-sm text-ink/55">
                Écrire ou réserver un créneau.
              </p>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Prendre rendez-vous
            </a>
            {session.role === "ADMIN" && (
              <Link
                href="/admin"
                className="btn-ghost !border-ink/20 !text-ink"
              >
                Tableau de bord admin
              </Link>
            )}
            <LogoutButton />
          </div>

          <div className="mt-12 rounded-2xl border border-ink/10 bg-white p-6">
            <ChangePasswordForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
