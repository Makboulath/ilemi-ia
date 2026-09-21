"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone("");
    if (newPassword.length < 8) {
      setError("Nouveau mot de passe : 8 caractères minimum.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.message || "Échec du changement.");
        return;
      }
      setDone(data.message || "Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-3" noValidate>
      <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold">
        Changer mon mot de passe
      </h2>
      <div>
        <label
          htmlFor="currentPassword"
          className="mb-1 block text-sm font-medium"
        >
          Mot de passe actuel
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-terracotta"
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium">
          Nouveau mot de passe
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-terracotta"
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium"
        >
          Confirmer
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-terracotta"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-terracotta">
          {error}
        </p>
      )}
      {done && (
        <p role="status" className="text-sm text-ink/70">
          {done}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-ghost !border-ink/20 !text-ink disabled:opacity-50"
      >
        {pending ? "…" : "Mettre à jour"}
      </button>
    </form>
  );
}
