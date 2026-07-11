/**
 * 総合最適化スクリプト
 *
 * ① 人間回答モデル (A寄り) でのパラメータ最適化
 * ② 属性別スケールの個別チューニング
 * ③ alchemist超過 / mage・spy不足 の原因となる問題スコアの特定
 * ④ 問題スコア修正案の出力
 */

import { readFileSync } from 'fs';

const src = readFileSync(new URL('../data/harassment-type.ts', import.meta.url), 'utf8');
const qRaw = src.match(/export const harassmentQuestions[\s\S]*?=\s*(\[[\s\S]*?\]);\s*\nexport const harassmentTypes/);
const questionsJson = qRaw[1]
  .replace(/\/\/[^\n]*/g, '').replace(/(\w+):/g, '"$1":')
  .replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
const questions = JSON.parse(questionsJson);

const typeMap = {
  '': 'villager','P':'shogun','M':'gatekeeper','S':'minister','C':'noble',
  'PM':'commander','PS':'sergeant','PC':'knight','MS':'spy','MC':'judge',
  'SC':'priest','PMS':'mage','PMC':'alchemist','PSC':'summoner',
  'MSC':'cursemaster','PMSC':'emperor',
};
const ATTRS = ['P','M','S','C'];
const typeOrder = [
  'villager','shogun','gatekeeper','minister','noble','commander','sergeant','knight',
  'spy','judge','priest','mage','alchemist','summoner','cursemaster','emperor'
];

// ─── 人間回答モデル ─────────────────────────────────────────────
// A(良識的)=40%, B=30%, C=20%, D=10%
const HUMAN_WEIGHTS = [4, 3, 2, 1]; // A,B,C,D の重み
const HUMAN_TOTAL = 10;
// 累積重みで選択
function humanChoice() {
  const r = Math.random() * HUMAN_TOTAL;
  if (r < 4) return 0; // A
  if (r < 7) return 1; // B
  if (r < 9) return 2; // C
  return 3;            // D
}
function randomChoice() { return Math.floor(Math.random() * 4); }

// ─── 生スコア計算 ───────────────────────────────────────────────
function calcRaw(chooseFn) {
  const raw = { P:0, M:0, S:0, C:0 };
  for (const q of questions) {
    const choice = q.choices[chooseFn()];
    for (const a of ATTRS) raw[a] += choice.scores[a];
  }
  return raw;
}

// ─── タイプ判定（属性別スケール対応）────────────────────────────
function determineType(raw, maxScores, scales, THRESHOLD, GAP) {
  const pct = {};
  for (const a of ATTRS) {
    pct[a] = Math.min(100, Math.round(Math.max(0, raw[a]) / (maxScores[a] * scales[a]) * 100));
  }
  const cands = ATTRS.filter(a => pct[a] >= THRESHOLD);
  if (!cands.length) return 'villager';
  if (cands.length === 1) return typeMap[cands[0]] ?? 'villager';
  const s = [...cands].sort((a,b) => pct[b]-pct[a]);
  if (pct[s[0]] - pct[s[1]] >= GAP) return typeMap[s[0]] ?? 'villager';
  return typeMap[ATTRS.filter(a => cands.includes(a)).join('')] ?? 'villager';
}

// ─── シミュレーション ────────────────────────────────────────────
const N = 300_000;
const humanRaws = Array.from({length:N}, () => calcRaw(humanChoice));
const randomRaws = Array.from({length:N}, () => calcRaw(randomChoice));

function sim(raws, maxScores, scales, THRESHOLD, GAP) {
  const counts = Object.fromEntries(typeOrder.map(t => [t,0]));
  for (const raw of raws) counts[determineType(raw, maxScores, scales, THRESHOLD, GAP)]++;
  const vals = typeOrder.map(t => counts[t]/raws.length*100);
  const mean = 100/16;
  const std = Math.sqrt(vals.reduce((s,v) => s+(v-mean)**2, 0)/16);
  return { counts, std };
}

// ─── Step 1: 現行パラメータで人間モデルの素の分布を確認 ─────────
const maxScores0 = {P:0,M:0,S:0,C:0};
for (const q of questions)
  for (const a of ATTRS) maxScores0[a] += Math.max(...q.choices.map(c => c.scores[a]));

console.log('=== 理論最大スコア ===');
console.log(maxScores0);

const scales0 = {P:0.65,M:0.65,S:0.65,C:0.65};
const human_current = sim(humanRaws, maxScores0, scales0, 40, 20);
const random_current = sim(randomRaws, maxScores0, scales0, 40, 20);

console.log('\n=== 現行パラメータ (SCALE=0.65, THRESHOLD=40, GAP=20) ===');
console.log('                    ランダム  人間(A寄り)');
for (const t of typeOrder) {
  const r = (random_current.counts[t]/N*100).toFixed(1).padStart(7);
  const h = (human_current.counts[t]/N*100).toFixed(1).padStart(11);
  console.log(`  ${t.padEnd(14)} ${r}%  ${h}%`);
}
console.log(`  標準偏差:           ${random_current.std.toFixed(2)}%   ${human_current.std.toFixed(2)}%`);

