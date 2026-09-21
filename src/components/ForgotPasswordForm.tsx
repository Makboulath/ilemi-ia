"use client";

import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.message || "Une erreur est survenue.");
        return;
      }
      setDone(
        data.message ||
          "Si un compte existe pour cet email, un lien vient d’être envoyé."
      );
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-ink/15 bg-white px-3.5 py-3 outline-none focus:border-terracotta"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-terracotta">
          {error}
        </p>
      )}
      {done && (
        <p role="status" className="rounded-lg border border-gold/30 bg-gold/10 px-3.5 py-2.5 text-sm text-ink/75">
          {done}
        </p>
      )}
      <button type="submit" disabled={pending || !!done} className="btn-primary w-full disabled:opacity-50">
        {pending ? "…" : "Envoyer le lien"}
      </button>
    </form>
  );
}
