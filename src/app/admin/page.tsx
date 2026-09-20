import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";
import { ensureDb } from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/connexion?next=/admin");
  if (session.role !== "ADMIN") redirect("/espace");

  let pageViews = 0;
  let conversions = 0;
  let recent: { path: string; createdAt: Date }[] = [];
  let dbOk = true;

  try {
    const prisma = await ensureDb();
    const [pv, cv, paths] = await Promise.all([
      prisma.pageView.count(),
      prisma.conversion.count(),
      prisma.pageView.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { path: true, createdAt: true },
      }),
    ]);
    pageViews = pv;
    conversions = cv;
    recent = paths;
  } catch {
    dbOk = false;
  }

  return (
    <>
      <Header />
      <main className="bg-cream text-ink">
        <div className="mx-auto max-w-[1000px] px-5 py-16 md:px-8 md:py-24">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-label">Administration</p>
              <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight">
                Tableau de bord
              </h1>
              <p className="mt-2 text-sm text-ink/55">{session.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="btn-ghost !border-ink/20 !text-ink !py-2.5">
                Voir le site
              </Link>
              <LogoutButton />
            </div>
          </div>

          {!dbOk && (
            <p className="mt-6 rounded border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm">
              Base de données temporairement indisponible (SQLite éphémère sur
              Vercel). Les compteurs peuvent être à zéro après un redémarrage
              d&apos;instance. Prévoir Postgres pour la production.
            </p>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-white p-7">
              <p className="text-sm text-ink/50">Visiteurs (page views)</p>
              <p className="mt-2 font-[family-name:var(--font-montserrat)] text-4xl font-extrabold text-terracotta">
                {pageViews}
              </p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-7">
              <p className="text-sm text-ink/50">Conversions</p>
              <p className="mt-2 font-[family-name:var(--font-montserrat)] text-4xl font-extrabold text-terracotta">
                {conversions}
              </p>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold">
              Chemins récents
            </h2>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">Aucune visite enregistrée.</p>
            ) : (
              <ul className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
                {recent.map((r, i) => (
                  <li
                    key={`${r.path}-${r.createdAt.toISOString()}-${i}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm"
                  >
                    <code className="text-ink/80">{r.path}</code>
                    <time className="text-ink/45" dateTime={r.createdAt.toISOString()}>
                      {r.createdAt.toLocaleString("fr-FR", {
                        timeZone: "Africa/Porto-Novo",
                      })}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
