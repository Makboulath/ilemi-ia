import Image from "next/image";
import { LINKS } from "@/lib/constants";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-ink"
      aria-labelledby="hero-heading"
    >
      <Image
        src="/hero-fondatrice.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center] md:object-[78%_center]"
        aria-hidden
      />
      {/* Léger voile sombre pour lisibilité des textes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,20,26,0.88) 0%, rgba(20,20,26,0.72) 42%, rgba(20,20,26,0.45) 68%, rgba(20,20,26,0.35) 100%), linear-gradient(180deg, rgba(20,20,26,0.25) 0%, transparent 30%, rgba(20,20,26,0.55) 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-[1200px] flex-col justify-center px-5 py-20 md:px-8 md:py-28">
        <p className="section-label mb-4">L&apos;agence IA francophone</p>
        <h1
          id="hero-heading"
          className="max-w-3xl font-[family-name:var(--font-montserrat)] text-[clamp(2.4rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
        >
          L&apos;IA, enfin
          <br />
          chez vous.
        </h1>
        <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-cream/90 md:text-[1.15rem] drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
          Que vous vouliez apprendre, créer un projet avec l&apos;IA ou
          l&apos;intégrer dans votre entreprise, vous êtes au bon endroit.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Prendre rendez-vous
          </a>
          <a href="/#offre" className="btn-ghost">
            Découvrir les offres
          </a>
        </div>
      </div>
    </section>
  );
}
