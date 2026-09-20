import { jwtVerify } from "jose";

export const SESSION_COOKIE = "ilemi_session";

export type EdgeSession = {
  sub: string;
  email: string;
  role: "ADMIN" | "MEMBER";
};

export async function verifyTokenEdge(
  token: string
): Promise<EdgeSession | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const role =
      payload.role === "ADMIN" || payload.role === "MEMBER"
        ? payload.role
        : null;
    if (!sub || !email || !role) return null;
    return { sub, email, role };
  } catch {
    return null;
  }
}
