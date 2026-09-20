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

async function tryAlter(prisma: PrismaClient, sql: string) {
  try {
    await prisma.$executeRawUnsafe(sql);
  } catch {
    /* column may already exist */
  }
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
          "displayName" TEXT,
          "plan" TEXT NOT NULL DEFAULT 'FREE',
          "credits" INTEGER NOT NULL DEFAULT 7,
          "creditsBootstrapped" INTEGER NOT NULL DEFAULT 1,
          "videoDate" TEXT,
          "videoCountToday" INTEGER NOT NULL DEFAULT 0,
          "stripeCustomerId" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`
      );
      await tryAlter(prisma, `ALTER TABLE "User" ADD COLUMN "displayName" TEXT`);
      await tryAlter(
        prisma,
        `ALTER TABLE "User" ADD COLUMN "plan" TEXT NOT NULL DEFAULT 'FREE'`
      );
      await tryAlter(
        prisma,
        `ALTER TABLE "User" ADD COLUMN "credits" INTEGER NOT NULL DEFAULT 7`
      );
      await tryAlter(
        prisma,
        `ALTER TABLE "User" ADD COLUMN "creditsBootstrapped" INTEGER NOT NULL DEFAULT 1`
      );
      await tryAlter(prisma, `ALTER TABLE "User" ADD COLUMN "videoDate" TEXT`);
      await tryAlter(
        prisma,
        `ALTER TABLE "User" ADD COLUMN "videoCountToday" INTEGER NOT NULL DEFAULT 0`
      );
      await tryAlter(
        prisma,
        `ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT`
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

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "CourseProgress" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "pathId" TEXT NOT NULL,
          "completedLessonIds" TEXT NOT NULL DEFAULT '[]',
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "CourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE UNIQUE INDEX IF NOT EXISTS "CourseProgress_userId_pathId_key" ON "CourseProgress"("userId", "pathId")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "CourseProgress_userId_idx" ON "CourseProgress"("userId")`
      );

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "QuizAttempt" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "pathId" TEXT NOT NULL,
          "score" INTEGER NOT NULL,
          "passed" INTEGER NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "QuizAttempt_userId_pathId_idx" ON "QuizAttempt"("userId", "pathId")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "QuizAttempt_createdAt_idx" ON "QuizAttempt"("createdAt")`
      );

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Certificate" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "pathId" TEXT NOT NULL,
          "code" TEXT NOT NULL,
          "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "learnerName" TEXT NOT NULL,
          CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE UNIQUE INDEX IF NOT EXISTS "Certificate_code_key" ON "Certificate"("code")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE UNIQUE INDEX IF NOT EXISTS "Certificate_userId_pathId_key" ON "Certificate"("userId", "pathId")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Certificate_userId_idx" ON "Certificate"("userId")`
      );

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "StudioGeneration" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "prompt" TEXT NOT NULL,
          "url" TEXT,
          "meta" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "StudioGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "StudioGeneration_userId_createdAt_idx" ON "StudioGeneration"("userId", "createdAt")`
      );
    })().catch((err) => {
      globalThis.__ilemiDbReady = undefined;
      throw err;
    });
  }
  await globalThis.__ilemiDbReady;
  return prisma;
}
