// /ienazo のスクリーンショットを撮る（システムの Edge を使用）。
// 実行: node scripts/shot-ienazo.mjs
import { chromium } from "playwright";
import path from "node:path";

const URL = "http://localhost:3411/ienazo";
const OUT = path.resolve("scripts/shots");
import { mkdirSync } from "node:fs";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });

// デスクトップ
const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const dp = await dctx.newPage();
await dp.goto(URL, { waitUntil: "networkidle" });
await dp.waitForTimeout(1500);
await dp.screenshot({ path: path.join(OUT, "desktop-hero.png") }); // ファーストビュー
// スクロールして出現演出(IntersectionObserver)を発火させる
await dp.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 350) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 110));
  }
  window.scrollTo(0, 0);
});
await dp.waitForTimeout(900);
// 各セクションのスクショ
for (const id of ["about", "free-trial", "works"]) {
  const el = await dp.$(`#${id}`);
  if (el) await el.screenshot({ path: path.join(OUT, `desktop-${id}.png`) });
}
await dp.screenshot({ path: path.join(OUT, "desktop-full.png"), fullPage: true });

// モバイル
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const mp = await mctx.newPage();
await mp.goto(URL, { waitUntil: "networkidle" });
await mp.waitForTimeout(1500);
await mp.screenshot({ path: path.join(OUT, "mobile-hero.png") });
await mp.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 300) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
  window.scrollTo(0, 0);
});
await mp.waitForTimeout(800);
for (const id of ["about", "free-trial", "works"]) {
  const el = await mp.$(`#${id}`);
  if (el) await el.screenshot({ path: path.join(OUT, `mobile-${id}.png`) });
}
await mp.screenshot({ path: path.join(OUT, "mobile-full.png"), fullPage: true });

await browser.close();
console.log("done");
