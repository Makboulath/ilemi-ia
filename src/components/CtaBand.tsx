import { LINKS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";

export default function CtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-navy py-14 sm:py-16 md:py-20"
    >
      <FadeIn className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-4 sm:gap-8 sm:px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="max-w-xl">
          <p className="section-label !text-terracotta">
            L&apos;IA intégrée à votre activité
          </p>
          <h2
            id="cta-heading"
            className="font-[family-name:var(--font-montserrat)] text-[clamp(1.5rem,3.5vw,2.4rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-cream"
          >
            Vous n&apos;avez pas besoin de tout comprendre pour commencer.
          </h2>
        </div>
        <a
          href={LINKS.calendly}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full shrink-0 sm:w-auto"
        >
          Prendre rendez-vous
        </a>
      </FadeIn>
    </section>
  );
}
