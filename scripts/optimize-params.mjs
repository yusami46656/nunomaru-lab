// スコアリングパラメータ最適化スクリプト
// THRESHOLD / GAP / SCORE_SCALE の組み合わせをグリッドサーチして
// 最も均衡した出現分布を探す

import { readFileSync } from 'fs';

const src = readFileSync(new URL('../data/harassment-type.ts', import.meta.url), 'utf8');
const qRaw = src.match(/export const harassmentQuestions[\s\S]*?=\s*(\[[\s\S]*?\]);\s*\nexport const harassmentTypes/);
const questionsJson = qRaw[1]
  .replace(/\/\/[^\n]*/g, '')
  .replace(/(\w+):/g, '"$1":')
  .replace(/'/g, '"')
  .replace(/,\s*}/g, '}')
  .replace(/,\s*]/g, ']');
const questions = JSON.parse(questionsJson);

const typeMap = {
  '': 'villager', 'P': 'shogun', 'M': 'gatekeeper', 'S': 'minister', 'C': 'noble',
  'PM': 'commander', 'PS': 'sergeant', 'PC': 'knight', 'MS': 'spy', 'MC': 'judge',
  'SC': 'priest', 'PMS': 'mage', 'PMC': 'alchemist', 'PSC': 'summoner',
  'MSC': 'cursemaster', 'PMSC': 'emperor',
};
const ATTRS = ['P', 'M', 'S', 'C'];

// 理論最大スコアを事前計算
const maxScores = { P: 0, M: 0, S: 0, C: 0 };
for (const q of questions) {
  for (const a of ATTRS) maxScores[a] += Math.max(...q.choices.map(c => c.scores[a]));
}
console.log('理論最大スコア:', maxScores);

// サンプルデータを事前生成（全サンプル共通で使い回す）
const N = 200_000;
const samples = Array.from({ length: N }, () => {
  const ans = {};
  for (const q of questions) ans[q.id] = Math.floor(Math.random() * 4);
  return ans;
});

// 各サンプルの生スコアを事前計算
const rawScoresList = samples.map(answers => {
  const raw = { P: 0, M: 0, S: 0, C: 0 };
  for (const q of questions) {
    const choice = q.choices[answers[q.id]];
    for (const a of ATTRS) raw[a] += choice.scores[a];
  }
  return raw;
});

function runWithParams(SCORE_SCALE, THRESHOLD, GAP) {
  const counts = {};
  for (const id of Object.values(typeMap)) counts[id] = 0;

  for (const raw of rawScoresList) {
    const pct = {};
    for (const a of ATTRS) {
      const effectiveMax = maxScores[a] * SCORE_SCALE;
      pct[a] = Math.min(100, Math.round(Math.max(0, raw[a]) / effectiveMax * 100));
    }

    const candidates = ATTRS.filter(a => pct[a] >= THRESHOLD);
    let typeId;
    if (candidates.length === 0) {
      typeId = 'villager';
    } else if (candidates.length === 1) {
      typeId = typeMap[candidates[0]] ?? 'villager';
    } else {
      const sorted = [...candidates].sort((a, b) => pct[b] - pct[a]);
      if (pct[sorted[0]] - pct[sorted[1]] >= GAP) {
        typeId = typeMap[sorted[0]] ?? 'villager';
      } else {
        const key = ATTRS.filter(a => candidates.includes(a)).join('');
        typeId = typeMap[key] ?? 'villager';
      }
    }
    counts[typeId]++;
  }

  const vals = Object.values(counts);
  const mean = N / 16;
  // 均衡度スコア: 標準偏差（小さいほど均衡）
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / 16;
  const stddev = Math.sqrt(variance);
  // 最小値（0に近いタイプがあるか）
  const minPct = (Math.min(...vals) / N * 100).toFixed(2);
  const maxPct = (Math.max(...vals) / N * 100).toFixed(2);
  const emperorPct = (counts['emperor'] / N * 100).toFixed(1);
  const villagerPct = (counts['villager'] / N * 100).toFixed(1);

  return { stddev, minPct, maxPct, emperorPct, villagerPct, counts };
}

// グリッドサーチ
const results = [];
for (const scale of [0.65, 0.80, 0.90, 1.00, 1.10, 1.20]) {
  for (const threshold of [40, 45, 50, 55, 60]) {
    for (const gap of [10, 15, 20, 25]) {
      const r = runWithParams(scale, threshold, gap);
      results.push({ scale, threshold, gap, ...r });
    }
  }
}

// stddev 昇順にソート（均衡なものが上）
results.sort((a, b) => a.stddev - b.stddev);

console.log('\n上位10パラメータ組み合わせ（均衡度順）\n');
console.log('SCALE | THRES | GAP | 標準偏差  | min%  | max%  | emperor% | villager%');
console.log('------+-------+-----+-----------+-------+-------+----------+----------');
for (const r of results.slice(0, 10)) {
  console.log(
    `${String(r.scale).padEnd(5)} | ${String(r.threshold).padEnd(5)} | ${String(r.gap).padEnd(3)} | ` +
    `${r.stddev.toFixed(1).padStart(9)} | ${r.minPct.padStart(5)} | ${r.maxPct.padStart(5)} | ` +
    `${r.emperorPct.padStart(8)} | ${r.villagerPct.padStart(8)}`
  );
}

// 現行パラメータの結果も表示
const current = runWithParams(0.65, 40, 20);
console.log(`\n現行パラメータ (0.65, 40, 20):`);
console.log(`  標準偏差: ${current.stddev.toFixed(1)}, min: ${current.minPct}%, max: ${current.maxPct}%, emperor: ${current.emperorPct}%, villager: ${current.villagerPct}%`);

// ベスト1の詳細を表示
const best = results[0];
console.log(`\nベストパラメータ (${best.scale}, ${best.threshold}, ${best.gap}) の詳細:`);
const typeOrder = [
  ['villager','無害な村人'],['shogun','詰め将軍'],['gatekeeper','ため息の門番'],
  ['minister','下心大臣'],['noble','お困り貴族'],['commander','圧迫軍師'],
  ['sergeant','飲み会軍曹'],['knight','正論騎士'],['spy','色欲の密偵'],
  ['judge','お気持ち審判官'],['priest','情念の神官'],['mage','支配の魔導士'],
  ['alchemist','断罪の錬金術師'],['summoner','強欲の召喚士'],['cursemaster','執着の呪術師'],
  ['emperor','ハラスメント皇帝'],
];
for (const [id, name] of typeOrder) {
  const c = best.counts[id] ?? 0;
  const bar = '█'.repeat(Math.round(c / N * 100 * 2));
  console.log(`  ${id.padEnd(12)} ${(c/N*100).toFixed(2).padStart(5)}% ${bar}`);
}
