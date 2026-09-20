"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function AuthForm({
  mode,
  nextPath,
}: {
  mode: Mode;
  nextPath: string;
}) {
  const router = useRouter();
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
      const dest =
        data.role === "ADMIN" && mode === "login"
          ? nextPath.startsWith("/admin")
            ? nextPath
            : "/admin"
          : nextPath.startsWith("/")
            ? nextPath
            : "/espace";
      router.push(dest);
      router.refresh();
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
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={mode === "register" ? 8 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-ink/15 bg-white px-3.5 py-3 outline-none focus:border-terracotta"
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
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending
          ? "…"
          : mode === "login"
            ? "Se connecter"
            : "Créer mon compte"}
      </button>
      <p className="text-center text-sm text-ink/55">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link
              href={`/inscription?next=${encodeURIComponent(nextPath)}`}
              className="font-medium text-terracotta underline-offset-2 hover:underline"
            >
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit·e ?{" "}
            <Link
              href={`/connexion?next=${encodeURIComponent(nextPath)}`}
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
