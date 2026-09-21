"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LINKS } from "@/lib/constants";

const NAV = [
  { href: "/#offre", label: "Offres" },
  { href: "/studio", label: "Studio" },
  { href: "/apprendre", label: "Apprendre" },
  { href: "/#apropos", label: "À propos" },
];

type MeUser = { email: string; role: "ADMIN" | "MEMBER" } | null;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<MeUser>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.ok && data.user) setUser(data.user);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const accountHref = user
    ? user.role === "ADMIN"
      ? "/admin"
      : "/espace"
    : "/connexion";
  const accountLabel = user
    ? user.role === "ADMIN"
      ? "Admin"
      : "Espace"
    : "Connexion";

  return (
    <header className="sticky top-0 z-50 bg-cream/95 text-ink shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo-mark-sm.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="font-[family-name:var(--font-montserrat)] text-[1.05rem] font-extrabold tracking-tight">
            ilémi.IA
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Navigation principale"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.92rem] text-ink/75 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            className="text-[0.92rem] font-medium text-ink/80 transition-colors hover:text-ink"
          >
            {accountLabel}
          </Link>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href={LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden !px-4 !py-2.5 text-[0.8rem] md:inline-flex"
          >
            Rendez-vous
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded border border-ink/15 transition hover:bg-ink/5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-cream lg:hidden"
          >
            <nav
              className="flex flex-col gap-1 px-5 py-4"
              aria-label="Navigation mobile"
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-md py-3 text-[1.05rem] text-ink/85 transition hover:bg-ink/5"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href={accountHref}
                className="rounded-md py-3 font-medium text-ink transition hover:bg-ink/5"
                onClick={() => setOpen(false)}
              >
                {accountLabel}
              </Link>
              <div className="mt-3 flex flex-col gap-2.5">
                <a
                  href={LINKS.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  onClick={() => setOpen(false)}
                >
                  Prendre rendez-vous
                </a>
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded bg-[#25D366] px-5 py-3 text-[0.875rem] font-[family-name:var(--font-montserrat)] font-bold text-white transition hover:brightness-105"
                  onClick={() => setOpen(false)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
