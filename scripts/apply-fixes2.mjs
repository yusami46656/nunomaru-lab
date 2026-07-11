/**
 * 追加パッチ検証
 * 前回パッチ + 2属性タイプ(spy/judge/cursemaster/gatekeeper)の底上げ
 *
 * 追加修正:
 * Q2-D  「社会人としてその髪型は」→ 純粋なモラハラ, C:1→0
 * Q9-C  「肩に触れる」→ S+M(身体への踏み込み=モラハラ要素あり), P:1→0, M:-1→1
 * Q10-B 「前はこんなことしなかったのに」→ MC寄りに, S:3→2, C:2→3
 * Q15-C 「人としてどうかと思うよ」→ 純粋なモラハラ, P:2→1, C:1→0
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
  villager:'無害な村人',shogun:'詰め将軍',gatekeeper:'ため息の門番',
  minister:'下心大臣',noble:'お困り貴族',commander:'圧迫軍師',
  sergeant:'飲み会軍曹',knight:'正論騎士',spy:'色欲の密偵',
  judge:'お気持ち審判官',priest:'情念の神官',mage:'支配の魔導士',
  alchemist:'断罪の錬金術師',summoner:'強欲の召喚士',cursemaster:'執着の呪術師',
  emperor:'ハラスメント皇帝',
};

const ALL_PATCHES = {
  // Round 1
  3:  { D: { C: 1 } },
  6:  { B: { C: 3 }, C: { C: 2 }, D: { C: 0 } },
  7:  { C: { S: 3, C: 0 }, D: { C: 0 } },
  8:  { D: { C: 3 } },
  10: { B: { S: 2, C: 3 }, D: { C: 3 } },    // ← Q10-Bも修正
  13: { D: { M: 2, C: 0 } },
  // Round 2
  2:  { D: { C: 0 } },
  9:  { C: { P: 0, M: 1 } },
  15: { C: { P: 1, C: 0 } },
};

function applyPatches(qs, patches) {
  return qs.map(q => {
    const patch = patches[q.number];
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

function buildMax(qs) {
  const m={P:0,M:0,S:0,C:0};
  for (const q of qs)
    for (const a of ATTRS) m[a]+=Math.max(...q.choices.map(c=>c.scores[a]));
  return m;
}

function humanChoice() {
  const r=Math.random()*10;
  if(r<4)return 0;if(r<7)return 1;if(r<9)return 2;return 3;
}

function sim(qs, N, SCALE, THRESHOLD, GAP) {
  const ms=buildMax(qs);
  const counts=Object.fromEntries(typeOrder.map(t=>[t,0]));
  for(let i=0;i<N;i++){
    const raw={P:0,M:0,S:0,C:0};
    for(const q of qs){const c=q.choices[humanChoice()];for(const a of ATTRS)raw[a]+=c.scores[a];}
    const pct={};
    for(const a of ATTRS)pct[a]=Math.min(100,Math.round(Math.max(0,raw[a])/(ms[a]*SCALE)*100));
    const cands=ATTRS.filter(a=>pct[a]>=THRESHOLD);
    let id;
    if(!cands.length)id='villager';
    else if(cands.length===1)id=typeMap[cands[0]]??'villager';
    else{
      const s=[...cands].sort((a,b)=>pct[b]-pct[a]);
      id=pct[s[0]]-pct[s[1]]>=GAP?typeMap[s[0]]??'villager':typeMap[ATTRS.filter(a=>cands.includes(a)).join('')]??'villager';
    }
    counts[id]++;
  }
  const vals=typeOrder.map(t=>counts[t]/N*100);
  const mean=100/16;
  const std=Math.sqrt(vals.reduce((s,v)=>s+(v-mean)**2,0)/16);
  return {counts,std};
}

const qFixed = applyPatches(questions, ALL_PATCHES);

// 差分確認
console.log('=== 全修正スコア確認 ===');
for(const [qn,patches] of Object.entries(ALL_PATCHES)){
  const qo=questions.find(q=>q.number==qn);
  const qf=qFixed.find(q=>q.number==qn);
  for(const [cid,changes] of Object.entries(patches)){
    const co=qo.choices.find(c=>c.id===cid);
    const cf=qf.choices.find(c=>c.id===cid);
    const diffs=Object.entries(changes).map(([a,v])=>`${a}:${co.scores[a]}→${v}`).join(' ');
    console.log(`  Q${qn}-${cid}: ${diffs}`);
  }
}

// グリッドサーチ
const N=500_000;
console.log(`\n=== パラメータ最適化 (N=${N.toLocaleString()}) ===`);
let best={std:999,p:null,counts:null};
const rows=[];
for(const THRESHOLD of [40,45,50,55]){
  for(const GAP of [15,20,25]){
    for(const SCALE of [0.55,0.60,0.65,0.70]){
      const r=sim(qFixed,N,SCALE,THRESHOLD,GAP);
      rows.push({THRESHOLD,GAP,SCALE,...r});
      if(r.std<best.std)best={std:r.std,p:{THRESHOLD,GAP,SCALE},counts:r.counts};
    }
  }
}
rows.sort((a,b)=>a.std-b.std);
console.log('SCALE | THRES | GAP | 標準偏差 | min%  | max%  | villager%');
for(const r of rows.slice(0,8)){
  const vals=typeOrder.map(t=>r.counts[t]/N*100);
  const mn=Math.min(...vals).toFixed(1),mx=Math.max(...vals).toFixed(1);
  const vl=(r.counts['villager']/N*100).toFixed(1);
  console.log(`${String(r.SCALE).padEnd(5)} |  ${String(r.THRESHOLD).padEnd(4)}|  ${String(r.GAP).padEnd(3)}| ${r.std.toFixed(2).padStart(8)} | ${mn.padStart(5)} | ${mx.padStart(5)} | ${vl.padStart(9)}`);
}

// 最良の詳細
const {THRESHOLD,GAP,SCALE}=best.p;
console.log(`\n=== 最良: SCALE=${SCALE}, THRESHOLD=${THRESHOLD}, GAP=${GAP}, std=${best.std.toFixed(2)}% ===\n`);
for(const t of typeOrder){
  const pct=(best.counts[t]/N*100).toFixed(2);
  const bar='█'.repeat(Math.round(best.counts[t]/N*100*1.5));
  const ok=best.counts[t]/N*100>=3&&best.counts[t]/N*100<=12?'':' ⚠';
  console.log(`  ${t.padEnd(14)} ${typeNames[t].padEnd(12)} ${pct.padStart(5)}% ${bar}${ok}`);
}
