"use client";

import { useState } from "react";
import Link from "next/link";
import { LINKS } from "@/lib/constants";

const NAV = [
  { href: "/#offre", label: "Offres" },
  { href: "/#pourquoi", label: "Pourquoi nous" },
  { href: "/#process", label: "Process" },
  { href: "/#apropos", label: "À propos" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream text-ink shadow-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <LogoMark />
          <span className="font-[family-name:var(--font-montserrat)] text-[1.05rem] font-extrabold tracking-tight">
            ilémi.IA
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.92rem] text-ink/75 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden sm:inline-flex !py-2.5 !px-4 text-[0.8rem]"
          >
            Prendre rendez-vous
          </a>
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded border border-ink/15"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-ink/10 bg-cream px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Navigation mobile">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-1 text-ink/80"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
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

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="#C1622D" strokeWidth="2.2" />
      <circle cx="21" cy="11" r="6.5" stroke="#14141A" strokeWidth="2.2" opacity="0.55" />
      <circle cx="11" cy="21" r="6.5" stroke="#14141A" strokeWidth="2.2" opacity="0.55" />
      <circle cx="21" cy="21" r="6.5" stroke="#C1622D" strokeWidth="2.2" opacity="0.85" />
    </svg>
  );
}
