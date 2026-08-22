// 認証まわり（ログイン／会員登録／ライブラリ）の表示崩れを機械的に見る検証スクリプト。
//
//   1) 別ターミナルで dev サーバーを起動: npm run dev -- -p 3411
//   2) node scripts/shot-auth.mjs
//
// ライブラリはログインが要るので、確認したいときだけ実在アカウントを渡す:
//   IENAZO_TEST_EMAIL=... IENAZO_TEST_PASSWORD=... node scripts/shot-auth.mjs
// 渡さない場合はライブラリを飛ばし、飛ばしたことを最後に明示する（黙って減らさない）。
//
// 出力: tmp/auth-shots/<ページ>-<幅>.png と、幅ごとの判定一覧。
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.IENAZO_BASE_URL || "http://localhost:3411";
const OUT = "tmp/auth-shots";
const WIDTHS = [375, 390, 414, 768, 1280, 1440];
const TAP_MIN = 44; // モバイルでの最小タップ領域(px)
const MOBILE_MAX = 480;

const PAGES = [
  { name: "login", path: "/ienazo/account/login" },
  { name: "register", path: "/ienazo/account/register" },
];

/** ページ内で走らせる測定。崩れの兆候だけを拾って返す。 */
function measure(tapMin, isMobile) {
  const problems = [];

  // 1) 横スクロールが出ていないか
  const overflow = document.documentElement.scrollWidth - window.innerWidth;
  if (overflow > 1) problems.push(`横スクロール +${overflow}px`);

  // タップ領域は本文側だけを見る。サイト共通ヘッダー／フッターはこの改修の対象外で、
  // ここで拾うと毎回同じ指摘が並んで本来の崩れが埋もれる。
  const scope = document.querySelector("main") || document.body;
  const inChrome = (el) => el.closest("header, footer") !== null;

  for (const el of scope.querySelectorAll("button, a[href], input")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    const label = (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 24);

    // 2) タップ領域（モバイル幅のみ。本文中のテキストリンクは対象外）
    if (isMobile && el.tagName === "BUTTON" && !inChrome(el) && rect.height < tapMin) {
      problems.push(`タップ領域 ${Math.round(rect.height)}px「${label}」`);
    }

    // 3) はみ出し
    if (rect.right - window.innerWidth > 1 || rect.left < -1) {
      problems.push(`はみ出し「${label}」`);
    }
  }

  // 4) ソーシャルボタンの文言が2行に折り返していないか。
  //    要素の高さで測ると flex の伸長を折り返しと誤検知するので、
  //    テキストノードに Range を張って「行の矩形が何個できたか」で数える。
  for (const el of document.querySelectorAll("button span")) {
    const text = (el.textContent || "").trim();
    if (!/(Google|LINE|X )/.test(text)) continue;
    const node = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
    if (!node) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const lines = range.getClientRects().length;
    if (lines > 1) problems.push(`文言が${lines}行に折り返し「${text}」`);
  }

  return problems;
}

async function shoot(page, name, width, isMobile) {
  await page.setViewportSize({ width, height: 900 });
  // Reveal は初期状態が opacity:0 で SSR される。ハイドレーションが終わって
  // フェードが明けるまで待たないと、真っ白なスクリーンショットを撮ってしまう。
  await page.waitForLoadState("load");
  await page
    .waitForFunction(
      () => {
        // 見出しから body まで遡って、途中に半透明の親が1つも無いことを確かめる。
        // 外側のラッパーは最初から opacity:1 なので、そこを見ても待ったことにならない。
        const h1 = document.querySelector("main h1");
        if (!h1) return false;
        for (let el = h1; el && el !== document.body; el = el.parentElement) {
          if (parseFloat(getComputedStyle(el).opacity) < 0.99) return false;
        }
        return true;
      },
      { timeout: 15000 },
    )
    .catch(() => console.log("   ! 本文の表示待ちがタイムアウト（画像が白いかもしれない）"));
  await page.waitForTimeout(400); // フォント適用とレイアウト確定を待つ
  await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
  return page.evaluate(
    ([tapMin, mobile]) => {
      // measure() の本体はここに文字列として渡らないので、呼び出し側で注入する
      return window.__measure(tapMin, mobile);
    },
    [TAP_MIN, isMobile],
  );
}

const skipped = [];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
// Reveal（スクロール連動フェード）が撮影時に opacity 0 のままだと中身が写らない。
// 動きを止めれば即表示になり、静的なレイアウトを毎回同じ条件で測れる。
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
await page.addInitScript(`window.__measure = ${measure.toString()}`);

const targets = [...PAGES];

const email = process.env.IENAZO_TEST_EMAIL;
const password = process.env.IENAZO_TEST_PASSWORD;
if (email && password) {
  await page.goto(`${BASE}/ienazo/account/login`, { waitUntil: "domcontentloaded" });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/ienazo\/account\/library/, { timeout: 15000 });
  targets.push({ name: "library", path: "/ienazo/account/library" });
} else {
  skipped.push("library（IENAZO_TEST_EMAIL / IENAZO_TEST_PASSWORD が未設定のため未検証）");
}

let failures = 0;
for (const target of targets) {
  console.log(`\n── ${target.name} ${BASE}${target.path}`);
  for (const width of WIDTHS) {
    await page.goto(`${BASE}${target.path}`, { waitUntil: "domcontentloaded" });
    const problems = await shoot(page, target.name, width, width <= MOBILE_MAX);
    if (problems.length === 0) {
      console.log(`   ${String(width).padStart(4)}px  ok`);
    } else {
      failures += problems.length;
      console.log(`   ${String(width).padStart(4)}px  NG  ${problems.join(" / ")}`);
    }
  }
}

await browser.close();

console.log(`\n画像: ${OUT}/`);
for (const s of skipped) console.log(`飛ばした対象: ${s}`);
console.log(failures === 0 ? "崩れの検出なし。" : `${failures} 件の崩れを検出。`);
process.exit(failures === 0 ? 0 : 1);
