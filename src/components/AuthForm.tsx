"use client";

import { useState } from "react";
import Link from "next/link";
import { safeNextPath } from "@/lib/safe-next";

type Mode = "login" | "register";

function resolveDest(
  nextPath: string,
  role: string | undefined,
  mode: Mode
): string {
  const safe = safeNextPath(nextPath, "/espace");
  // Admins: honor explicit deep-links (abonnement, studio, apprendre…).
  // Only bounce to /admin when next is the generic member home.
  if (role === "ADMIN" && mode === "login") {
    if (safe === "/espace" || safe === "/") return "/admin";
    return safe;
  }
  return safe;
}

export default function AuthForm({
  mode,
  nextPath,
}: {
  mode: Mode;
  nextPath: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.message || "Une erreur est survenue.");
        return;
      }
      const dest = resolveDest(nextPath, data.role, mode);
      // Full navigation so the session cookie is reliably picked up
      // and ?pack= resume on /abonnement runs on a clean mount.
      window.location.assign(dest);
    } catch {
      setError("Impossible de contacter le serveur.");
      setPending(false);
    }
  }

  const nextEnc = encodeURIComponent(safeNextPath(nextPath, "/espace"));

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
          className="field-light !rounded-lg"
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Mot de passe
          </label>
          {mode === "login" && (
            <Link
              href="/mot-de-passe-oublie"
              className="text-xs font-medium text-terracotta underline-offset-2 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          )}
        </div>
        <input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={mode === "register" ? 8 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-light !rounded-lg"
        />
        {mode === "register" && (
          <p className="mt-1 text-xs text-ink/45">8 caractères minimum.</p>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-terracotta">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} aria-busy={pending} className="btn-primary w-full">
        {pending
          ? mode === "login"
            ? "Connexion…"
            : "Création du compte…"
          : mode === "login"
            ? "Se connecter"
            : "Créer mon compte"}
      </button>
      <p className="text-center text-sm text-ink/55">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link
              href={`/inscription?next=${nextEnc}`}
              className="font-medium text-terracotta underline-offset-2 hover:underline"
            >
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit·e ?{" "}
            <Link
              href={`/connexion?next=${nextEnc}`}
              className="font-medium text-terracotta underline-offset-2 hover:underline"
            >
              Se connecter
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
