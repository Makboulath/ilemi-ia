"use client";

import { useCallback, useEffect, useState } from "react";

type PendingOrder = {
  id: string;
  code: string;
  packId: string;
  amountFcfa: number;
  imageCredits: number;
  videoCredits: number;
  status: string;
  smsRef: string | null;
  merchantNumber: string;
  createdAt: string;
  user: { id: string; email: string; displayName: string | null };
};

function formatFcfa(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      timeZone: "Africa/Porto-Novo",
    });
  } catch {
    return iso;
  }
}

export default function AdminCreditsPanel() {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/credits");
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "Impossible de charger les commandes.");
        setOrders([]);
        return;
      }
      setOrders(data.orders || []);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(orderId: string, action: "approve" | "reject") {
    setBusyId(orderId);
    setError("");
    setOkMsg("");
    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "Action impossible.");
        return;
      }
      setOkMsg(
        action === "approve"
          ? `Commande ${data.order.code} approuvée — crédits accordés.`
          : `Commande ${data.order.code} refusée.`,
      );
      await load();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-bold">
            Commandes Mobile Money
          </h2>
          <p className="mt-1 text-sm text-ink/50">
            Pending / soumis — vérifier le transfert puis Approuver ou Refuser.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="btn-ghost !border-ink/20 !text-ink !py-2 text-sm"
        >
          Actualiser
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-terracotta" role="alert">
          {error}
        </p>
      )}
      {okMsg && (
        <p className="mt-3 text-sm text-ink/70" role="status">
          {okMsg}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-ink/45">Chargement…</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">
          Aucune commande en attente.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((o) => (
            <li
              key={o.id}
              className="rounded-2xl border border-ink/10 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold text-terracotta">
                    {o.code}
                  </p>
                  <p className="mt-1 text-sm text-ink/80">
                    {o.user.email}
                    {o.user.displayName ? ` · ${o.user.displayName}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-ink/55">
                    Pack <strong>{o.packId}</strong> ·{" "}
                    {formatFcfa(o.amountFcfa)} · +{o.imageCredits} img
                    {o.videoCredits > 0 ? ` · +${o.videoCredits} vid` : ""}
                  </p>
                  <p className="mt-1 text-xs text-ink/40">
                    {formatWhen(o.createdAt)} · statut{" "}
                    <strong>{o.status}</strong>
                    {o.smsRef ? ` · SMS: ${o.smsRef}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === o.id}
                    onClick={() => act(o.id, "approve")}
                    className="btn-primary !py-2 !px-4 text-sm disabled:opacity-50"
                  >
                    Approuver
                  </button>
                  <button
                    type="button"
                    disabled={busyId === o.id}
                    onClick={() => act(o.id, "reject")}
                    className="btn-ghost !border-ink/20 !text-ink !py-2 !px-4 text-sm disabled:opacity-50"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
