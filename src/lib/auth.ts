import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";
import { ensureDb } from "@/lib/db";

export const SESSION_COOKIE = "ilemi_session";
const SESSION_TTL = "7d";

export type SessionPayload = {
  sub: string;
  email: string;
  role: Role;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET manquant ou trop court (min. 16 caractères).");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return compare(password, passwordHash);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const role = payload.role === "ADMIN" || payload.role === "MEMBER"
      ? payload.role
      : null;
    if (!sub || !email || !role) return null;
    return { sub, email, role };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Upsert admin from env on first boot / login when ADMIN_PASSWORD is set. */
export async function ensureAdminUser(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) return;

  try {
    const prisma = await ensureDb();
    const passwordHash = await hashPassword(password);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { role: "ADMIN", passwordHash },
      });
      return;
    }
    await prisma.user.create({
      data: { email, passwordHash, role: "ADMIN" },
    });
  } catch {
    // DB unavailable — login can still fall back to env credentials
  }
}

/**
 * Authenticate by DB user, or env ADMIN_* when no admin row / DB missing.
 * Never logs the password.
 */
export async function authenticate(
  emailRaw: string,
  password: string
): Promise<SessionPayload | null> {
  const email = emailRaw.trim().toLowerCase();
  if (!email || !password) return null;

  await ensureAdminUser();

  try {
    const prisma = await ensureDb();
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return null;
      return { sub: user.id, email: user.email, role: user.role };
    }
  } catch {
    // fall through to env admin
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (
    adminEmail &&
    adminPassword &&
    email === adminEmail &&
    password === adminPassword
  ) {
    return { sub: "env-admin", email: adminEmail, role: "ADMIN" };
  }

  return null;
}
