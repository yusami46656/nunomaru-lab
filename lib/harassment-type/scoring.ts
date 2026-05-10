import {
  harassmentQuestions,
  typeMap,
  type Attribute,
  type ChoiceId,
} from '@/data/harassment-type';

const ATTR_ORDER: Attribute[] = ['P', 'M', 'S', 'C'];

export type RawScores = Record<Attribute, number>;
export type PercentScores = Record<Attribute, number>;

export function calculateRawScores(answers: Record<string, ChoiceId>): RawScores {
  const scores: RawScores = { P: 0, M: 0, S: 0, C: 0 };
  for (const q of harassmentQuestions) {
    const choiceId = answers[q.id];
    const choice = q.choices.find(c => c.id === choiceId);
    if (choice) {
      scores.P += choice.scores.P;
      scores.M += choice.scores.M;
      scores.S += choice.scores.S;
      scores.C += choice.scores.C;
    }
  }
  return scores;
}

export function calculateMaxScores(): RawScores {
  const max: RawScores = { P: 0, M: 0, S: 0, C: 0 };
  for (const q of harassmentQuestions) {
    for (const attr of ATTR_ORDER) {
      max[attr] += Math.max(...q.choices.map(c => c.scores[attr]));
    }
  }
  return max;
}

const SCORE_SCALE = 0.65;

export function calculatePercentages(raw: RawScores): PercentScores {
  const max = calculateMaxScores();
  const pct = {} as PercentScores;
  for (const attr of ATTR_ORDER) {
    const effectiveMax = max[attr] * SCORE_SCALE;
    pct[attr] = Math.min(100, Math.round(Math.max(0, raw[attr]) / effectiveMax * 100));
  }
  return pct;
}

export function determineTypeId(pct: PercentScores): string {
  const THRESHOLD = 45;
  const GAP = 25;

  const candidates = ATTR_ORDER.filter(attr => pct[attr] >= THRESHOLD);

  if (candidates.length === 0) return 'villager';

  if (candidates.length === 1) {
    return typeMap[candidates[0]] ?? 'villager';
  }

  const sorted = [...candidates].sort((a, b) => pct[b] - pct[a]);
  const top = sorted[0];
  const second = sorted[1];

  if (pct[top] - pct[second] >= GAP) {
    return typeMap[top] ?? 'villager';
  }

  const key = ATTR_ORDER.filter(a => candidates.includes(a)).join('');
  return typeMap[key] ?? 'villager';
}
