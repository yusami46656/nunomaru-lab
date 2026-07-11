// ハラスメントタイプ出現頻度シミュレーション
// 全 4^16 = 42億通りは多すぎるため、ランダムサンプリング100万回で推定

import { readFileSync } from 'fs';

// data/harassment-type.ts からデータを抽出（TSをJSとして読み込む簡易パース）
const src = readFileSync(new URL('../data/harassment-type.ts', import.meta.url), 'utf8');

// questions の scores 部分だけ抽出
const qRaw = src.match(/export const harassmentQuestions[\s\S]*?=\s*(\[[\s\S]*?\]);\s*\nexport const harassmentTypes/);
const questionsJson = qRaw[1]
  .replace(/\/\/[^\n]*/g, '')
  .replace(/(\w+):/g, '"$1":')
  .replace(/'/g, '"')
  .replace(/,\s*}/g, '}')
  .replace(/,\s*]/g, ']');

const questions = JSON.parse(questionsJson);

const typeMap = {
  '': 'villager',
  'P': 'shogun',
  'M': 'gatekeeper',
  'S': 'minister',
  'C': 'noble',
  'PM': 'commander',
  'PS': 'sergeant',
  'PC': 'knight',
  'MS': 'spy',
  'MC': 'judge',
  'SC': 'priest',
  'PMS': 'mage',
  'PMC': 'alchemist',
  'PSC': 'summoner',
  'MSC': 'cursemaster',
  'PMSC': 'emperor',
};

const ATTR_ORDER = ['P', 'M', 'S', 'C'];
const THRESHOLD = 60;
const GAP = 25;
const SCORE_SCALE = 0.65;

// 各問の最大スコアを計算
const maxScores = { P: 0, M: 0, S: 0, C: 0 };
for (const q of questions) {
  for (const attr of ATTR_ORDER) {
    maxScores[attr] += Math.max(...q.choices.map(c => c.scores[attr]));
  }
}

function simulate(answers) {
  const raw = { P: 0, M: 0, S: 0, C: 0 };
  for (const q of questions) {
    const choice = q.choices[answers[q.id]];
    for (const attr of ATTR_ORDER) raw[attr] += choice.scores[attr];
  }

  const pct = {};
  for (const attr of ATTR_ORDER) {
    const effectiveMax = maxScores[attr] * SCORE_SCALE;
    pct[attr] = Math.min(100, Math.round(Math.max(0, raw[attr]) / effectiveMax * 100));
  }

  const candidates = ATTR_ORDER.filter(a => pct[a] >= THRESHOLD);
  if (candidates.length === 0) return 'villager';
  if (candidates.length === 1) return typeMap[candidates[0]] ?? 'villager';

  const sorted = [...candidates].sort((a, b) => pct[b] - pct[a]);
  if (pct[sorted[0]] - pct[sorted[1]] >= GAP) return typeMap[sorted[0]] ?? 'villager';

  const key = ATTR_ORDER.filter(a => candidates.includes(a)).join('');
  return typeMap[key] ?? 'villager';
}

// 答えを 0=A, 1=B, 2=C, 3=D としてランダムサンプリング
const N = 1_000_000;
const counts = {};
for (const id of Object.values(typeMap)) counts[id] = 0;

for (let i = 0; i < N; i++) {
  const answers = {};
  for (const q of questions) answers[q.id] = Math.floor(Math.random() * 4);
  const type = simulate(answers);
  counts[type] = (counts[type] ?? 0) + 1;
}

// typeMap の定義順に出力
const typeOrder = [
  ['villager', '無害な村人'],
  ['shogun', '詰め将軍'],
  ['gatekeeper', 'ため息の門番'],
  ['minister', '下心大臣'],
  ['noble', 'お困り貴族'],
  ['commander', '圧迫軍師'],
  ['sergeant', '飲み会軍曹'],
  ['knight', '正論騎士'],
  ['spy', '色欲の密偵'],
  ['judge', 'お気持ち審判官'],
  ['priest', '情念の神官'],
  ['mage', '支配の魔導士'],
  ['alchemist', '断罪の錬金術師'],
  ['summoner', '強欲の召喚士'],
  ['cursemaster', '執着の呪術師'],
  ['emperor', 'ハラスメント皇帝'],
];

console.log(`\nシミュレーション結果 (N=${N.toLocaleString()} 回)\n`);
console.log('タイプID          | タイプ名               | 出現数    | 出現率');
console.log('------------------+------------------------+-----------+-------');
for (const [id, name] of typeOrder) {
  const c = counts[id] ?? 0;
  const pct = ((c / N) * 100).toFixed(2);
  console.log(`${id.padEnd(17)} | ${name.padEnd(14)} | ${String(c).padStart(9)} | ${pct}%`);
}
console.log('------------------+------------------------+-----------+-------');
console.log(`${'TOTAL'.padEnd(17)} |                | ${String(N).padStart(9)} | 100.00%`);
