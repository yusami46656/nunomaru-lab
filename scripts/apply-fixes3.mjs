/**
 * Round 3: minister過多 → spy/judge 底上げ
 *
 * minister(S単独)が高い原因: S単独選択肢が多すぎる
 * spy(MS)が低い: S選択肢にMが乗っていない
 * judge(MC)が低い: M+C同時押しが少ない
 *
 * 追加修正:
 * Q5-C  「私だけ雑に扱われてる気がする」→ M+C的言動, S:2→0(感情操作+要求=MC)
 * Q9-B  「食事に誘う」→ S+M(誘いは境界侵入でMも入る), M:0→1
 * Q14-C 「痩せた?綺麗になったね」→ M:-1→0(外見批評はMマイナスでなく中立)
 * Q16-B 「みんな見えてる?と個別確認」→ M:1→2(SNS監視=MS強化)
 */

import { readFileSync } from 'fs';

const src = readFileSync(new URL('../data/harassment-type.ts', import.meta.url), 'utf8');
const qRaw = src.match(/export const harassmentQuestions[\s\S]*?=\s*(\[[\s\S]*?\]);\s*\nexport const harassmentTypes/);
const questionsJson = qRaw[1]
  .replace(/\/\/[^\n]*/g, '').replace(/(\w+):/g, '"$1":')
  .replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
const questions = JSON.parse(questionsJson);

const typeMap = {
  '':'villager','P':'shogun','M':'gatekeeper','S':'minister','C':'noble',
  'PM':'commander','PS':'sergeant','PC':'knight','MS':'spy','MC':'judge',
  'SC':'priest','PMS':'mage','PMC':'alchemist','PSC':'summoner',
  'MSC':'cursemaster','PMSC':'emperor',
};
const ATTRS=['P','M','S','C'];
const typeOrder=[
  'villager','shogun','gatekeeper','minister','noble','commander','sergeant','knight',
  'spy','judge','priest','mage','alchemist','summoner','cursemaster','emperor'
];
const typeNames={
  villager:'無害な村人',shogun:'詰め将軍',gatekeeper:'ため息の門番',
  minister:'下心大臣',noble:'お困り貴族',commander:'圧迫軍師',
  sergeant:'飲み会軍曹',knight:'正論騎士',spy:'色欲の密偵',
  judge:'お気持ち審判官',priest:'情念の神官',mage:'支配の魔導士',
  alchemist:'断罪の錬金術師',summoner:'強欲の召喚士',cursemaster:'執着の呪術師',
  emperor:'ハラスメント皇帝',
};

const ALL_PATCHES = {
  2:  { D: { C: 0 } },
  3:  { D: { C: 1 } },
  5:  { C: { S: 0 } },                      // ← judge化: MSC→MC
  6:  { B: { C: 3 }, C: { C: 2 }, D: { C: 0 } },
  7:  { C: { S: 3, C: 0 }, D: { C: 0 } },
  8:  { D: { C: 3 } },
  9:  { B: { M: 1 }, C: { P: 0, M: 1 } },  // ← spy化: S→MS
  10: { B: { S: 2, C: 3 }, D: { C: 3 } },
  13: { D: { M: 2, C: 0 } },
  14: { C: { M: 0 } },                      // ← M:-1→0 (外見言及=MS化)
  15: { C: { P: 1, C: 0 } },
  16: { B: { M: 2 } },                      // ← spy化: SNS確認=MS強化
};

function applyPatches(qs, patches) {
  return qs.map(q => {
    const p=patches[q.number];
    if(!p)return q;
    return{...q,choices:q.choices.map(c=>{const cp=p[c.id];if(!cp)return c;return{...c,scores:{...c.scores,...cp}};})};
  });
}
function buildMax(qs){
  const m={P:0,M:0,S:0,C:0};
  for(const q of qs)for(const a of ATTRS)m[a]+=Math.max(...q.choices.map(c=>c.scores[a]));
  return m;
}
function humanChoice(){const r=Math.random()*10;if(r<4)return 0;if(r<7)return 1;if(r<9)return 2;return 3;}
function sim(qs,N,SCALE,THRESHOLD,GAP){
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
  return{counts,std};
}

const qFixed=applyPatches(questions,ALL_PATCHES);

console.log('=== 全修正スコア確認 ===');
for(const[qn,patches]of Object.entries(ALL_PATCHES)){
  const qo=questions.find(q=>q.number==qn);
  for(const[cid,changes]of Object.entries(patches)){
    const co=qo.choices.find(c=>c.id===cid);
    const diffs=Object.entries(changes).map(([a,v])=>`${a}:${co.scores[a]}→${v}`).join(' ');
    console.log(`  Q${qn}-${cid}: ${diffs}`);
  }
}

const N=600_000;
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
console.log('SCALE | THRES | GAP | 標準偏差 | min%  | max%  | villager% | minister%');
for(const r of rows.slice(0,8)){
  const vals=typeOrder.map(t=>r.counts[t]/N*100);
  const mn=Math.min(...vals).toFixed(1),mx=Math.max(...vals).toFixed(1);
  const vl=(r.counts['villager']/N*100).toFixed(1);
  const mi=(r.counts['minister']/N*100).toFixed(1);
  console.log(`${String(r.SCALE).padEnd(5)} |  ${String(r.THRESHOLD).padEnd(4)}|  ${String(r.GAP).padEnd(3)}| ${r.std.toFixed(2).padStart(8)} | ${mn.padStart(5)} | ${mx.padStart(5)} | ${vl.padStart(9)} | ${mi.padStart(9)}`);
}

const{THRESHOLD,GAP,SCALE}=best.p;
console.log(`\n=== 最良: SCALE=${SCALE}, THRESHOLD=${THRESHOLD}, GAP=${GAP}, std=${best.std.toFixed(2)}% ===\n`);
for(const t of typeOrder){
  const pct=(best.counts[t]/N*100).toFixed(2);
  const bar='█'.repeat(Math.round(best.counts[t]/N*100*1.5));
  const ok=best.counts[t]/N*100>=3&&best.counts[t]/N*100<=12?'':' ⚠';
  console.log(`  ${t.padEnd(14)} ${typeNames[t].padEnd(12)} ${pct.padStart(5)}% ${bar}${ok}`);
}
