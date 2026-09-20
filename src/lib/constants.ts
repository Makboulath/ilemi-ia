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
  url: "https://ilemi.ia",
  description:
    "Ilémi.IA accompagne particuliers et entreprises qui veulent adopter l'IA — sans jargon, sans intimidation. Diagnostic, accompagnement et agents IA clés en main.",
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
      "Pour les curieux, freelances, étudiants et porteurs de projet. Venez apprendre ou construire quelque chose avec l'IA, sans pré-requis et sans y aller seul.",
    produits: [
      {
        titre: "Atelier découverte",
        pour: "Débutants et curieux",
        desc: "Initiation courte en groupe pour démystifier l'IA sans jargon. Pas de code, juste des cas concrets et des outils utilisables dès le lendemain.",
        inclus: [
          "Session collective de quelques heures",
          "Panorama des outils IA accessibles",
          "Exercices pratiques sur des cas réels",
          "Guide de ressources personnalisé",
        ],
      },
      {
        titre: "Parcours « Créer avec l'IA »",
        pour: "Porteurs de projet",
        desc: "Vous arrivez avec une idée. On vous accompagne pour la construire, étape par étape, jusqu'à un projet ou outil qui fonctionne vraiment.",
        inclus: [
          "Accompagnement individuel, plusieurs semaines",
          "Audit de votre idée et de sa faisabilité",
          "Suivi personnalisé entre chaque session",
          "Livrable fonctionnel en sortie",
        ],
        badge: "Populaire",
        accent: true,
      },
      {
        titre: "Communauté Ilémi",
        pour: "Apprenants continus",
        desc: "Un espace permanent pour continuer à apprendre, poser des questions, partager ce qu'on construit. On n'apprend jamais bien tout seul.",
        inclus: [
          "Abonnement mensuel, accès continu",
          "Entraide et ressources partagées",
          "Événements réguliers en ligne et présentiel",
          "Accès aux sessions enregistrées",
        ],
      },
    ],
  },
  {
    id: "entreprises",
    label: "Entreprises",
    icon: "◈",
    intro:
      "PME, startups, organisations : on intègre l'IA dans vos process existants, sans tout casser. Vous gagnez du temps, vos équipes gardent la main.",
    steps: [
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
    ],
  },
  {
    id: "agents",
    label: "Agents IA",
    icon: "⬡",
    intro:
      "Des agents qui travaillent pour vous pendant que vous faites autre chose. Du plus simple au plus complet, prêts à l'emploi ou construits sur mesure.",
    produits: [
      {
        titre: "Agents prêts à l'emploi",
        pour: "Structures qui veulent démarrer vite",
        desc: "Des agents déjà construits, configurés rapidement pour votre cas d'usage. Opérationnels en 48h.",
        inclus: [
          "Self-serve, prix d'entrée accessible",
          "Sélection et configuration de l'agent",
          "Formation à l'utilisation (1h)",
          "Support technique 30 jours",
        ],
      },
      {
        titre: "Agents personnalisés",
        pour: "Entreprises avec des besoins spécifiques",
        desc: "Des agents pensés et construits pour vos process. Ils connaissent votre activité comme un collaborateur dès le premier jour.",
        inclus: [
          "Audit de vos besoins et process",
          "Conception et développement sur mesure",
          "Intégration à vos outils existants",
          "Tests, ajustements et documentation",
        ],
        badge: "Populaire",
        accent: true,
      },
      {
        titre: "Écosystème d'agents",
        pour: "Organisations qui veulent automatiser en profondeur",
        desc: "Plusieurs agents interconnectés qui travaillent ensemble pour automatiser une activité entière. C'est ce qu'Ilémi.IA utilise elle-même pour tourner.",
        inclus: [
          "Cartographie complète de l'automatisation",
          "Développement de plusieurs agents coordonnés",
          "Intégration complète à votre infrastructure",
          "Tableau de bord de supervision",
          "Accompagnement et maintenance inclus",
        ],
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
