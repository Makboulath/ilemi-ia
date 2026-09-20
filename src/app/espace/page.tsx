import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";
import { LINKS } from "@/lib/constants";
import LogoutButton from "@/components/LogoutButton";

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
      <main className="bg-cream text-ink">
        <div className="mx-auto max-w-[900px] px-5 py-16 md:px-8 md:py-24">
          <p className="section-label">Espace membre</p>
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight md:text-4xl">
            Bienvenue
          </h1>
          <p className="mt-3 text-ink/60">
            Connecté·e en tant que{" "}
            <strong className="font-medium text-ink">{session.email}</strong>
            {session.role === "ADMIN" ? " (admin)" : ""}.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Link
              href="/apprendre"
              className="card-lift rounded-2xl border border-ink/10 bg-white p-6 hover:border-terracotta/40"
            >
              <h2 className="font-[family-name:var(--font-montserrat)] font-bold">
                Apprendre
              </h2>
              <p className="mt-2 text-sm text-ink/55">
                Ateliers, parcours et guides.
              </p>
            </Link>
            <Link
              href="/#offre"
              className="card-lift rounded-2xl border border-ink/10 bg-white p-6 hover:border-terracotta/40"
            >
              <h2 className="font-[family-name:var(--font-montserrat)] font-bold">
                Offres
              </h2>
              <p className="mt-2 text-sm text-ink/55">
                La Maison, entreprises, agents.
              </p>
            </Link>
            <Link
              href="/#contact"
              className="card-lift rounded-2xl border border-ink/10 bg-white p-6 hover:border-terracotta/40"
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
        </div>
      </main>
      <Footer />
    </>
  );
}
