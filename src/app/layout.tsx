import type { Metadata } from "next";
import { Karla, Montserrat } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ilemi.ia"),
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.slogan}`,
    description: SITE.description,
    images: [
      {
        url: "/social-image.png",
        width: 1200,
        height: 630,
        alt: "ilémi.IA — L'IA, enfin chez vous.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.slogan}`,
    description: SITE.description,
    images: ["/social-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${karla.variable}`}>
      <body className="antialiased font-[family-name:var(--font-karla)]">
        {children}
      </body>
    </html>
  );
}
