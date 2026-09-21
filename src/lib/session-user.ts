import { getSession, type SessionPayload } from "@/lib/auth";
import { ensureDb } from "@/lib/db";
import type { User } from "@prisma/client";

export async function requireSession(): Promise<SessionPayload | null> {
  return getSession();
}

/**
 * Resolve the Prisma User for the current session.
 * A valid JWT is authoritative: if the row is missing (e.g. after a fresh
 * Postgres provision before the user row was created), recreate it from
 * the session claims so APIs do not 401 and bounce the user to /connexion
 * while the cookie is still valid.
 */
export async function requireDbUser(): Promise<
  { session: SessionPayload; user: User } | null
> {
  const session = await getSession();
  if (!session) return null;

  const prisma = await ensureDb();

  let user =
    session.sub !== "env-admin"
      ? await prisma.user.findUnique({ where: { id: session.sub } })
      : null;

  if (!user) {
    user = await prisma.user.findUnique({ where: { email: session.email } });
  }

  if (!user) {
    const isAdmin = session.role === "ADMIN";
    user = await prisma.user.create({
      data: {
        ...(session.sub !== "env-admin" ? { id: session.sub } : {}),
        email: session.email,
        passwordHash: "!", // placeholder when row is healed from JWT only
        role: session.role,
        credits: 7,
        creditsBootstrapped: true,
        plan: isAdmin ? "PRO" : "FREE",
      },
    });
  }

  return { session: { ...session, sub: user.id }, user };
}
