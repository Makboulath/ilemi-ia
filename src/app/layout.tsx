import type { Metadata } from "next";
import { Karla, Montserrat } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import PageTracker from "@/components/PageTracker";
import JsonLd from "@/components/JsonLd";
import ChatAssistant from "@/components/ChatAssistant";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-karla",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ilemi-ia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | ${SITE.slogan}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: "Makboulath Raoufou" }, { name: "ilémi.IA" }],
  creator: "ilémi.IA",
  publisher: "ilémi.IA",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.slogan}`,
    description: SITE.description,
    images: [
      {
        url: "/social-image.png",
        width: 1200,
        height: 630,
        alt: "ilémi.IA, L'IA, enfin chez vous.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.slogan}`,
    description: SITE.description,
    images: ["/social-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${karla.variable}`}>
      <body className="antialiased font-[family-name:var(--font-karla)]">
        <a href="#contenu-principal" className="skip-link">
          Aller au contenu
        </a>
        <JsonLd />
        <PageTracker />
        {children}
        <ChatAssistant />
      </body>
    </html>
  );
}
