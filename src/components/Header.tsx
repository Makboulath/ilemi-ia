"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LINKS } from "@/lib/constants";

const NAV = [
  { href: "/apprendre", label: "Apprendre" },
  { href: "/#offre", label: "Offres" },
  { href: "/#pourquoi", label: "Pourquoi nous" },
  { href: "/#process", label: "Process" },
  { href: "/#apropos", label: "À propos" },
  { href: "/#contact", label: "Contact" },
];

type MeUser = { email: string; role: "ADMIN" | "MEMBER" } | null;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<MeUser>(null);

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
    <header className="sticky top-0 z-50 bg-cream text-ink shadow-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo-mark.png"
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

        <div className="flex items-center gap-3">
          <a
            href={LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden !px-4 !py-2.5 text-[0.8rem] sm:inline-flex"
          >
            Prendre rendez-vous
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-ink/15 lg:hidden"
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

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-ink/10 bg-cream px-5 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Navigation mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 text-ink/80"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              className="py-1 font-medium text-ink"
              onClick={() => setOpen(false)}
            >
              {accountLabel}
            </Link>
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              Prendre rendez-vous
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
