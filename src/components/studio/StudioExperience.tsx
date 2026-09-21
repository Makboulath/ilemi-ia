"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LINKS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

type ZoneId = "image" | "video" | "son";

type Wallet = {
  credits: number;
  plan: string;
  videosLeftToday: number;
  videoDailyCap: number;
};

type HistoryItem = {
  id: string;
  type: string;
  prompt: string;
  url: string | null;
  createdAt: string;
};

const AUDIO_LINKS = [
  {
    name: "ElevenLabs",
    href: "https://elevenlabs.io",
    desc: "Voix off et clonage vocal",
  },
  {
    name: "Suno",
    href: "https://suno.com",
    desc: "Génération musicale",
  },
  {
    name: "Udio",
    href: "https://www.udio.com",
    desc: "Chansons et ambiances",
  },
  {
    name: "AIVA",
    href: "https://www.aiva.ai",
    desc: "Composition assistée",
  },
];

export default function StudioExperience() {
  const [zone, setZone] = useState<ZoneId>("image");
  const [prompt, setPrompt] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [providers, setProviders] = useState({ image: true, video: false });
  const [adsense, setAdsense] = useState({
    configured: false,
    allowFake: false,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultKind, setResultKind] = useState<"image" | "video" | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [paywall, setPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<"credits" | "daily">(
    "credits",
  );
  const [guestMode, setGuestMode] = useState(false);
  const reduce = useReducedMotion();

  const refresh = useCallback(async () => {
    try {
      const [w, h] = await Promise.all([
        fetch("/api/studio/wallet").then((r) => r.json()),
        fetch("/api/studio/history").then((r) => r.json()),
      ]);
      if (w.ok) {
        setWallet(w.wallet);
        setProviders({
          image: true,
          video: !!(w.providers && w.providers.video),
        });
        setAdsense(w.adsense || { configured: false, allowFake: false });
      } else {
        setProviders((p) => ({ ...p, image: true }));
      }
      if (h.ok) setHistory(h.items || []);
    } catch {
      setProviders((p) => ({ ...p, image: true }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function generate() {
    setError("");
    setResultUrl(null);
    if (zone === "son") return;
    if (!prompt.trim()) {
      setError("Décrivez ce que vous voulez créer.");
      return;
    }

    const needCredits = zone === "image" ? 1 : 1;
    if (wallet && wallet.credits < needCredits) {
      setPaywallReason("credits");
      setPaywall(true);
      return;
    }
    if (zone === "video" && wallet && wallet.videosLeftToday <= 0) {
      setPaywallReason("daily");
      setPaywall(true);
      return;
    }

    setBusy(true);
    try {
      const endpoint =
        zone === "image" ? "/api/studio/image" : "/api/studio/video";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (data.wallet) setWallet(data.wallet);
      if (!data.ok) {
        if (data.code === "NO_CREDITS") {
          setPaywallReason("credits");
          setPaywall(true);
        } else if (data.code === "DAILY_CAP") {
          setPaywallReason("daily");
          setPaywall(true);
        } else {
          setError(data.message || "Échec de la génération.");
        }
        return;
      }
      setResultUrl(data.url);
      setResultKind(zone === "image" ? "image" : "video");
      setGuestMode(!!data.guest);
      if (!data.guest) await refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  }

  async function claimReward(fake: boolean) {
    setError("");
    try {
      const res = await fetch("/api/studio/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fake }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "Récompense indisponible.");
        return;
      }
      setWallet(data.wallet);
      setPaywall(false);
    } catch {
      setError("Erreur réseau.");
    }
  }

  return (
    <div className="relative overflow-hidden bg-ink text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-terracotta/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
      />

      <section className="relative mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label !text-gold">Studio créatif</p>
              <h1 className="font-[family-name:var(--font-montserrat)] text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                Studio Ilémi
              </h1>
              <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-cream/65">
                Image et vidéo courtes côté serveur (crédits + plafond
                quotidien). Audio : liens vers les meilleurs outils externes.
              </p>
            </div>
            {wallet && (
              <div className="rounded-2xl border border-cream/15 bg-navy/80 px-5 py-4 text-sm">
                <p className="text-cream/50">Solde</p>
                <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold text-gold">
                  {wallet.credits}{" "}
                  <span className="text-base font-medium text-cream/70">
                    crédits
                  </span>
                </p>
                <p className="mt-1 text-cream/45">
                  Vidéos aujourd&apos;hui : {wallet.videosLeftToday}/
                  {wallet.videoDailyCap} · Plan {wallet.plan}
                </p>
                <Link
                  href="/abonnement"
                  className="mt-2 inline-block text-xs font-medium text-terracotta underline-offset-2 hover:underline"
                >
                  Passer Pro →
                </Link>
              </div>
            )}
          </div>
        </FadeIn>

        <StaggerChildren className="mt-10 flex flex-wrap gap-2">
          {(
            [
              { id: "image" as const, label: "Image · 1 crédit" },
              { id: "video" as const, label: "Vidéo ~10s · 1 crédit" },
              { id: "son" as const, label: "Son · liens" },
            ] as const
          ).map((z) => (
            <StaggerItem key={z.id}>
              <button
                type="button"
                onClick={() => {
                  setZone(z.id);
                  setError("");
                  setResultUrl(null);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  zone === z.id
                    ? "border-terracotta bg-terracotta text-cream"
                    : "border-cream/20 text-cream/70 hover:border-cream/40"
                }`}
              >
                {z.label}
              </button>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn className="mt-10" delay={0.05}>
          {zone !== "son" ? (
            <div className="rounded-2xl border border-cream/12 bg-navy/70 p-6 md:p-8">
              <h2 className="font-[family-name:var(--font-montserrat)] text-xl font-bold">
                {zone === "image" ? "Générer une image" : "Générer une vidéo courte"}
              </h2>
              <p className="mt-2 text-sm text-cream/50">
                {zone === "image"
                  ? "Images gratuites via Pollinations (Sana HD + enhance). Sans compte : démo. Qualité premium : clé Pollinations ou Gemini plus tard."
                  : providers.video
                    ? "Provider vidéo fal.ai configuré."
                    : "Vidéo : connectez-vous et configurez FAL_KEY (pas encore en démo gratuite)."}
              </p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder={
                  zone === "image"
                    ? "Ex. Une maison chaleureuse au crépuscule, style éditorial ouest-africain…"
                    : "Ex. Travelling doux sur un atelier créatif, lumière dorée, ~10 secondes…"
                }
                className="mt-4 w-full rounded-xl border border-cream/15 bg-ink/60 px-4 py-3 text-sm text-cream outline-none placeholder:text-cream/30 focus:border-terracotta"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={generate}
                  disabled={busy}
                  className="btn-primary disabled:opacity-50"
                >
                  {busy ? "Génération…" : "Générer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaywallReason("credits");
                    setPaywall(true);
                  }}
                  className="btn-ghost !border-cream/25"
                >
                  + crédits (pub / abonnement)
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-terracotta" role="alert">
                  {error}
                </p>
              )}
              {guestMode && !error && zone === "image" && (
                <p className="mt-3 text-sm text-cream/55">
                  Mode démo gratuit.{" "}
                  <Link href="/connexion?next=/studio" className="text-gold underline">
                    Connexion
                  </Link>{" "}
                  pour garder l&apos;historique et les crédits.
                </p>
              )}
              <div className="relative mt-6 min-h-[200px] overflow-hidden rounded-xl border border-cream/10 bg-gradient-to-br from-navy to-ink">
                {busy ? (
                  <div className="flex min-h-[200px] items-center justify-center">
                    <motion.div
                      className="h-14 w-14 rounded-full border-2 border-terracotta/40 border-t-terracotta"
                      animate={reduce ? undefined : { rotate: 360 }}
                      transition={
                        reduce
                          ? undefined
                          : { repeat: Infinity, duration: 0.9, ease: "linear" }
                      }
                    />
                  </div>
                ) : resultUrl && resultKind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resultUrl}
                    alt="Résultat"
                    className="max-h-[420px] w-full object-contain"
                  />
                ) : resultUrl && resultKind === "video" ? (
                  <video
                    src={resultUrl}
                    controls
                    className="max-h-[420px] w-full"
                  />
                ) : (
                  <p className="flex min-h-[200px] items-center justify-center text-sm text-cream/35">
                    Le résultat apparaîtra ici
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-cream/12 bg-navy/70 p-6 md:p-8">
              <h2 className="font-[family-name:var(--font-montserrat)] text-xl font-bold">
                Son — outils externes
              </h2>
              <p className="mt-2 max-w-xl text-sm text-cream/50">
                Pas de génération audio dans le Studio. Ouvrez ces services
                pour voix, musique et ambiances.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {AUDIO_LINKS.map((a) => (
                  <a
                    key={a.name}
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-cream/12 bg-ink/40 p-4 transition hover:border-gold/50"
                  >
                    <p className="font-bold text-gold">{a.name}</p>
                    <p className="mt-1 text-sm text-cream/55">{a.desc}</p>
                    <p className="mt-2 text-xs text-cream/35">Ouvrir ↗</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </FadeIn>

        {history.length > 0 && (
          <FadeIn className="mt-12" delay={0.08}>
            <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-bold">
              Historique récent
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-cream/10 bg-navy/50 p-3"
                >
                  <p className="text-[0.65rem] uppercase tracking-wider text-gold">
                    {item.type}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-cream/55">
                    {item.prompt}
                  </p>
                  {item.url && item.type === "image" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt=""
                      className="mt-2 h-28 w-full rounded-lg object-cover"
                    />
                  )}
                  {item.url && item.type === "video" && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs text-terracotta underline"
                    >
                      Voir la vidéo
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </FadeIn>
        )}
      </section>

      <AnimatePresence>
        {paywall && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/70"
              aria-label="Fermer"
              onClick={() => setPaywall(false)}
            />
            <motion.div
              initial={reduce ? false : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: 24, opacity: 0 }}
              className="relative z-10 w-full max-w-lg rounded-2xl border border-cream/15 bg-navy p-7 text-cream shadow-2xl"
            >
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-gold">
                {paywallReason === "daily"
                  ? "Limite vidéo du jour"
                  : "Plus de crédits"}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold">
                Continuer à créer
              </h2>
              <p className="mt-3 text-sm text-cream/65">
                {paywallReason === "daily"
                  ? "Vous avez atteint 2 vidéos aujourd’hui (heure Porto-Novo). Revenez demain, ou passez Pro pour plus de confort."
                  : "Regardez une pub pour +1 crédit, ou abonnez-vous pour un rechargement mensuel."}
              </p>

              <div className="mt-6 space-y-3">
                {adsense.configured ? (
                  <div className="rounded-xl border border-cream/15 p-4">
                    <p className="text-sm text-cream/60">
                      Emplacement AdSense (récompense)
                    </p>
                    <ins
                      className="adsbygoogle"
                      style={{ display: "block" }}
                      data-ad-client={
                        process.env.NEXT_PUBLIC_ADSENSE_CLIENT || undefined
                      }
                      data-ad-slot={
                        process.env.NEXT_PUBLIC_ADSENSE_SLOT_REWARD || undefined
                      }
                      data-ad-format="auto"
                    />
                    <button
                      type="button"
                      onClick={() => claimReward(false)}
                      className="btn-primary mt-3 w-full"
                    >
                      J’ai regardé · +1 crédit
                    </button>
                  </div>
                ) : adsense.allowFake ? (
                  <button
                    type="button"
                    onClick={() => claimReward(true)}
                    className="btn-primary w-full"
                  >
                    Simuler une pub (dev) · +1 crédit
                  </button>
                ) : (
                  <div className="rounded-xl border border-cream/10 bg-ink/40 px-4 py-3 text-sm text-cream/55">
                    Pub bientôt disponible. En attendant, abonnez-vous ou
                    contactez-nous.
                  </div>
                )}

                <Link href="/abonnement" className="btn-ghost !border-cream/25 block text-center">
                  Voir l’abonnement Pro
                </Link>
                <button
                  type="button"
                  onClick={() => setPaywall(false)}
                  className="w-full text-sm text-cream/45"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