// ─── Step 2: THRESHOLD/GAP グリッドサーチ（人間モデル基準）────────
console.log('\n=== Step2: 人間モデルでのパラメータ最適化 ===');
let best = { std: 999, params: null };
const candidates = [];
for (const THRESHOLD of [45,50,55,60,65]) {
  for (const GAP of [10,15,20,25]) {
    for (const SCALE of [0.55,0.60,0.65,0.70,0.75,0.80]) {
      const scales = {P:SCALE,M:SCALE,S:SCALE,C:SCALE};
      const r = sim(humanRaws, maxScores0, scales, THRESHOLD, GAP);
      const villain_pct = r.counts['villager']/N*100;
      candidates.push({THRESHOLD,GAP,SCALE,std:r.std,villain_pct,counts:r.counts});
      if (r.std < best.std) best = {std:r.std, params:{THRESHOLD,GAP,SCALE}, counts:r.counts};
    }
  }
}
candidates.sort((a,b) => a.std-b.std);
console.log('上位8パラメータ (標準偏差昇順):');
console.log('SCALE | THRES | GAP | 標準偏差 | villager% | alchemist% | emperor%');
for (const c of candidates.slice(0,8)) {
  const al = (c.counts['alchemist']/N*100).toFixed(1);
  const em = (c.counts['emperor']/N*100).toFixed(1);
  console.log(`${String(c.SCALE).padEnd(5)} |  ${String(c.THRESHOLD).padEnd(4)}|  ${String(c.GAP).padEnd(3)}| ${c.std.toFixed(2).padStart(8)} | ${c.villain_pct.toFixed(1).padStart(9)} | ${al.padStart(10)} | ${em.padStart(8)}`);
}

// ─── Step 3: 属性別スケールチューニング ─────────────────────────
// ベストパラメータをベースに C を厳しく、S を緩くする
console.log('\n=== Step3: 属性別スケールチューニング ===');
const {THRESHOLD: BT, GAP: BG, SCALE: BS} = candidates[0];
let best2 = { std: 999, scales: null, counts: null };
const attrResults = [];
for (const sc of [BS-0.10, BS-0.05, BS, BS+0.05, BS+0.10]) {
  for (const dc of [BS-0.10, BS-0.05, BS, BS+0.05, BS+0.10, BS+0.15]) {
    const scales = {P:BS, M:BS, S:sc, C:dc};
    const r = sim(humanRaws, maxScores0, scales, BT, BG);
    attrResults.push({scales:{...scales}, std:r.std, counts:r.counts});
    if (r.std < best2.std) best2 = {std:r.std, scales:{...scales}, counts:r.counts};
  }
}
attrResults.sort((a,b) => a.std-b.std);
console.log(`ベースパラメータ: THRESHOLD=${BT}, GAP=${BG}, SCALE_P=SCALE_M=${BS}`);
console.log('S_scale | C_scale | 標準偏差 | mage% | spy% | alchemist%');
for (const r of attrResults.slice(0,8)) {
  const m = (r.counts['mage']/N*100).toFixed(1);
  const s = (r.counts['spy']/N*100).toFixed(1);
  const al = (r.counts['alchemist']/N*100).toFixed(1);
  console.log(`${String(r.scales.S).padEnd(7)} | ${String(r.scales.C).padEnd(7)} | ${r.std.toFixed(2).padStart(8)} | ${m.padStart(5)} | ${s.padStart(4)} | ${al.padStart(10)}`);
}

// ─── Step 4: 問題スコアの原因特定 ────────────────────────────────
console.log('\n=== Step4: alchemist(PMC) / mage(PMS) / spy(MS) のスコア構造分析 ===');
// 各問でPMCを一緒に押し上げている選択肢を特定
console.log('\n[alchemist過多の原因] PMCを同時に上げる選択肢 (各スコア≥2):');
for (const q of questions) {
  for (const c of q.choices) {
    if (c.scores.P >= 2 && c.scores.M >= 1 && c.scores.C >= 2 && c.scores.S <= 0) {
      console.log(`  Q${q.number}-${c.id}: P=${c.scores.P} M=${c.scores.M} S=${c.scores.S} C=${c.scores.C}`);
    }
  }
}
console.log('\n[mage不足の原因] PMSを同時に上げる選択肢 (各スコア≥1):');
for (const q of questions) {
  for (const c of q.choices) {
    if (c.scores.P >= 1 && c.scores.M >= 1 && c.scores.S >= 1) {
      console.log(`  Q${q.number}-${c.id}: P=${c.scores.P} M=${c.scores.M} S=${c.scores.S} C=${c.scores.C}`);
    }
  }
}
console.log('\n[spy不足の原因] MSを同時に上げる選択肢 (各スコア≥2, P&C小さい):');
for (const q of questions) {
  for (const c of q.choices) {
    if (c.scores.M >= 2 && c.scores.S >= 2 && c.scores.P <= 1 && c.scores.C <= 1) {
      console.log(`  Q${q.number}-${c.id}: P=${c.scores.P} M=${c.scores.M} S=${c.scores.S} C=${c.scores.C}`);
    }
  }
}

// ─── Step 5: 最終案の詳細表示 ────────────────────────────────────
console.log('\n=== Step5: 推奨パラメータの最終分布 ===');
const finalScales = best2.scales;
const finalCounts = best2.counts;
console.log(`パラメータ: THRESHOLD=${BT}, GAP=${BG}`);
console.log(`SCALE: P=${finalScales.P} M=${finalScales.M} S=${finalScales.S} C=${finalScales.C}`);
console.log(`標準偏差: ${best2.std.toFixed(2)}%\n`);
for (const t of typeOrder) {
  const pct = (finalCounts[t]/N*100).toFixed(2);
  const bar = '█'.repeat(Math.round(finalCounts[t]/N*100*1.5));
  console.log(`  ${t.padEnd(14)} ${pct.padStart(5)}% ${bar}`);
}
