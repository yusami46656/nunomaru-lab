// 家謎トップ用のダミー画像を生成する（鍵穴モチーフ）。
//   cover-0X.svg : 縦3:4（作品棚のカード用）
//   hero-0X.svg  : 横16:9（ヒーローのカバーフロー / 詳細ヒーロー用）
// 実行: node scripts/gen-ienazo-dummy.mjs
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/ienazo/dummy");
await mkdir(OUT, { recursive: true });

const THEMES = [
  { bg: "#181818", fg: "#f7f6f2", accent: "#a23a35" }, // dark
  { bg: "#f7f6f2", fg: "#181818", accent: "#a23a35" }, // light
  { bg: "#a23a35", fg: "#f7f6f2", accent: "#f7f6f2" }, // red
];

/** 鍵穴のみ（円＋すそ広がり）＋囲みリング */
function keyhole(cx, cy, r, fg) {
  const top = cy - r * 0.15;
  const slotTopY = cy + r * 0.4;
  const slotBotY = cy + r * 2.5;
  const wTop = r * 0.5;
  const wBot = r * 0.92;
  return `
    <circle cx="${cx}" cy="${cy + r * 0.4}" r="${r * 2.0}" fill="none" stroke="${fg}" stroke-opacity="0.22" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy + r * 0.4}" r="${r * 2.55}" fill="none" stroke="${fg}" stroke-opacity="0.10" stroke-width="2"/>
    <g fill="${fg}">
      <circle cx="${cx}" cy="${top}" r="${r}"/>
      <path d="M ${cx - wTop} ${slotTopY} L ${cx - wBot} ${slotBotY} L ${cx + wBot} ${slotBotY} L ${cx + wTop} ${slotTopY} Z"/>
    </g>`;
}

function frame(W, H, fg) {
  return `
  <rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="${fg}" stroke-opacity="0.5"/>
  <rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="${fg}" stroke-opacity="0.16"/>`;
}

function cover(n) {
  const t = THEMES[(n - 1) % THEMES.length];
  const num = String(n).padStart(2, "0");
  const W = 600, H = 800;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="ダミー作品カバー ${num}">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>${frame(W, H, t.fg)}
  <text x="56" y="132" fill="${t.fg}" font-family="'Zen Maru Gothic',sans-serif" font-size="76" font-weight="700">${num}</text>
  <rect x="58" y="156" width="72" height="8" fill="${t.accent}"/>
  ${keyhole(W / 2, 360, 58, t.fg)}
  <text x="56" y="${H - 112}" fill="${t.fg}" font-family="'Zen Maru Gothic',sans-serif" font-size="34" font-weight="700">作品タイトル</text>
  <text x="56" y="${H - 70}" fill="${t.fg}" fill-opacity="0.55" font-family="'Zen Maru Gothic',sans-serif" font-size="20" letter-spacing="5">DUMMY COVER — ${num}</text>
</svg>
`;
}

function hero(n) {
  const t = THEMES[(n - 1) % THEMES.length];
  const num = String(n).padStart(2, "0");
  const W = 1600, H = 900;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="ダミーヒーロー ${num}">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <g stroke="${t.fg}" stroke-opacity="0.10" stroke-width="1">
    <line x1="${W / 3}" y1="0" x2="${W / 3}" y2="${H}"/>
    <line x1="${(W / 3) * 2}" y1="0" x2="${(W / 3) * 2}" y2="${H}"/>
    <line x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}"/>
  </g>${frame(W, H, t.fg)}
  <text x="64" y="150" fill="${t.fg}" font-family="'Zen Maru Gothic',sans-serif" font-size="96" font-weight="700">${num}</text>
  <rect x="66" y="180" width="96" height="9" fill="${t.accent}"/>
  ${keyhole(W / 2, 380, 80, t.fg)}
  <text x="64" y="${H - 96}" fill="${t.fg}" font-family="'Zen Maru Gothic',sans-serif" font-size="44" font-weight="700">作品タイトル（ダミー）</text>
  <text x="64" y="${H - 52}" fill="${t.fg}" fill-opacity="0.55" font-family="'Zen Maru Gothic',sans-serif" font-size="24" letter-spacing="6">DUMMY HERO — ${num}</text>
</svg>
`;
}

for (let n = 1; n <= 6; n++) {
  const c = `cover-${String(n).padStart(2, "0")}.svg`;
  const h = `hero-${String(n).padStart(2, "0")}.svg`;
  await writeFile(path.join(OUT, c), cover(n), "utf8");
  await writeFile(path.join(OUT, h), hero(n), "utf8");
  console.log(`wrote ${c}, ${h}`);
}
