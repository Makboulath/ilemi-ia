import { TRUST_PILLARS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";

export default function PourquoiNous() {
  return (
    <section
      id="pourquoi"
      aria-labelledby="preuve-heading"
      className="bg-ink py-14 sm:py-16 md:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <FadeIn>
          <p className="section-label">Pourquoi nous faire confiance</p>
          <h2
            id="preuve-heading"
            className="font-[family-name:var(--font-montserrat)] text-[clamp(1.6rem,3.5vw,2.75rem)] font-extrabold leading-tight tracking-[-0.04em] text-cream"
          >
            On prouve
            <br />
            avant de promettre.
          </h2>
          <div className="mt-6 h-0.5 w-12 bg-terracotta" />
          <blockquote className="mt-8 max-w-md border-l-2 border-terracotta/50 pl-5 text-[1.02rem] leading-relaxed text-cream/70 sm:text-[1.05rem]">
            « On ne demande pas aux gens de comprendre l&apos;IA avant de
            venir. On les accueille d&apos;abord, et on avance ensemble, à leur
            rythme, jusqu&apos;à ce que la technique devienne un outil comme un
            autre. »
          </blockquote>
        </FadeIn>

        <div>
          {TRUST_PILLARS.map((item, i) => (
            <FadeIn key={item.d} delay={0.08 * i}>
              <div
                className={`flex gap-4 pb-7 sm:gap-5 ${
                  i < TRUST_PILLARS.length - 1
                    ? "mb-7 border-b border-cream/10"
                    : ""
                }`}
              >
                <div className="min-w-[4.25rem] sm:min-w-[4.5rem]">
                  <span className="font-[family-name:var(--font-montserrat)] text-lg font-extrabold text-terracotta sm:text-xl">
                    {item.d}
                  </span>
                </div>
                <div>
                  <p className="mb-2 font-[family-name:var(--font-montserrat)] text-[0.95rem] font-bold text-cream">
                    {item.l}
                  </p>
                  <p className="text-[0.92rem] leading-relaxed text-cream/55 sm:text-[0.95rem]">
                    {item.t}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
