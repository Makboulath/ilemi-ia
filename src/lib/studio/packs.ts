export const DEFAULT_MM_MERCHANT = "0153651682";

export function merchantNumber(): string {
  return (process.env.MM_MERCHANT_NUMBER || DEFAULT_MM_MERCHANT).trim();
}

export type CreditPackId = "essai" | "createur" | "studio";

export type CreditPack = {
  id: CreditPackId;
  name: string;
  amountFcfa: number;
  imageCredits: number;
  videoCredits: number;
  blurb: string;
  highlight?: boolean;
};

/** Locked Mobile Money packs (FCFA). */
export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "essai",
    name: "Essai",
    amountFcfa: 2000,
    imageCredits: 10,
    videoCredits: 0,
    blurb: "10 images HQ — idéal pour tester le Studio.",
  },
  {
    id: "createur",
    name: "Créateur",
    amountFcfa: 5000,
    imageCredits: 25,
    videoCredits: 2,
    blurb: "25 images HQ + 2 vidéos (10s, audio natif).",
    highlight: true,
  },
  {
    id: "studio",
    name: "Studio",
    amountFcfa: 10000,
    imageCredits: 40,
    videoCredits: 4,
    blurb: "40 images HQ + 4 vidéos (10s, audio natif).",
  },
];

export function getPack(packId: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === packId);
}

/** Moov Money style USSD (merchant → merchant → amount). */
export function moovUssd(amountFcfa: number, merchant = merchantNumber()): string {
  return `*880*1*1*${merchant}*${merchant}*${amountFcfa}#`;
}

/** ILM-XXXX unique order code (4 alnum uppercase). */
export function makeOrderCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `ILM-${suffix}`;
}
