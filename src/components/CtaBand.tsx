import { LINKS } from "@/lib/constants";

export default function CtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-navy py-16 md:py-20"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="max-w-xl">
          <p className="section-label !text-terracotta">L&apos;IA intégrée à votre activité</p>
          <h2
            id="cta-heading"
            className="font-[family-name:var(--font-montserrat)] text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-cream"
          >
            Vous n&apos;avez pas besoin de tout comprendre pour commencer.
          </h2>
        </div>
        <a
          href={LINKS.calendly}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary shrink-0"
        >
          Prendre rendez-vous
        </a>
      </div>
    </section>
  );
}
