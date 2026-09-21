"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <p role="alert" className="text-sm text-terracotta">
        Lien invalide. Demandez un nouveau lien depuis « Mot de passe oublié ».
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Mot de passe : 8 caractères minimum.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.message || "Échec de la réinitialisation.");
        return;
      }
      window.location.assign(
        data.role === "ADMIN" ? "/admin" : "/espace"
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
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Nouveau mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-ink/15 bg-white px-3.5 py-3 outline-none focus:border-terracotta"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
          Confirmer
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded border border-ink/15 bg-white px-3.5 py-3 outline-none focus:border-terracotta"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-terracotta">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "…" : "Enregistrer et me connecter"}
      </button>
    </form>
  );
}
