import type { PrismaClient, User } from "@prisma/client";

export const FREE_CREDITS = 7;
export const IMAGE_CREDIT_COST = 1;
export const VIDEO_CREDIT_COST = 1;
export const VIDEO_DAILY_CAP = 2;
export const PRO_MONTHLY_CREDITS = 50;

export {
  CREDIT_PACKS,
  DEFAULT_MM_MERCHANT,
  getPack,
  makeOrderCode,
  merchantNumber,
  moovUssd,
  type CreditPack,
  type CreditPackId,
} from "@/lib/studio/packs";

/** Calendar day in Africa/Porto-Novo (UTC+1, no DST). */
export function portoNovoDateKey(d = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Porto-Novo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(d); // YYYY-MM-DD
}

export async function ensureWallet(
  prisma: PrismaClient,
  userId: string
): Promise<User> {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("USER_NOT_FOUND");

  if (!user.creditsBootstrapped) {
    user = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: Math.max(user.credits, FREE_CREDITS),
        creditsBootstrapped: true,
      },
    });
  }

  const today = portoNovoDateKey();
  if (user.videoDate !== today) {
    user = await prisma.user.update({
      where: { id: userId },
      data: { videoDate: today, videoCountToday: 0 },
    });
  }

  return user;
}

export function videosLeftToday(user: User): number {
  return Math.max(0, VIDEO_DAILY_CAP - user.videoCountToday);
}

export type WalletSnapshot = {
  credits: number;
  imageCredits: number;
  videoCredits: number;
  plan: string;
  videosLeftToday: number;
  videoDailyCap: number;
};

export function snapshot(user: User): WalletSnapshot {
  return {
    credits: user.credits,
    imageCredits: user.credits,
    videoCredits: user.videoCredits ?? 0,
    plan: user.plan,
    videosLeftToday: videosLeftToday(user),
    videoDailyCap: VIDEO_DAILY_CAP,
  };
}
