// 家謎ロゴの余白を自動トリミングして tight 版を生成し、SPマークからファビコンも作る。
// 実行: node scripts/crop-ienazo-logo.mjs
import { Jimp } from "jimp";
import path from "node:path";

const DIR = path.resolve("public/ienazo");

const jobs = [
  { src: "ienazo_logo.png", out: "logo_lockup.png" }, // 横ロゴ(家＋家謎)
  { src: "ienazo_logo_sp.png", out: "logo_mark.png" }, // 家＋鍵穴マーク
];

for (const { src, out } of jobs) {
  const img = await Jimp.read(path.join(DIR, src));
  img.autocrop({ tolerance: 0.002, cropOnlyFrames: false });
  await img.write(path.join(DIR, out));
  console.log(`${src} -> ${out} : ${img.width}x${img.height}`);
}

// ファビコン: マークを白の正方キャンバスに中央配置
const mark = await Jimp.read(path.join(DIR, "logo_mark.png"));
const SIZE = 256;
const canvas = new Jimp({ width: SIZE, height: SIZE, color: 0xffffffff });
mark.scaleToFit({ w: Math.round(SIZE * 0.78), h: Math.round(SIZE * 0.78) });
const x = Math.round((SIZE - mark.bitmap.width) / 2);
const y = Math.round((SIZE - mark.bitmap.height) / 2);
canvas.composite(mark, x, y);
await canvas.write(path.join(DIR, "favicon.png"));
console.log(`favicon.png : ${SIZE}x${SIZE}`);
