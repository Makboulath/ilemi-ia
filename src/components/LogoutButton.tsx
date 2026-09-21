"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      // Full navigation so sticky Header / proxy re-read the cleared cookie.
      window.location.assign("/");
    } catch {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      aria-busy={pending}
      className="min-h-11 rounded border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-ink/5 disabled:opacity-60"
    >
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
