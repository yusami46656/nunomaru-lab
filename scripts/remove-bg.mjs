import { Jimp } from "jimp";
import { readdir } from "fs/promises";
import { join } from "path";

const CHAR_DIR = new URL("../public/character/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const TOLERANCE = 30; // 0-255: 白との距離の許容値（大きいほど多く除去）

function isNearWhite(r, g, b) {
  return r >= 255 - TOLERANCE && g >= 255 - TOLERANCE && b >= 255 - TOLERANCE;
}

// 四隅からフラッドフィルで外側の白背景だけを透過にする
function floodFill(data, width, height, startX, startY) {
  const visited = new Uint8Array(width * height);
  const queue = [[startX, startY]];

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const pixelIdx = idx * 4;
    const r = data[pixelIdx];
    const g = data[pixelIdx + 1];
    const b = data[pixelIdx + 2];
    const a = data[pixelIdx + 3];

    if (a === 0 || isNearWhite(r, g, b)) {
      data[pixelIdx + 3] = 0; // 透過
      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }
}

async function process(filePath) {
  const img = await Jimp.read(filePath);
  const { width, height } = img.bitmap;
  const data = img.bitmap.data;

  // 四隅からフラッドフィル
  floodFill(data, width, height, 0, 0);
  floodFill(data, width, height, width - 1, 0);
  floodFill(data, width, height, 0, height - 1);
  floodFill(data, width, height, width - 1, height - 1);

  await img.write(filePath);
  console.log(`✓ ${filePath}`);
}

const HEIC_SIG = Buffer.from([0x66, 0x74, 0x79, 0x70]); // 'ftyp' at offset 4
const JPEG_SIG = Buffer.from([0xff, 0xd8, 0xff]);

async function detectFormat(filePath) {
  const { readFile } = await import("fs/promises");
  const buf = await readFile(filePath);
  if (buf.slice(0, 3).equals(JPEG_SIG)) return "jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf.slice(4, 8).equals(HEIC_SIG)) return "heic";
  return "unknown";
}

const allFiles = await readdir(CHAR_DIR);
const pngFiles = allFiles.filter((f) => f.endsWith(".png"));

if (pngFiles.length === 0) {
  console.log("PNG ファイルが見つかりません");
} else {
  for (const f of pngFiles) {
    const fp = join(CHAR_DIR, f);
    const fmt = await detectFormat(fp);
    if (fmt === "heic") {
      console.warn(`⚠ ${f}: HEICファイルです。Windowsのフォトアプリ等でPNG/JPEGに変換してから再実行してください。`);
      continue;
    }
    await process(fp);
  }
  console.log("完了");
}
