// 認証ページのスクショ（システムの Edge を使用）。実行: node scripts/shot-auth.mjs
import { chromium } from "playwright";
import path from "node:path";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:3000";
const OUT = path.resolve("scripts/shots");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
for (const slug of ["login", "register"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/ienazo/account/${slug}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: path.join(OUT, `auth-${slug}-desktop.png`), fullPage: true });

  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mp = await mctx.newPage();
  await mp.goto(`${BASE}/ienazo/account/${slug}`, { waitUntil: "networkidle" });
  await mp.waitForTimeout(1200);
  await mp.screenshot({ path: path.join(OUT, `auth-${slug}-mobile.png`) });
}
await browser.close();
console.log("done");
