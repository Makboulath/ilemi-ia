export type QuizQuestion = {
  q: string;
  choices: string[];
  correct: number;
  explain: string;
};

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  body: string[];
  tips?: string[];
  quiz?: QuizQuestion;
};

export type LearningPath = {
  id: "debutant" | "createur" | "pro";
  label: string;
  tagline: string;
  color: string;
  lessons: Lesson[];
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "debutant",
    label: "Débutant",
    tagline: "Comprendre l'IA sans jargon, en 5 leçons claires.",
    color: "terracotta",
    lessons: [
      {
        id: "d1",
        title: "Qu'est-ce que l'IA, vraiment ?",
        minutes: 6,
        body: [
          "L'intelligence artificielle, ce n'est pas un cerveau humain dans une machine. C'est un ensemble d'outils qui apprennent des motifs à partir de données, textes, images, sons, pour produire des réponses utiles.",
          "Les outils grand public (ChatGPT, Claude, Gemini, Copilot…) sont des modèles de langage : ils prédisent la suite la plus probable d'un texte. Ils ne « savent » pas comme une personne ; ils synthétisent.",
          "Bonne nouvelle : vous n'avez pas besoin de coder pour les utiliser. Ce qui compte, c'est de savoir poser une question claire et de vérifier le résultat.",
        ],
        tips: [
          "Pensez « assistant intelligent » plutôt que « magicien ».",
          "L'IA amplifie votre intention, elle ne remplace pas votre jugement.",
        ],
        quiz: {
          q: "Un modèle de langage…",
          choices: [
            "Comprend vraiment comme un humain",
            "Prédit la suite probable d'un texte",
            "Accède toujours à internet en temps réel",
          ],
          correct: 1,
          explain:
            "Il prédit la suite la plus probable. C'est puissant, mais ce n'est pas de la compréhension humaine.",
        },
      },
      {
        id: "d2",
        title: "Mythes vs réalités",
        minutes: 5,
        body: [
          "Mythe : « L'IA va tout faire à ma place. » Réalité : elle accélère le premier jet ; vous validez, corrigez, décidez.",
          "Mythe : « Il faut être technique. » Réalité : un bon prompt en français clair bat souvent un jargon mal pensé.",
          "Mythe : « L'IA ne se trompe jamais. » Réalité : elle peut inventer des faits (hallucinations). Toujours croiser les infos importantes.",
        ],
        tips: [
          "Pour les faits critiques (chiffres, juridique, santé) : vérifiez une source fiable.",
          "Pour la créativité : laissez plus de marge, c'est là que l'IA brille.",
        ],
        quiz: {
          q: "Face à une réponse IA sur un chiffre important, que faire ?",
          choices: [
            "La publier telle quelle",
            "La vérifier avec une source fiable",
            "Lui faire confiance si le ton est sûr",
          ],
          correct: 1,
          explain:
            "Le ton confiant n'est pas une preuve. Vérifiez les faits importants.",
        },
      },
      {
        id: "d3",
        title: "Votre premier prompt qui marche",
        minutes: 8,
        body: [
          "Un bon prompt a 4 ingrédients : rôle (qui est l'IA), contexte (votre situation), tâche (ce que vous voulez), format (comment présenter).",
          "Exemple faible : « Écris un mail. » Exemple fort : « Tu es assistant·e commerciale. Je relance une cliente PME après un devis envoyé il y a 8 jours. Ton chaleureux, 5 lignes max, 1 question claire à la fin. »",
          "Ajoutez des contraintes : longueur, ton, public, ce qu'il ne faut pas dire. Moins d'ambiguïté = meilleur résultat.",
        ],
        tips: [
          "Si le résultat est moyen : refinez en 1 phrase (« plus court », « plus concret », « ajoute un exemple »).",
          "Gardez vos meilleurs prompts dans un fichier, c'est votre bibliothèque.",
        ],
        quiz: {
          q: "Quel élément manque souvent aux prompts faibles ?",
          choices: [
            "Le contexte et le format attendu",
            "Des emojis",
            "Du code Python",
          ],
          correct: 0,
          explain:
            "Contexte + format (longueur, ton, structure) font la différence.",
        },
      },
      {
        id: "d4",
        title: "Outils texte, image, voix, panorama",
        minutes: 7,
        body: [
          "Texte : ChatGPT, Claude, Gemini, Copilot, idéaux pour emails, plans, reformulation, brainstorming.",
          "Image : Midjourney, DALL·E, Ideogram, Firefly, pour moodboards, visuels réseaux, concepts.",
          "Voix / audio : Whisper (transcription), ElevenLabs / outils TTS, pour notes, podcasts, accessibilité.",
          "Choisissez selon le besoin, pas selon la hype. Un outil bien maîtrisé vaut mieux que dix outils à moitié.",
        ],
        tips: [
          "Commencez par 1 outil texte + 1 usage récurrent (ex. reformuler vos mails).",
          "Le Studio Ilémi regroupera bientôt des espaces Image / Vidéo / Son pour expérimenter.",
        ],
      },
      {
        id: "d5",
        title: "Bonnes pratiques au quotidien",
        minutes: 6,
        body: [
          "Ne collez jamais de données sensibles (mots de passe, dossiers clients confidentiels) dans un outil grand public sans cadrage.",
          "Relisez toujours avant d'envoyer. L'IA accélère ; vous restez responsable du message.",
          "Itérez : premier jet → critique → amélioration. Trois allers-retours battent souvent un prompt « parfait » du premier coup.",
        ],
        tips: [
          "Créez une checklist personnelle : rôle, contexte, tâche, format, contraintes.",
          "Bloquez 20 min / semaine pour tester un nouveau cas d'usage utile.",
        ],
        quiz: {
          q: "Quelle est la meilleure habitude ?",
          choices: [
            "Envoyer le premier jet tel quel",
            "Itérer et relire avant d'envoyer",
            "Changer d'outil à chaque message",
          ],
          correct: 1,
          explain:
            "Itération + relecture = qualité et responsabilité. Vous restez aux commandes.",
        },
      },
    ],
  },
  {
    id: "createur",
    label: "Créateur",
    tagline: "Passer de l'idée au livrable avec l'IA comme copilote.",
    color: "gold",
    lessons: [
      {
        id: "c1",
        title: "Cadrer une idée en 20 minutes",
        minutes: 8,
        body: [
          "Avant de générer, clarifiez : pour qui ? quel problème ? quelle preuve de succès (livrable) ?",
          "Demandez à l'IA un canvas : problème / solution / utilisateur / premier prototype minimal.",
          "Gardez une seule promesse claire. Trop de fonctionnalités = projet qui n'aboutit pas.",
        ],
        tips: [
          "Livrable = quelque chose de montrable (landing, maquette, script, démo).",
          "Si vous ne pouvez pas l'expliquer en 2 phrases, recentrez.",
        ],
        quiz: {
          q: "Le meilleur premier objectif créatif est…",
          choices: [
            "Un produit « complet »",
            "Un livrable minimal montrable",
            "Dix idées en parallèle",
          ],
          correct: 1,
          explain:
            "Un livrable minimal prouve l'idée et débloque les retours.",
        },
      },
      {
        id: "c2",
        title: "Prompts créatifs pour texte & image",
        minutes: 9,
        body: [
          "Pour le texte : demandez structure (titres, accroche, CTA), ton de marque, et 2 variantes.",
          "Pour l'image : sujet + style + lumière + composition + ce qu'il faut éviter. Plus c'est précis, moins c'est générique.",
          "Chaînez les outils : l'IA texte produit le brief → l'IA image exécute → vous sélectionnez et peaufinez.",
        ],
        tips: [
          "Gardez une « bible » de marque (mots, couleurs, ton) à coller dans vos prompts.",
          "Demandez toujours une version courte et une version longue.",
        ],
      },
      {
        id: "c3",
        title: "Workflow : du brief au contenu publié",
        minutes: 10,
        body: [
          "1) Brief (objectif + audience). 2) Plan. 3) Premier jet IA. 4) Votre voix (réécriture). 5) Visuel. 6) Publication + mesure.",
          "L'IA fait le volume ; vous apportez le point de vue. C'est ce point de vue qui crée la confiance.",
          "Documentez ce qui a marché (quel prompt, quel format) pour accélérer la prochaine fois.",
        ],
        tips: [
          "Bloquez une heure « atelier créatif » par semaine avec un seul livrable.",
          "Mesurez une chose simple : clics, réponses, ou temps gagné.",
        ],
        quiz: {
          q: "Dans un bon workflow créatif, l'IA…",
          choices: [
            "Remplace entièrement votre voix",
            "Produit le volume ; vous apportez le point de vue",
            "Publie toute seule",
          ],
          correct: 1,
          explain:
            "Votre regard et votre ton restent le différenciateur.",
        },
      },
      {
        id: "c4",
        title: "Éviter le contenu générique",
        minutes: 7,
        body: [
          "Ajoutez des détails vécus : chiffres réels, anecdotes, contraintes locales, exemples de clients (anonymisés).",
          "Demandez à l'IA de challenger votre texte : « Qu'est-ce qui sonne creux ? » puis corrigez.",
          "Moins de buzzwords, plus de phrases utiles. Si ça pourrait être signé par n'importe qui, recommencez.",
        ],
        tips: [
          "Testez sur une personne réelle avant de publier.",
          "Gardez une liste de « mots interdits » trop vagues (synergie, disruptif…). ",
        ],
      },
    ],
  },
  {
    id: "pro",
    label: "Pro",
    tagline: "Intégrer l'IA dans une activité : priorités, risques, ROI.",
    color: "navy",
    lessons: [
      {
        id: "p1",
        title: "Repérer où l'IA gagne du temps",
        minutes: 9,
        body: [
          "Cartographiez les tâches répétitives : emails, reporting, support, recherche, création de contenus.",
          "Scorez impact × effort. Commencez par 1 ou 2 cas à fort impact et faible risque.",
          "Un diagnostic clair bat une pile d'outils. C'est le cœur de l'offre entreprises Ilémi.",
        ],
        tips: [
          "Mesurez le temps actuel avant/après sur une tâche pilote.",
          "Impliquez la personne qui fait le travail, pas seulement la direction.",
        ],
        quiz: {
          q: "Par où commencer en entreprise ?",
          choices: [
            "Déployer 10 outils d'un coup",
            "1–2 cas d'usage à fort impact / faible risque",
            "Attendre la « IA parfaite »",
          ],
          correct: 1,
          explain:
            "Un pilote mesurable crée l'adhésion et évite le chaos.",
        },
      },
      {
        id: "p2",
        title: "Risques, données et gouvernance légère",
        minutes: 8,
        body: [
          "Définissez ce qui ne doit jamais aller dans un outil grand public (données clients sensibles, secrets).",
          "Préférez des comptes pro, des politiques claires, et une formation courte aux équipes.",
          "Documentez les usages autorisés. La gouvernance n'a pas besoin d'être lourde, elle doit être lisible.",
        ],
        tips: [
          "Une page A4 de règles > un PDF de 40 pages personne ne lit.",
          "Prévoir un canal « questions IA » interne réduit les erreurs.",
        ],
      },
      {
        id: "p3",
        title: "Agents & automatisations : quand ça vaut le coup",
        minutes: 10,
        body: [
          "Un agent n'est utile que si le process est déjà clair. Sinon, vous automatisez le chaos.",
          "Commencez par des automatisations simples (relances, résumés, tri) avant un agent sur mesure.",
          "Le ROI se lit en heures gagnées, erreurs évitées, et qualité de service, pas en slides.",
        ],
        tips: [
          "Écrivez le process à la main avant de le confier à un outil.",
          "Prévoyez toujours un humain dans la boucle pour les décisions sensibles.",
        ],
        quiz: {
          q: "Avant d'automatiser, il faut…",
          choices: [
            "Acheter l'outil le plus cher",
            "Clarifier le process à la main",
            "Former tout le monde en même temps",
          ],
          correct: 1,
          explain:
            "Process clair d'abord. Ensuite seulement l'outil ou l'agent.",
        },
      },
      {
        id: "p4",
        title: "Construire un plan d'adoption en 30 jours",
        minutes: 8,
        body: [
          "Semaine 1 : diagnostic léger + 1 cas pilote. Semaine 2 : prompts / outils + formation courte. Semaine 3 : mesure. Semaine 4 : décision go / adjust.",
          "Communiquez les wins rapidement. L'adoption meurt dans le silence.",
          "Si vous voulez un accompagnement structuré : diagnostic IA Ilémi ou atelier équipe.",
        ],
        tips: [
          "Nommez un « champion IA » dans l'équipe (pas forcément tech).",
          "Réservez un créneau Calendly pour clarifier votre plan.",
        ],
      },
    ],
  },
];

export function allLessonIds(): string[] {
  return LEARNING_PATHS.flatMap((p) => p.lessons.map((l) => l.id));
}
