import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __ilemiPrisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __ilemiDbReady: Promise<void> | undefined;
}

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Use a PostgreSQL connection string (Neon / Vercel Postgres)."
    );
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function getPrisma(): PrismaClient {
  if (!globalThis.__ilemiPrisma) {
    globalThis.__ilemiPrisma = createClient();
  }
  return globalThis.__ilemiPrisma;
}

/**
 * Warm the Prisma client and verify connectivity.
 * Schema changes must be applied with `prisma migrate deploy` or `prisma db push`
 * — do not bootstrap tables at runtime on Postgres.
 */
export async function ensureDb(): Promise<PrismaClient> {
  const prisma = getPrisma();
  if (!globalThis.__ilemiDbReady) {
    globalThis.__ilemiDbReady = (async () => {
      await prisma.$queryRaw`SELECT 1`;
    })().catch((err) => {
      globalThis.__ilemiDbReady = undefined;
      throw err;
    });
  }
  await globalThis.__ilemiDbReady;
  return prisma;
}
