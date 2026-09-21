import { SITE, LINKS } from "@/lib/constants";

export default function JsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ilemi-ia.vercel.app";

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: siteUrl,
    logo: `${siteUrl}/logo-mark-sm.png`,
    description: SITE.description,
    email: LINKS.email,
    sameAs: [],
    founder: {
      "@type": "Person",
      name: "Makboulath Raoufou",
    },
    areaServed: {
      "@type": "Place",
      name: "Afrique francophone",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: siteUrl,
    description: SITE.description,
    inLanguage: "fr",
    publisher: { "@type": "Organization", name: SITE.name },
  };

  const services = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Offres ilémi.IA",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Atelier découverte IA",
        description: "Initiation courte en groupe pour démystifier l'IA.",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Parcours Créer avec l'IA",
        description: "Accompagnement jusqu'à un livrable fonctionnel.",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Diagnostic IA entreprise",
        description: "Audit et plan d'action pour PME et organisations.",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Agent IA sur mesure",
        description: "Agent conçu pour vos process et outils.",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(services) }}
      />
    </>
  );
}
