import Image from "next/image";
import { VALUES } from "@/lib/constants";

export default function APropos() {
  return (
    <section
      id="apropos"
      aria-labelledby="about-heading"
      className="bg-navy py-16 md:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] items-start gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <div className="relative overflow-hidden">
          <Image
            src="/photo-1.jpg"
            alt="Makboulath Raoufou, fondatrice d'Ilémi.IA"
            width={800}
            height={1000}
            className="h-[280px] w-full object-cover object-top md:h-[500px]"
            priority={false}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy to-transparent"
          />
        </div>

        <div>
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

          <div className="mt-10 flex flex-wrap gap-3">
            <Image
              src="/certificat.png"
              alt="Certification"
              width={120}
              height={80}
              className="h-16 w-auto rounded object-contain opacity-90"
            />
            <Image
              src="/img7114.png"
              alt="Illustration Ilémi"
              width={120}
              height={80}
              className="h-16 w-auto rounded object-cover opacity-90"
            />
            <Image
              src="/img7115.png"
              alt="Communauté Ilémi"
              width={120}
              height={80}
              className="h-16 w-auto rounded object-cover opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
