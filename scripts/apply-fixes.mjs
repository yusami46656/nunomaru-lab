/**
 * 問題スコア修正案を適用してシミュレーション
 *
 * 修正方針:
 * (1) alchemist過多の原因: PMCを同時に押すC値を削減
 *     → Q3-D, Q6-B, Q6-C, Q7-D, Q8-D, Q10-D のC値を下げる
 * (2) spy不足の原因: MS同時押しが少ない
 *     → Q13-D に M:2 を追加（私生活詮索=モラハラ+セクハラ の意味で正当）
 * (3) mage不足: PMS同時押しが弱い
 *     → Q7-C のS:1,C:1 → S:3,C:0（立場を使ったプライバシー侵入）
 * (4) gatekeeper不足: M単独が少ない
 *     → Q6-D のC:2 → C:0（社会人失格発言は純粋なモラハラ）
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
const typeNames = {
  villager:'無害な村人', shogun:'詰め将軍', gatekeeper:'ため息の門番',
  minister:'下心大臣', noble:'お困り貴族', commander:'圧迫軍師',
  sergeant:'飲み会軍曹', knight:'正論騎士', spy:'色欲の密偵',
  judge:'お気持ち審判官', priest:'情念の神官', mage:'支配の魔導士',
  alchemist:'断罪の錬金術師', summoner:'強欲の召喚士', cursemaster:'執着の呪術師',
  emperor:'ハラスメント皇帝',
};

// ─── 修正テーブル: { Q番号: { 選択肢id: { 属性: 新スコア } } } ─
const SCORE_PATCHES = {
  3:  { D: { C: 1 } },                         // 嫌味→PMC→PMのみ
  6:  { B: { C: 3 }, C: { C: 2 }, D: { C: 0 } }, // 取引先問題: C削減, Mのみ化
  7:  { C: { S: 3, C: 0 }, D: { C: 0 } },       // mage化(PS化) + Cゼロ
  8:  { D: { C: 3 } },                          // 病欠対応: 純PC→P優位
  10: { D: { C: 3 } },                          // 友人ドタキャン: C削減
  13: { D: { M: 2, C: 0 } },                   // spy化: 夜遊び詮索=MS
};

function applyPatches(qs) {
  return qs.map(q => {
    const patch = SCORE_PATCHES[q.number];
    if (!patch) return q;
    return {
      ...q,
      choices: q.choices.map(c => {
        const cp = patch[c.id];
        if (!cp) return c;
        return { ...c, scores: { ...c.scores, ...cp } };
      }),
    };
  });
}

function buildMaxScores(qs) {
  const m = {P:0,M:0,S:0,C:0};
  for (const q of qs)
    for (const a of ATTRS) m[a] += Math.max(...q.choices.map(c => c.scores[a]));
  return m;
}

const HUMAN_W = [4,3,2,1];
const HUMAN_T = 10;
function humanChoice() {
  const r = Math.random()*HUMAN_T;
  if (r<4) return 0; if (r<7) return 1; if (r<9) return 2; return 3;
}

function sim(qs, N, SCALE, THRESHOLD, GAP) {
  const ms = buildMaxScores(qs);
  const counts = Object.fromEntries(typeOrder.map(t=>[t,0]));
  for (let i=0;i<N;i++) {
    const raw={P:0,M:0,S:0,C:0};
    for (const q of qs) {
      const c = q.choices[humanChoice()];
      for (const a of ATTRS) raw[a]+=c.scores[a];
    }
    const pct={};
    for (const a of ATTRS)
      pct[a]=Math.min(100,Math.round(Math.max(0,raw[a])/(ms[a]*SCALE)*100));
    const cands=ATTRS.filter(a=>pct[a]>=THRESHOLD);
    let id;
    if (!cands.length) id='villager';
    else if (cands.length===1) id=typeMap[cands[0]]??'villager';
    else {
      const s=[...cands].sort((a,b)=>pct[b]-pct[a]);
      id=pct[s[0]]-pct[s[1]]>=GAP
        ? typeMap[s[0]]??'villager'
        : typeMap[ATTRS.filter(a=>cands.includes(a)).join('')]??'villager';
    }
    counts[id]++;
  }
  const vals=typeOrder.map(t=>counts[t]/N*100);
  const mean=100/16;
  const std=Math.sqrt(vals.reduce((s,v)=>s+(v-mean)**2,0)/16);
  return {counts,std};
}

const qOrig = questions;
const qFixed = applyPatches(questions);

// 修正後のスコア差分確認
console.log('=== 修正スコア確認 ===');
for (const [qn, patches] of Object.entries(SCORE_PATCHES)) {
  const qo = qOrig.find(q=>q.number==qn);
  const qf = qFixed.find(q=>q.number==qn);
  for (const [cid, changes] of Object.entries(patches)) {
    const co = qo.choices.find(c=>c.id===cid);
    const cf = qf.choices.find(c=>c.id===cid);
    const diffs = Object.entries(changes).map(([a,v])=>`${a}:${co.scores[a]}→${v}`).join(' ');
    console.log(`  Q${qn}-${cid}: ${diffs}`);
  }
}

// グリッドサーチ（修正後）
const N = 400_000;
console.log(`\n=== パラメータ探索 (N=${N.toLocaleString()}, 人間モデル) ===`);
let bestStd = 999, bestP = null, bestCounts = null;
const rows = [];
for (const THRESHOLD of [40,45,50,55]) {
  for (const GAP of [15,20,25]) {
    for (const SCALE of [0.55,0.60,0.65,0.70]) {
      const {counts,std} = sim(qFixed,N,SCALE,THRESHOLD,GAP);
      rows.push({THRESHOLD,GAP,SCALE,std,counts});
      if (std<bestStd) { bestStd=std; bestP={THRESHOLD,GAP,SCALE}; bestCounts=counts; }
    }
  }
}
rows.sort((a,b)=>a.std-b.std);
console.log('SCALE | THRES | GAP | 標準偏差 | min%  | max%  | villager% | emperor%');
for (const r of rows.slice(0,10)) {
  const vals=typeOrder.map(t=>r.counts[t]/N*100);
  const mn=Math.min(...vals).toFixed(1), mx=Math.max(...vals).toFixed(1);
  const vl=(r.counts['villager']/N*100).toFixed(1);
  const em=(r.counts['emperor']/N*100).toFixed(1);
  console.log(`${String(r.SCALE).padEnd(5)} |  ${String(r.THRESHOLD).padEnd(4)}|  ${String(r.GAP).padEnd(3)}| ${r.std.toFixed(2).padStart(8)} | ${mn.padStart(5)} | ${mx.padStart(5)} | ${vl.padStart(9)} | ${em.padStart(8)}`);
}

// 最良パラメータの詳細
const {THRESHOLD,GAP,SCALE} = bestP;
console.log(`\n=== 最良パラメータ: SCALE=${SCALE}, THRESHOLD=${THRESHOLD}, GAP=${GAP} ===`);
console.log(`標準偏差: ${bestStd.toFixed(2)}%  (目標6.25%±各タイプ約3%以内)\n`);
for (const t of typeOrder) {
  const pct=(bestCounts[t]/N*100).toFixed(2);
  const bar='█'.repeat(Math.round(bestCounts[t]/N*100*1.5));
  const ok=bestCounts[t]/N*100>=3 && bestCounts[t]/N*100<=11 ? '' : ' ⚠';
  console.log(`  ${t.padEnd(14)} ${typeNames[t].padEnd(12)} ${pct.padStart(5)}% ${bar}${ok}`);
}

// 元との比較
console.log('\n=== 元パラメータ(SCALE=0.65,THRESHOLD=40,GAP=20)との比較 ===');
const origResult = sim(qOrig,N,0.65,40,20);
console.log(`${'タイプ'.padEnd(18)} ${'修正前'.padStart(7)} ${'修正後'.padStart(7)} ${'変化'.padStart(7)}`);
for (const t of typeOrder) {
  const before=(origResult.counts[t]/N*100).toFixed(1);
  const after=(bestCounts[t]/N*100).toFixed(1);
  const delta=((bestCounts[t]-origResult.counts[t])/N*100).toFixed(1);
  const sign=delta>0?'+':'';
  console.log(`  ${typeNames[t].padEnd(14)} ${before.padStart(7)}% ${after.padStart(7)}% ${(sign+delta).padStart(7)}%`);
}
