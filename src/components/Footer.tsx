import Image from "next/image";
import Link from "next/link";
import { LINKS } from "@/lib/constants";

const FOOTER_NAV = [
  { href: "/#offre", label: "Offres" },
  { href: "/studio", label: "Studio" },
  { href: "/apprendre", label: "Apprendre" },
  { href: "/#apropos", label: "À propos" },
  { href: "/connexion", label: "Connexion" },
];

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-mark.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div>
            <p className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-cream">
              ilémi.IA
            </p>
            <p className="mt-0.5 text-sm text-cream/40">
              L&apos;IA enfin chez vous.
            </p>
          </div>
        </div>

        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/55"
          aria-label="Pied de page"
        >
          {FOOTER_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-cream">
              {item.label}
            </Link>
          ))}
          <a href={LINKS.mailto} className="hover:text-cream">
            {LINKS.email}
          </a>
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cream"
          >
            WhatsApp
          </a>
          <a
            href={LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cream"
          >
            Calendly
          </a>
          <Link href="/mentions-legales" className="hover:text-cream">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-cream">
            Confidentialité
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-[1200px] px-5 text-xs text-cream/28 md:px-8">
        © 2026 Ilémi.IA. Tous droits réservés.
      </p>
    </footer>
  );
}
