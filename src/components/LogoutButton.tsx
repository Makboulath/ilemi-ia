"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="rounded border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 hover:bg-ink/5 disabled:opacity-60"
    >
      {pending ? "…" : "Se déconnecter"}
    </button>
  );
}
