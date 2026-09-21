"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LINKS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";
import {
  CREDIT_PACKS,
  getPack,
  type CreditPack,
  type CreditPackId,
} from "@/lib/studio/packs";

/** Login/signup return URL that can resume a pack purchase. */
function authReturnUrl(packId?: string) {
  const next = packId ? `/abonnement?pack=${packId}` : "/abonnement";
  // Single encodeURIComponent — do not pre-encode for <Link> (Next encodes once).
  return `/connexion?next=${encodeURIComponent(next)}`;
}

type Order = {
  id: string;
  code: string;
  packId: string;
  amountFcfa: number;
  imageCredits: number;
  videoCredits: number;
  status: string;
  smsRef?: string | null;
  merchantNumber: string;
  createdAt: string;
};

type PaymentInfo = {
  merchantNumber: string;
  amountFcfa: number;
  code: string;
  moovUssd: string;
};

function formatFcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function AbonnementClient() {
  const params = useSearchParams();
  const router = useRouter();
  const resumeLock = useRef(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [smsRef, setSmsRef] = useState("");
  const [copied, setCopied] = useState("");
  const [stripeMsg, setStripeMsg] = useState("");

  const applyOpenOrder = useCallback((open: Order) => {
    setActiveOrder(open);
    setPayment({
      merchantNumber: open.merchantNumber,
      amountFcfa: open.amountFcfa,
      code: open.code,
      moovUssd: `*880*1*1*${open.merchantNumber}*${open.merchantNumber}*${open.amountFcfa}#`,
    });
  }, []);

  const createOrder = useCallback(async (pack: CreditPack) => {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/credits/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: pack.id as CreditPackId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 || data?.message === "Non authentifié.") {
        setLoggedIn(false);
        window.location.href = authReturnUrl(pack.id);
        return false;
      }
      if (!data.ok) {
        setMessage(data.message || "Impossible de créer la commande.");
        return false;
      }
      setActiveOrder(data.order);
      setPayment(data.payment);
      setSmsRef("");
      return true;
    } catch {
      setMessage("Erreur réseau.");
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  /** false = logged out; Order = open order applied; null = logged in, no open order */
  const refreshOrders = useCallback(async (): Promise<false | Order | null> => {
    try {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (!me?.ok) {
        setLoggedIn(false);
        return false;
      }
      setLoggedIn(true);
      const res = await fetch("/api/credits/order").then((r) => r.json());
      if (res.ok && Array.isArray(res.orders)) {
        const open = res.orders.find(
          (o: Order) => o.status === "PENDING" || o.status === "SUBMITTED",
        );
        if (open) {
          applyOpenOrder(open);
          return open;
        }
      }
      return null;
    } catch {
      setLoggedIn(false);
      return false;
    }
  }, [applyOpenOrder]);

  const packId = params.get("pack");
  const stripeFlag = params.get("success") === "1"
    ? "success"
    : params.get("cancel") === "1"
      ? "cancel"
      : null;

  useEffect(() => {
    if (stripeFlag === "success") {
      setStripeMsg(
        "Paiement Stripe reçu (ou session créée). Votre plan Pro sera activé via le webhook.",
      );
    } else if (stripeFlag === "cancel") {
      setStripeMsg("Paiement Stripe annulé.");
    }

    let cancelled = false;
    void (async () => {
      const result = await refreshOrders();
      if (cancelled || result === false) return;

      if (!packId) return;

      // Already have a pending/submitted order → show it, drop ?pack=
      if (result) {
        router.replace("/abonnement", { scroll: false });
        return;
      }

      // Resume pack purchase after login/signup (?pack=essai|createur|studio)
      const pack = getPack(packId);
      if (!pack) {
        router.replace("/abonnement", { scroll: false });
        return;
      }

      const lockKey = `ilemi-abo-resume:${packId}`;
      let shouldCreate = true;
      try {
        const lock = sessionStorage.getItem(lockKey);
        if (lock === "done") {
          router.replace("/abonnement", { scroll: false });
          return;
        }
        if (lock === "pending") {
          // Sibling effect / Strict Mode — wait for in-flight create, then refresh
          shouldCreate = false;
        } else {
          sessionStorage.setItem(lockKey, "pending");
        }
      } catch {
        if (resumeLock.current) shouldCreate = false;
        else resumeLock.current = true;
      }

      if (shouldCreate) {
        // Create FIRST, then clean URL — replacing ?pack= early cancelled the
        // effect (params change) and aborted createOrder → blank page / no USSD.
        const created = await createOrder(pack);
        if (created) {
          try {
            sessionStorage.setItem(lockKey, "done");
          } catch {
            /* ignore */
          }
        } else {
          try {
            sessionStorage.removeItem(lockKey);
          } catch {
            /* ignore */
          }
          resumeLock.current = false;
          return;
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) return;
        await refreshOrders();
      }

      if (!cancelled) {
        router.replace("/abonnement", { scroll: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [packId, stripeFlag, refreshOrders, router, createOrder]);

  async function handleCopy(label: string, value: string) {
    const ok = await copyText(value);
    setCopied(ok ? label : "");
    if (ok) setTimeout(() => setCopied(""), 2000);
  }

  async function buyPack(pack: CreditPack) {
    if (loggedIn !== true) {
      window.location.href = authReturnUrl(pack.id);
      return;
    }
    await createOrder(pack);
  }

  async function confirmPaid() {
    if (!activeOrder) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/credits/paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: activeOrder.id,
          smsRef: smsRef.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setMessage(data.message || "Échec de la confirmation.");
        return;
      }
      setActiveOrder(data.order);
      setMessage(
        data.message ||
          "Paiement signalé. Validation admin en cours — crédits bientôt crédités.",
      );
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  }

  async function stripeCheckout() {
    if (loggedIn !== true) {
      window.location.href = authReturnUrl();
      return;
    }
    setBusy(true);
    setStripeMsg("");
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
        setStripeMsg(
          "Stripe non configuré. Intention enregistrée — contactez-nous sur WhatsApp.",
        );
        return;
      }
      setStripeMsg(data.message || "Impossible de démarrer Stripe.");
    } catch {
      setStripeMsg("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  }

  const packName = (id: string) =>
    CREDIT_PACKS.find((p) => p.id === id)?.name || id;

  return (
    <div className="mx-auto max-w-[960px] px-5 py-16 md:px-8 md:py-24">
      <FadeIn>
        <p className="section-label">Studio</p>
        <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight md:text-4xl">
          Acheter des crédits
        </h1>
        <p className="mt-4 max-w-2xl text-ink/65">
          Payez par Mobile Money (Moov, MTN, Celtiis), indiquez le code commande
          dans le motif / référence, puis validez. Un admin crédite votre
          portefeuille après vérification.
        </p>
        {loggedIn === false && (
          <p className="mt-4 rounded-xl border border-terracotta/25 bg-terracotta/5 px-4 py-3 text-sm text-ink/70">
            <a
              href={authReturnUrl()}
              className="font-semibold text-terracotta underline-offset-2 hover:underline"
            >
              Connectez-vous
            </a>{" "}
            ou{" "}
            <a
              href={`/inscription?next=${encodeURIComponent("/abonnement")}`}
              className="font-semibold text-terracotta underline-offset-2 hover:underline"
            >
              créez un compte
            </a>{" "}
            pour acheter un pack et recevoir votre code ILM-XXXX.
          </p>
        )}
      </FadeIn>

      <FadeIn delay={0.06} className="mt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <article
              key={pack.id}
              className={`flex flex-col rounded-2xl border bg-white p-6 ${
                pack.highlight
                  ? "border-terracotta/50 border-t-[3px] shadow-sm"
                  : "border-ink/10"
              }`}
            >
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-terracotta">
                {pack.highlight ? "Populaire" : "Pack"}
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-montserrat)] text-xl font-extrabold">
                {pack.name}
              </h2>
              <p className="mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold text-ink">
                {formatFcfa(pack.amountFcfa)}
              </p>
              <p className="mt-3 text-sm text-ink/60">{pack.blurb}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-ink/55">
                <li>✓ {pack.imageCredits} images HQ</li>
                <li>
                  ✓{" "}
                  {pack.videoCredits > 0
                    ? `${pack.videoCredits} vidéo${pack.videoCredits > 1 ? "s" : ""} (10s, audio natif)`
                    : "Pas de vidéo"}
                </li>
              </ul>
              {loggedIn === null ? (
                <button
                  type="button"
                  disabled
                  className="btn-primary mt-6 w-full disabled:opacity-50"
                >
                  …
                </button>
              ) : loggedIn === false ? (
                <a
                  href={authReturnUrl(pack.id)}
                  className="btn-primary mt-6 w-full text-center"
                >
                  Se connecter pour acheter
                </a>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => buyPack(pack)}
                  className="btn-primary mt-6 w-full disabled:opacity-50"
                >
                  {busy ? "…" : "Acheter des crédits"}
                </button>
              )}
            </article>
          ))}
        </div>
      </FadeIn>

      {activeOrder && payment && (
        <FadeIn delay={0.08} className="mt-10">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-terracotta">
              Paiement Mobile Money
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-montserrat)] text-xl font-extrabold">
              Commande {activeOrder.code} · {packName(activeOrder.packId)}
            </h2>
            <p className="mt-2 text-sm text-ink/55">
              Statut :{" "}
              <strong className="text-ink">
                {activeOrder.status === "SUBMITTED"
                  ? "En attente de validation admin"
                  : activeOrder.status === "PENDING"
                    ? "En attente de paiement"
                    : activeOrder.status}
              </strong>
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-ink/10 bg-cream/50 p-4">
                <p className="text-xs uppercase tracking-wide text-ink/45">
                  Montant
                </p>
                <p className="mt-1 font-[family-name:var(--font-montserrat)] text-lg font-bold">
                  {formatFcfa(payment.amountFcfa)}
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-terracotta underline-offset-2 hover:underline"
                  onClick={() =>
                    handleCopy("amount", String(payment.amountFcfa))
                  }
                >
                  {copied === "amount" ? "Copié ✓" : "Copier le montant"}
                </button>
              </div>
              <div className="rounded-xl border border-ink/10 bg-cream/50 p-4">
                <p className="text-xs uppercase tracking-wide text-ink/45">
                  Numéro marchand
                </p>
                <p className="mt-1 font-[family-name:var(--font-montserrat)] text-lg font-bold tracking-wide">
                  {payment.merchantNumber}
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-terracotta underline-offset-2 hover:underline"
                  onClick={() =>
                    handleCopy("merchant", payment.merchantNumber)
                  }
                >
                  {copied === "merchant" ? "Copié ✓" : "Copier le numéro"}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-ink/10 bg-cream/40 p-4">
              <p className="text-xs uppercase tracking-wide text-ink/45">
                Code à indiquer (motif / référence)
              </p>
              <p className="mt-1 font-mono text-lg font-bold tracking-wider text-terracotta">
                {payment.code}
              </p>
              <button
                type="button"
                className="mt-2 text-xs font-medium text-terracotta underline-offset-2 hover:underline"
                onClick={() => handleCopy("code", payment.code)}
              >
                {copied === "code" ? "Copié ✓" : "Copier le code"}
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-ink/70">
              <div>
                <h3 className="font-semibold text-ink">Moov Money</h3>
                <p className="mt-1">
                  Composez le USSD (ou copiez-le) puis validez sur votre
                  téléphone :
                </p>
                <code className="mt-2 block break-all rounded-lg bg-ink px-3 py-2 font-mono text-xs text-gold">
                  {payment.moovUssd}
                </code>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-terracotta underline-offset-2 hover:underline"
                  onClick={() => handleCopy("ussd", payment.moovUssd)}
                >
                  {copied === "ussd" ? "Copié ✓" : "Copier le USSD Moov"}
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-ink">MTN / Celtiis</h3>
                <ol className="mt-1 list-decimal space-y-1 pl-5">
                  <li>
                    Ouvrez votre app ou menu transfert Mobile Money.
                  </li>
                  <li>
                    Transférez{" "}
                    <strong>{formatFcfa(payment.amountFcfa)}</strong> vers{" "}
                    <strong>{payment.merchantNumber}</strong>.
                  </li>
                  <li>
                    Indiquez le code <strong>{payment.code}</strong> dans le
                    motif / référence si possible.
                  </li>
                  <li>
                    Revenez ici et cliquez « J&apos;ai payé » (réf. SMS
                    optionnelle).
                  </li>
                </ol>
              </div>
            </div>

            {activeOrder.status !== "SUBMITTED" && (
              <div className="mt-6 space-y-3 border-t border-ink/10 pt-6">
                <label className="block text-sm text-ink/70">
                  Référence SMS (optionnel)
                  <input
                    type="text"
                    value={smsRef}
                    onChange={(e) => setSmsRef(e.target.value)}
                    placeholder="Ex. ID transaction reçu par SMS"
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta"
                  />
                </label>
                <button
                  type="button"
                  disabled={busy}
                  onClick={confirmPaid}
                  className="btn-primary disabled:opacity-50"
                >
                  {busy ? "Envoi…" : "J’ai payé"}
                </button>
              </div>
            )}

            {activeOrder.status === "SUBMITTED" && (
              <p className="mt-6 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-ink/75">
                Paiement signalé. Dès validation admin, vos{" "}
                <strong>{activeOrder.imageCredits} images HQ</strong>
                {activeOrder.videoCredits > 0
                  ? ` et ${activeOrder.videoCredits} vidéo(s)`
                  : ""}{" "}
                seront ajoutés à votre solde Studio.
              </p>
            )}
          </div>
        </FadeIn>
      )}

      {message && (
        <p className="mt-6 text-sm text-ink/70" role="status">
          {message}
        </p>
      )}

      <FadeIn delay={0.1} className="mt-14">
        <details className="rounded-2xl border border-ink/10 bg-white p-6">
          <summary className="cursor-pointer font-[family-name:var(--font-montserrat)] font-bold text-ink/80">
            Autre option · Abonnement Stripe (mensuel)
          </summary>
          <p className="mt-3 text-sm text-ink/60">
            Recharge mensuelle de 50 crédits image via carte (si Stripe est
            configuré). Le chemin principal reste Mobile Money.
          </p>
          <button
            type="button"
            onClick={stripeCheckout}
            disabled={busy}
            className="btn-ghost mt-4 !border-ink/20 !text-ink disabled:opacity-50"
          >
            S’abonner (Stripe)
          </button>
          {stripeMsg && (
            <p className="mt-3 text-sm text-ink/65" role="status">
              {stripeMsg}
            </p>
          )}
        </details>
      </FadeIn>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <a
          href={LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terracotta underline-offset-2 hover:underline"
        >
          WhatsApp
        </a>
        <Link
          href="/studio"
          className="text-ink/50 underline-offset-2 hover:underline"
        >
          ← Retour Studio
        </Link>
      </div>
    </div>
  );
}
