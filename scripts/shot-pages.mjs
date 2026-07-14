// 内部ページのスクショ（Edge使用）。実行: node scripts/shot-pages.mjs
import { chromium } from "playwright";
import path from "node:path";
import { mkdirSync } from "node:fs";

const OUT = path.resolve("scripts/shots");
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3411";
const pages = [
  ["works", "/ienazo/works"],
  ["work-detail", "/ienazo/works/heart-no-inai-kuni"],
  ["howto", "/ienazo/howto"],
  ["faq", "/ienazo/faq"],
  ["tokushoho", "/ienazo/legal/tokushoho"],
  ["login", "/ienazo/account/login"],
];

const browser = await chromium.launch({ channel: "msedge" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
for (const [name, url] of pages) {
  await p.goto(base + url, { waitUntil: "networkidle" });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(OUT, `pg-${name}.png`), fullPage: true });
  console.log("shot", name);
}
await browser.close();
console.log("done");
