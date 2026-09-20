/** Fisher–Yates shuffle (pure, returns new array). */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type ShuffledQuestion = {
  id: string;
  q: string;
  choices: string[];
  /** Index of the correct answer in the shuffled choices */
  correct: number;
  explain: string;
};

export function shuffleQuizQuestions(
  questions: {
    id: string;
    q: string;
    choices: string[];
    correct: number;
    explain: string;
  }[]
): ShuffledQuestion[] {
  return shuffle(questions).map((question) => {
    const indexed = question.choices.map((text, i) => ({ text, i }));
    const shuffled = shuffle(indexed);
    const correct = shuffled.findIndex((c) => c.i === question.correct);
    return {
      id: question.id,
      q: question.q,
      choices: shuffled.map((c) => c.text),
      correct,
      explain: question.explain,
    };
  });
}
