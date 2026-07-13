// 『ハートのいない国』紹介サイト用アセットを、エンジン採用アセットから合成する。
// 体験版(broken-android)の cover/hero/OGP 構成にならう。
// 入力: ienazo/app/public/works/heart-no-inai-kuni/{kv_title,kv_logo}.webp ほか
// 出力: nunomaru-lab/public/ienazo/works/heart-no-inai-kuni/ + og/og_heart-no-inai-kuni.png
import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENGINE = path.resolve(__dirname, "../../ienazo/app/public/works/heart-no-inai-kuni");
const OUT = path.resolve(__dirname, "../public/ienazo/works/heart-no-inai-kuni");
const OGOUT = path.resolve(__dirname, "../public/ienazo/og");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OGOUT, { recursive: true });

const KV = path.join(ENGINE, "kv_title.webp");
const LOGO = path.join(ENGINE, "kv_logo.webp");
// 家謎ブランドロゴ（家アイコン＋-ienazo-＋家謎）。OGP左下に白版で焼く（体験版OGP準拠）。
const BRAND = path.resolve(__dirname, "../public/ienazo/logo_lockup.png");

// ブランドロゴを白版にしてトリム（黒シェイプ→白、透過は維持）
async function whiteBrand(targetW) {
  return await sharp(BRAND)
    .trim({ threshold: 10 })
    .negate({ alpha: false }) // RGBのみ反転（黒→白）、アルファは保持
    .resize({ width: targetW })
    .png()
    .toBuffer();
}

// トリム済みロゴ（透明余白を除去）を一度だけ用意
async function trimmedLogo() {
  return await sharp(LOGO).trim({ threshold: 10 }).png().toBuffer();
}

// 題字の裏に敷く柔らかい暗部（背景同化を防ぐ）。中心(cx,cy)・半径(rx,ry)の放射状暗部。
function softDark(w, h, cx, cy, rx, ry, alpha = 0.55) {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="r" cx="${cx / w}" cy="${cy / h}" r="0.5"
        gradientTransform="translate(${(cx / w) * (1 - w / (2 * rx))} 0) scale(${w / (2 * rx)} ${h / (2 * ry)})">
      <stop offset="0" stop-color="#0a0e1c" stop-opacity="${alpha}"/>
      <stop offset="0.7" stop-color="#0a0e1c" stop-opacity="${alpha * 0.55}"/>
      <stop offset="1" stop-color="#0a0e1c" stop-opacity="0"/>
    </radialGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#r)"/></svg>`;
  return Buffer.from(svg);
}

// 上からの暗幕グラデ（題字の可読性確保）。SVG を生成。
function topGradient(w, h, ratio = 0.5, maxAlpha = 0.72) {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b1020" stop-opacity="${maxAlpha}"/>
      <stop offset="${ratio}" stop-color="#0b1020" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/></svg>`;
  return Buffer.from(svg);
}
// 下からの暗幕（接地感）
function bottomGradient(w, h, ratio = 0.7, maxAlpha = 0.55) {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#0b1020" stop-opacity="${maxAlpha}"/>
      <stop offset="${1 - ratio}" stop-color="#0b1020" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/></svg>`;
  return Buffer.from(svg);
}

function coverCrop(w, h) {
  // kv_title(1536x1024) を w×h に cover クロップ
  return sharp(KV).resize(w, h, { fit: "cover", position: "centre" });
}

async function resizeLogo(logoBuf, targetW) {
  return await sharp(logoBuf).resize({ width: targetW }).toBuffer();
}

