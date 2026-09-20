export const LINKS = {
  calendly: "https://calendly.com/ilemi-ia27/on-discute",
  whatsapp: "https://wa.me/message/BVOJI7NRTXJAJ1",
  email: "ilemi.ia27@gmail.com",
  mailto: "mailto:ilemi.ia27@gmail.com",
} as const;

export const SITE = {
  name: "ilémi.IA",
  slogan: "L'IA, enfin chez vous.",
  tagline: "L'agence IA francophone",
  url: "https://ilemi-ia.vercel.app",
  description:
    "Ilémi.IA accompagne particuliers et entreprises qui veulent adopter l'IA — sans jargon, sans intimidation. Ateliers, parcours et diagnostic entreprise.",
} as const;

export type OfferProduct = {
  titre: string;
  pour: string;
  desc: string;
  inclus: string[];
  badge?: string;
  accent?: boolean;
};

export type OfferPillar = {
  id: string;
  label: string;
  icon: string;
  intro: string;
  produits?: OfferProduct[];
  steps?: { n: string; title: string; body: string }[];
};

export const OFFERS: OfferPillar[] = [
  {
    id: "maison",
    label: "La Maison",
    icon: "◎",
    intro:
      "Pour démarrer concrètement avec l'IA : une première session pour comprendre, ou un parcours pour construire quelque chose de réel.",
    produits: [
      {
        titre: "Atelier découverte",
        pour: "Débutants et curieux",
        desc: "Une session courte en groupe pour démystifier l'IA sans jargon. Des cas concrets, des outils utilisables dès le lendemain.",
        inclus: [
          "Session collective de quelques heures",
          "Panorama des outils IA accessibles",
          "Exercices pratiques sur des cas réels",
          "Guide de ressources à emporter",
        ],
      },
      {
        titre: "Parcours « Créer avec l'IA »",
        pour: "Porteurs de projet",
        desc: "Vous arrivez avec une idée. On vous accompagne jusqu'à un livrable qui fonctionne vraiment — pas un slide, un résultat.",
        inclus: [
          "Accompagnement individuel sur plusieurs semaines",
          "Audit de l'idée et de sa faisabilité",
          "Suivi entre chaque session",
          "Livrable fonctionnel en sortie",
        ],
        badge: "Offre phare",
        accent: true,
      },
    ],
  },
  {
    id: "entreprises",
    label: "Entreprises",
    icon: "◈",
    intro:
      "Pour les PME et organisations qui veulent gagner du temps sans tout casser. On commence par un diagnostic clair — chiffres et priorités, pas de jargon.",
    produits: [
      {
        titre: "Diagnostic IA",
        pour: "PME, startups, organisations",
        desc: "En 2 à 3 semaines, on cartographie où l'IA peut concrètement faire gagner du temps et de l'argent dans votre activité — avec un plan actionnable.",
        inclus: [
          "Audit de vos process et outils actuels",
          "Priorisation des cas d'usage (impact × effort)",
          "Plan de mise en œuvre et budget indicatif",
          "Restitution claire à partager avec votre équipe",
        ],
        badge: "Point d'entrée",
        accent: true,
      },
    ],
    steps: [
      {
        n: "01",
        title: "Le diagnostic",
        body: "On audite votre activité. On repère où l'IA peut concrètement faire gagner du temps et de l'argent, avec des chiffres, pas des promesses.",
      },
      {
        n: "02",
        title: "Le plan",
        body: "On construit ensemble la stratégie : quels outils, dans quel ordre, avec quel budget. Tout est actionnable dès la semaine suivante.",
      },
      {
        n: "03",
        title: "La mise en œuvre",
        body: "On intègre les solutions dans vos process. Équipes formées, premiers résultats mesurables.",
      },
      {
        n: "04",
        title: "L'autonomie",
        body: "Vous prenez la main. On reste disponibles. L'objectif : vous rendre capables de continuer seuls.",
      },
    ],
  },
  {
    id: "agents",
    label: "Agents IA",
    icon: "⬡",
    intro:
      "Quand le besoin est clair : un agent pensé pour vos process, pas une démo générique. Sur devis, après un échange.",
    produits: [
      {
        titre: "Agent sur mesure",
        pour: "Structures avec un besoin précis",
        desc: "Un agent construit pour votre activité : il connaît vos process, s'intègre à vos outils, et travaille pendant que vous faites autre chose.",
        inclus: [
          "Audit du besoin et du process cible",
          "Conception et configuration de l'agent",
          "Intégration à vos outils existants",
          "Formation courte + documentation",
          "Ajustements inclus sur la période de lancement",
        ],
        accent: true,
      },
    ],
  },
];

export const PROCESS_STEPS = [
  {
    n: "01",
    title: "Le diagnostic",
    body: "On audite votre activité. On repère où l'IA peut concrètement faire gagner du temps et de l'argent, avec des chiffres, pas des promesses.",
  },
  {
    n: "02",
    title: "Le plan",
    body: "On construit ensemble la stratégie : quels outils, dans quel ordre, avec quel budget. Rien de théorique. Tout est actionnable dès la semaine suivante.",
  },
  {
    n: "03",
    title: "La mise en œuvre",
    body: "On intègre les solutions dans vos process existants. Agents IA configurés, équipes formées. Premiers résultats mesurables.",
  },
  {
    n: "04",
    title: "L'autonomie",
    body: "Vous prenez la main. On reste disponibles. L'objectif : vous rendre capables de continuer seuls. Pas une dépendance, une transition.",
  },
] as const;

export const TRUST_PILLARS = [
  {
    d: "Finance",
    l: "Maîtrisée de l'intérieur",
    t: "On vient de là. Le jargon, les chiffres, les process qui excluent, on les connaît de l'intérieur. Et on sait les rendre lisibles.",
  },
  {
    d: "Web3",
    l: "Rendu accessible",
    t: "Avec Women on Web3 / Crypt'O Féminin, on a ouvert un univers qui fait fuir 9 personnes sur 10 à des femmes francophones qu'on n'y invitait jamais.",
  },
  {
    d: "IA",
    l: "En usage réel",
    t: "On utilise nos propres agents pour faire tourner l'agence. Ce qu'on vend, on s'en sert chaque jour. La preuve n'est pas dans un slide.",
  },
] as const;

export const VALUES = [
  { l: "Accueil avant technique", s: "On explique avant d'impressionner." },
  { l: "Clarté radicale", s: "Si c'est pas clair, c'est pas fini." },
  { l: "Preuve par l'usage", s: "On utilise nos propres outils." },
  { l: "Progrès sans pression", s: "À votre rythme, pas au nôtre." },
] as const;
