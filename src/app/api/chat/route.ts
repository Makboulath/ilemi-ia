import { NextResponse } from "next/server";
import {
  CHAT_MODEL,
  CHAT_SYSTEM_PROMPT,
  offlineReply,
} from "@/lib/chat/system";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type ChatMsg = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  let body: { messages?: ChatMsg[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 }
    );
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMsg[] = raw
    .filter(
      (m): m is ChatMsg =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, 1200),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-12);

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser || lastUser.content.length < 1) {
    return NextResponse.json(
      { ok: false, message: "Message vide." },
      { status: 400 }
    );
  }

  const priorUserCount = messages.filter((m) => m.role === "user").length - 1;
  const key = process.env.GROQ_API_KEY?.trim();

  if (key) {
    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: CHAT_MODEL,
            messages: [
              { role: "system", content: CHAT_SYSTEM_PROMPT },
              ...messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        }
      );
      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return NextResponse.json({
            ok: true,
            reply,
            provider: "groq",
          });
        }
      }
    } catch {
      // fall through
    }
  }

  return NextResponse.json({
    ok: true,
    reply: offlineReply(lastUser.content, Math.max(0, priorUserCount)),
    provider: "offline",
  });
}
