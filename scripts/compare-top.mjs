// 上位3パラメータを並べて比較
import { readFileSync } from 'fs';

const src = readFileSync(new URL('../data/harassment-type.ts', import.meta.url), 'utf8');
const qRaw = src.match(/export const harassmentQuestions[\s\S]*?=\s*(\[[\s\S]*?\]);\s*\nexport const harassmentTypes/);
const questionsJson = qRaw[1]
  .replace(/\/\/[^\n]*/g, '').replace(/(\w+):/g, '"$1":')
  .replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
const questions = JSON.parse(questionsJson);

const typeMap = {
  '': 'villager', 'P': 'shogun', 'M': 'gatekeeper', 'S': 'minister', 'C': 'noble',
  'PM': 'commander', 'PS': 'sergeant', 'PC': 'knight', 'MS': 'spy', 'MC': 'judge',
  'SC': 'priest', 'PMS': 'mage', 'PMC': 'alchemist', 'PSC': 'summoner',
  'MSC': 'cursemaster', 'PMSC': 'emperor',
};
const ATTRS = ['P', 'M', 'S', 'C'];

const maxScores = { P: 0, M: 0, S: 0, C: 0 };
for (const q of questions)
  for (const a of ATTRS) maxScores[a] += Math.max(...q.choices.map(c => c.scores[a]));

const N = 500_000;
const rawScoresList = Array.from({ length: N }, () => {
  const raw = { P: 0, M: 0, S: 0, C: 0 };
  for (const q of questions) {
    const choice = q.choices[Math.floor(Math.random() * 4)];
    for (const a of ATTRS) raw[a] += choice.scores[a];
  }
  return raw;
});

function run(SCORE_SCALE, THRESHOLD, GAP) {
  const counts = {};
  for (const id of Object.values(typeMap)) counts[id] = 0;
  for (const raw of rawScoresList) {
    const pct = {};
    for (const a of ATTRS) {
      pct[a] = Math.min(100, Math.round(Math.max(0, raw[a]) / (maxScores[a] * SCORE_SCALE) * 100));
    }
    const cands = ATTRS.filter(a => pct[a] >= THRESHOLD);
    let id;
    if (!cands.length) { id = 'villager'; }
    else if (cands.length === 1) { id = typeMap[cands[0]] ?? 'villager'; }
    else {
      const s = [...cands].sort((a, b) => pct[b] - pct[a]);
      id = pct[s[0]] - pct[s[1]] >= GAP
        ? typeMap[s[0]] ?? 'villager'
        : typeMap[ATTRS.filter(a => cands.includes(a)).join('')] ?? 'villager';
    }
    counts[id]++;
  }
  return counts;
}

const typeOrder = [
  ['villager','無害な村人'],['shogun','詰め将軍'],['gatekeeper','ため息の門番'],
  ['minister','下心大臣'],['noble','お困り貴族'],['commander','圧迫軍師'],
  ['sergeant','飲み会軍曹'],['knight','正論騎士'],['spy','色欲の密偵'],
  ['judge','お気持ち審判官'],['priest','情念の神官'],['mage','支配の魔導士'],
  ['alchemist','断罪の錬金術師'],['summoner','強欲の召喚士'],['cursemaster','執着の呪術師'],
  ['emperor','ハラスメント皇帝'],
];

const candidates = [
  [0.65, 60, 25, '★ 案A'],
  [0.80, 50, 25, '  案B'],
  [0.90, 45, 25, '  案C'],
];

const results = candidates.map(([s, t, g, label]) => ({ label, counts: run(s, t, g), s, t, g }));

console.log(`\n比較表 (N=${N.toLocaleString()}) — 目標: 各タイプ約6.25%\n`);
const header = 'タイプ名            ' + results.map(r => `${r.label}`.padStart(10)).join(' ');
console.log(header);
console.log('-'.repeat(header.length));

for (const [id, name] of typeOrder) {
  const row = results.map(r => `${(r.counts[id]/N*100).toFixed(2)}%`.padStart(10)).join(' ');
  console.log(`${name.padEnd(16)}    ${row}`);
}

console.log('-'.repeat(header.length));
for (const r of results) {
  const vals = Object.values(r.counts).map(v => v/N*100);
  const mean = 100/16;
  const std = Math.sqrt(vals.reduce((s, v) => s + (v-mean)**2, 0) / 16);
  console.log(`${r.label} (scale=${r.s} threshold=${r.t} gap=${r.g})  標準偏差: ${std.toFixed(2)}%`);
}
