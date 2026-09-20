import { LINKS } from "@/lib/constants";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-ink"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(35,80,120,0.55), transparent 60%), radial-gradient(ellipse 50% 40% at 30% 70%, rgba(193,98,45,0.18), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-10 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(90,160,200,0.5), transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-[1200px] flex-col justify-center px-5 py-20 md:px-8 md:py-28">
        <p className="section-label mb-4">L&apos;agence IA francophone</p>
        <h1
          id="hero-heading"
          className="max-w-3xl font-[family-name:var(--font-montserrat)] text-[clamp(2.4rem,6vw,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-cream"
        >
          L&apos;IA, enfin
          <br />
          chez vous.
        </h1>
        <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-cream/80 md:text-[1.15rem]">
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
