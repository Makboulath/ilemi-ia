"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LINKS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";

export default function AbonnementClient() {
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    if (params.get("success") === "1") {
      setMessage(
        "Paiement reçu (ou session créée). Votre plan Pro et crédits seront activés via le webhook Stripe.",
      );
    } else if (params.get("cancel") === "1") {
      setMessage("Paiement annulé. Vous pouvez réessayer quand vous voulez.");
    }
    // Probe checkout availability
    fetch("/api/studio/wallet")
      .then((r) => r.json())
      .then(() => {
        /* wallet may 401 if not logged — page still useful */
      })
      .catch(() => {});
    setStripeReady(
      !!(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SITE_URL
      ),
    );
  }, [params]);

  async function checkout() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.code === "STRIPE_UNAVAILABLE") {
        await fetch("/api/abonnement/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "monthly" }),
        });
        setMessage(
          "Paiement bientôt disponible. Nous avons enregistré votre intention — contactez-nous sur WhatsApp ou Calendly.",
        );
        return;
      }
      setMessage(data.message || "Impossible de démarrer le paiement.");
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  }

  async function recordIntent() {
    setBusy(true);
    try {
      await fetch("/api/abonnement/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly" }),
      });
      setMessage("Intention enregistrée. On vous recontacte rapidement.");
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[800px] px-5 py-16 md:px-8 md:py-24">
      <FadeIn>
        <p className="section-label">Studio</p>
        <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight md:text-4xl">
          Abonnement Pro
        </h1>
        <p className="mt-4 text-ink/65">
          Recharge mensuelle de <strong>50 crédits</strong>, accès prioritaire
          au Studio, et plafond vidéo plus confortable côté usage quotidien.
        </p>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-10">
        <div className="rounded-2xl border border-terracotta/40 border-t-[3px] bg-white p-7 md:p-9">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-terracotta">
            Mensuel
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold">
            Studio Pro
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/65">
            <li>+ 50 crédits / mois</li>
            <li>Image (1 crédit) · Vidéo courte (1 crédit, max 2/jour)</li>
            <li>Historique des générations</li>
            <li>Support via WhatsApp / Calendly</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={checkout}
              disabled={busy}
              className="btn-primary disabled:opacity-50"
            >
              {busy ? "Redirection…" : "S’abonner (Stripe)"}
            </button>
            <button
              type="button"
              onClick={recordIntent}
              disabled={busy}
              className="btn-ghost !border-ink/20 !text-ink disabled:opacity-50"
            >
              Laisser mon intention
            </button>
          </div>
          {message && (
            <p className="mt-4 text-sm text-ink/70" role="status">
              {message}
            </p>
          )}
          <p className="mt-4 text-xs text-ink/40">
            Si Stripe n’est pas configuré (
            <code className="text-[0.7rem]">STRIPE_SECRET_KEY</code> + price
            ID), le bouton enregistre une intention et propose un fallback.
            {stripeReady ? "" : ""}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta underline-offset-2 hover:underline"
            >
              WhatsApp
            </a>
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta underline-offset-2 hover:underline"
            >
              Calendly
            </a>
            <Link
              href="/studio"
              className="text-ink/50 underline-offset-2 hover:underline"
            >
              ← Retour Studio
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
