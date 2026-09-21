import Image from "next/image";
import { VALUES } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";

export default function APropos() {
  return (
    <section
      id="apropos"
      aria-labelledby="about-heading"
      className="bg-navy py-14 sm:py-16 md:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] items-start gap-8 px-4 sm:gap-10 sm:px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <FadeIn className="img-zoom relative overflow-hidden rounded-sm">
          <Image
            src="/photo-1.jpg"
            alt="Makboulath Raoufou, fondatrice d'ilémi.IA"
            width={800}
            height={1000}
            className="h-[260px] w-full object-cover object-top sm:h-[320px] md:h-[500px]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy to-transparent"
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="section-label">À propos</p>
          <h2
            id="about-heading"
            className="font-[family-name:var(--font-montserrat)] text-[clamp(1.7rem,3.5vw,2.6rem)] font-extrabold leading-tight tracking-[-0.03em] text-cream"
          >
            Une maison, pas une usine.
          </h2>
          <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-cream/65">
            <p>
              La fondatrice vient de la finance, un monde qui exclut par le
              jargon. Avec{" "}
              <strong className="font-medium text-cream/90">
                Women on Web3 / Crypt&apos;O Féminin
              </strong>
              , elle a ouvert un univers qui fait fuir 9 personnes sur 10 à des
              femmes francophones d&apos;Afrique qu&apos;on n&apos;y invitait
              jamais.
            </p>
            <p>
              L&apos;IA, c&apos;est la même histoire qui recommence.{" "}
              <strong className="font-medium text-cream/90">
                Ilémi.IA, c&apos;est cette porte qui s&apos;ouvre.
              </strong>
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div
                key={v.l}
                className="border-t border-cream/15 pt-3.5"
              >
                <p className="mb-1 font-[family-name:var(--font-montserrat)] text-[0.85rem] font-bold text-cream">
                  {v.l}
                </p>
                <p className="text-[0.85rem] text-cream/45">{v.s}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