(async () => {
  const logo = await trimmedLogo();

  // ---- hero.webp (1600x900) 横ヒーロー：KV中央の暗部に題字 ----
  {
    const W = 1600, H = 900;
    const base = await coverCrop(W, H).toBuffer();
    const logoW = 1000;
    const lb = await resizeLogo(logo, logoW);
    const lMeta = await sharp(lb).metadata();
    const lx = Math.round((W - lMeta.width) / 2);
    const ly = Math.round(H * 0.28);
    const composited = await sharp(base)
      .composite([
        { input: topGradient(W, H, 0.42, 0.5), top: 0, left: 0 },
        { input: bottomGradient(W, H, 0.35, 0.45), top: 0, left: 0 },
        { input: softDark(W, H, W / 2, ly + lMeta.height / 2, lMeta.width * 0.62, lMeta.height * 0.95, 0.5), top: 0, left: 0 },
        { input: lb, top: ly, left: lx },
      ])
      .webp({ quality: 86 })
      .toBuffer();
    fs.writeFileSync(path.join(OUT, "hero.webp"), composited);
    console.log("hero.webp", W + "x" + H);
  }

  // ---- cover.webp (1024x1536) 縦カバー：アリサに寄せたタイトクロップ＋上部に大きく題字 ----
  // Codex がタテ専用KV(kv_cover)を納品したら、それを起点に切替える（指示書 D-3）。
  const KV_COVER = ["kv_cover.png", "kv_cover.webp"]
    .map((f) => path.join(ENGINE, f))
    .find((p) => fs.existsSync(p));
  {
    const W = 1024, H = 1536;
    const logoW = 900;
    const lb = await resizeLogo(logo, logoW);
    const lMeta = await sharp(lb).metadata();
    const lx = Math.round((W - lMeta.width) / 2);
    const ly = Math.round(H * 0.06);
    let composited;
    if (KV_COVER) {
      // タテ専用KVは上部が明るい空＝題字余白が確保済み。露出はいじらず、暗幕も敷かず、題字だけ載せる。
      composited = await sharp(KV_COVER)
        .resize(W, H, { fit: "cover", position: "centre" })
        .composite([{ input: lb, top: ly, left: lx }])
        .webp({ quality: 90 })
        .toBuffer();
    } else {
      // フォールバック: 横KVの右側(アリサ+城+バラ柱)にタイトに寄せて portrait 化（暗い中央柱を避ける）
      const cropped = await sharp(KV)
        .extract({ left: 960, top: 160, width: 576, height: 864 })
        .resize(W, H, { fit: "fill" })
        .modulate({ brightness: 1.05 })
        .toBuffer();
      composited = await sharp(cropped)
        .composite([
          { input: topGradient(W, H, 0.3, 0.78), top: 0, left: 0 },
          { input: bottomGradient(W, H, 0.18, 0.32), top: 0, left: 0 },
          { input: softDark(W, H, W / 2, ly + lMeta.height / 2, lMeta.width * 0.64, lMeta.height * 1.0, 0.34), top: 0, left: 0 },
          { input: lb, top: ly, left: lx },
        ])
        .webp({ quality: 90 })
        .toBuffer();
    }
    fs.writeFileSync(path.join(OUT, "cover.webp"), composited);
    console.log("cover.webp", W + "x" + H);
  }

  // ---- key_sisters.webp（ロゴなしKVから上部の空をトリミング＝作品ページ ギャラリー1枚目） ----
  if (KV_COVER) {
    // kv_cover(1024x1536) の上部の空を落とし、二人を主役に据えた正方形寄りのカット
    const top = 410, h = 1536 - top; // 上部の空だけ削る（人物・足元は残す）
    const shot = await sharp(KV_COVER)
      .extract({ left: 0, top, width: 1024, height: h })
      .webp({ quality: 90 })
      .toBuffer();
    fs.writeFileSync(path.join(OUT, "key_sisters.webp"), shot);
    console.log("key_sisters.webp", "1024x" + h);
  }

  // ---- OGP og_heart-no-inai-kuni.png (1200x630) ----
  {
    const W = 1200, H = 630;
    const base = await coverCrop(W, H).toBuffer();
    const logoW = 720; // アリサに被らないサイズ（拡大しない）
    const lb = await resizeLogo(logo, logoW);
    const lMeta = await sharp(lb).metadata();
    const lx = Math.round((W - lMeta.width) / 2);
    const ly = Math.round(H * 0.26);
    // 家謎ブランドロゴ（白版）を左下に
    const brandW = 250;
    const brand = await whiteBrand(brandW);
    const bMeta = await sharp(brand).metadata();
    const bx = 44;
    const by = H - bMeta.height - 40;
    const composited = await sharp(base)
      .composite([
        { input: topGradient(W, H, 0.5, 0.5), top: 0, left: 0 },
        { input: bottomGradient(W, H, 0.42, 0.55), top: 0, left: 0 },
        { input: softDark(W, H, W / 2, ly + lMeta.height / 2, lMeta.width * 0.62, lMeta.height * 1.0, 0.5), top: 0, left: 0 },
        { input: lb, top: ly, left: lx },
        // 左下の暗部を少し足してブランドロゴを読ませる
        { input: softDark(W, H, bx + bMeta.width / 2, by + bMeta.height / 2, bMeta.width * 0.95, bMeta.height * 1.6, 0.45), top: 0, left: 0 },
        { input: brand, top: by, left: bx },
      ])
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(OGOUT, "og_heart-no-inai-kuni.png"), composited);
    console.log("og_heart-no-inai-kuni.png", W + "x" + H);
  }

  // ---- storyShots：ネタバレ回避の世界観カットをそのままコピー ----
  const shots = [
    "cg_ch1_1.webp",
    "bg_trump_garden.webp",
    "cg_ch2_1.webp",
    "bg_tea_party.webp",
    "cg_ch3_1.webp",
    "bg_world_map.webp",
  ];
  for (const f of shots) {
    fs.copyFileSync(path.join(ENGINE, f), path.join(OUT, f));
    console.log("copied", f);
  }
  console.log("DONE");
})();
