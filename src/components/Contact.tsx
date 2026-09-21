import ContactForm from "@/components/ContactForm";
import { LINKS } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-ink py-14 sm:py-16 md:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:gap-12 sm:px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <FadeIn>
          <p className="section-label">Contact</p>
          <h2
            id="contact-heading"
            className="font-[family-name:var(--font-montserrat)] text-[clamp(1.7rem,3.5vw,2.6rem)] font-extrabold leading-tight tracking-[-0.03em] text-cream"
          >
            Parlons de votre projet.
          </h2>
          <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-cream/60">
            Réservez 30 minutes via Calendly, ou envoyez un message WhatsApp.
            Gratuit, sans engagement.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              Réserver sur Calendly
            </a>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full sm:w-auto"
            >
              Écrire sur WhatsApp
            </a>
          </div>

          <p className="mt-6 text-sm text-cream/45">
            Email :{" "}
            <a
              href={LINKS.mailto}
              className="text-cream/75 underline-offset-2 hover:underline"
            >
              {LINKS.email}
            </a>
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ContactForm />
        </FadeIn>
      </div>
    </section>
  );
}
