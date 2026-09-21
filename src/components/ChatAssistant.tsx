"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CHAT_WELCOME } from "@/lib/chat/system";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatAssistant() {
  const pathname = usePathname();
  const hide = pathname?.startsWith("/admin") ?? false;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: CHAT_WELCOME },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reply?: string;
        message?: string;
      };
      const reply =
        data.ok && data.reply
          ? data.reply
          : data.message ||
            "Je n'ai pas pu répondre pour le moment. Réessayez, ou réservez sur Calendly.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Connexion difficile. Réessayez dans un instant, ou écrivez-nous via le formulaire contact.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (hide) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Assistant Ilémi.IA"
          className="flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-[#2a2a35] bg-[#F8F1E4] shadow-2xl"
        >
          <header className="flex items-center gap-3 bg-[#14141A] px-4 py-3 text-white">
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C1622D] text-sm font-bold"
            >
              i
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-[family-name:var(--font-montserrat)] text-sm font-bold">
                Assistant Ilémi.IA
              </p>
              <p className="truncate text-xs text-white/70">
                Propulsé par Groq
              </p>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-[#C1622D] text-white"
                      : "rounded-bl-md bg-[#14141A] text-white"
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {busy && (
              <p className="text-xs text-[#14141A]/60">L&apos;assistant écrit…</p>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t border-[#14141A]/10 bg-[#14141A] p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre message..."
              maxLength={1200}
              disabled={busy}
              className="min-w-0 flex-1 rounded-lg bg-[#1e1e28] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-[#C1622D]"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Envoyer"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C1622D] text-white transition hover:brightness-110 disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Ilémi.IA"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C1622D] text-xl font-bold text-white shadow-lg transition hover:scale-105 hover:brightness-110"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
