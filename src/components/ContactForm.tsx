"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { LINKS } from "@/lib/constants";

const initial: ContactState = { ok: false, message: "" };

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  return (
    <div>
      <form action={action} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="name"
            name="name"
            label="Nom"
            required
            autoComplete="name"
          />
          <Field
            id="email"
            name="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <Field id="subject" name="subject" label="Sujet (optionnel)" />
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium text-cream/80"
          >
            Message <span className="text-terracotta">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded border border-cream/15 bg-ink/40 px-3.5 py-3 text-cream outline-none transition placeholder:text-cream/30 focus:border-terracotta"
            placeholder="Parlez-nous de votre besoin…"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="btn-primary w-full sm:w-auto disabled:opacity-60"
        >
          {pending ? "Envoi…" : "Envoyer le message"}
        </button>
      </form>

      {state.message && (
        <div
          role="status"
          className={`mt-5 rounded border px-4 py-3 text-sm leading-relaxed ${
            state.ok
              ? "border-emerald-500/40 bg-emerald-500/10 text-cream"
              : "border-terracotta/40 bg-terracotta/10 text-cream"
          }`}
        >
          <p>{state.message}</p>
          {(state.fallback || (!state.ok && state.message)) && !state.ok && (
            <ul className="mt-3 flex flex-col gap-2 text-cream/80 sm:flex-row sm:flex-wrap sm:gap-4">
              <li>
                <a
                  href={LINKS.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-cream"
                >
                  Calendly
                </a>
              </li>
              <li>
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-cream"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={LINKS.mailto}
                  className="underline underline-offset-2 hover:text-cream"
                >
                  {LINKS.email}
                </a>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-cream/80"
      >
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded border border-cream/15 bg-ink/40 px-3.5 py-3 text-cream outline-none transition placeholder:text-cream/30 focus:border-terracotta"
      />
    </div>
  );
}
