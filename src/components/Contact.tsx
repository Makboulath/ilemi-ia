import ContactForm from "@/components/ContactForm";
import { LINKS } from "@/lib/constants";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-ink py-16 md:py-28"
    >
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <div>
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Réserver sur Calendly
            </a>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
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
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
