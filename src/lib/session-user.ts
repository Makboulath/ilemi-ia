import { getSession, type SessionPayload } from "@/lib/auth";
import { ensureDb } from "@/lib/db";
import type { User } from "@prisma/client";

export async function requireSession(): Promise<SessionPayload | null> {
  return getSession();
}

/** Resolve the Prisma User row for the current session (env-admin excluded). */
export async function requireDbUser(): Promise<
  { session: SessionPayload; user: User } | null
> {
  const session = await getSession();
  if (!session) return null;
  if (session.sub === "env-admin") {
    // Ensure a durable admin row exists when possible
    const prisma = await ensureDb();
    const email = session.email;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: "!", // not used for env-admin login
          role: "ADMIN",
          credits: 7,
          creditsBootstrapped: true,
          plan: "PRO",
        },
      });
    }
    return { session: { ...session, sub: user.id }, user };
  }
  const prisma = await ensureDb();
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return null;
  return { session, user };
}
