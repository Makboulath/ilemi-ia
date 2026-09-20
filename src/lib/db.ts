import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __ilemiPrisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __ilemiDbReady: Promise<void> | undefined;
}

function resolveDatabaseUrl(): string {
  if (process.env.VERCEL === "1") {
    return "file:/tmp/ilemi.db";
  }
  return process.env.DATABASE_URL || "file:./prisma/dev.db";
}

function createClient(): PrismaClient {
  process.env.DATABASE_URL = resolveDatabaseUrl();
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

/** Ensure SQLite tables exist (needed for /tmp on Vercel cold starts). */
export async function ensureDb(): Promise<PrismaClient> {
  const prisma = getPrisma();
  if (!globalThis.__ilemiDbReady) {
    globalThis.__ilemiDbReady = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL,
          "passwordHash" TEXT NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'MEMBER',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`
      );
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PageView" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "path" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path")`
      );
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Conversion" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "type" TEXT NOT NULL,
          "meta" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Conversion_createdAt_idx" ON "Conversion"("createdAt")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Conversion_type_idx" ON "Conversion"("type")`
      );
    })().catch((err) => {
      globalThis.__ilemiDbReady = undefined;
      throw err;
    });
  }
  await globalThis.__ilemiDbReady;
  return prisma;
}
