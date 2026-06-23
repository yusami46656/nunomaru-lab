"use client";

import { useState } from "react";

export type StoryShot = { src: string; caption: string };

/**
 * 作品ページ STORY のギャラリー（Amazon の商品画像風）。
 * 上（左カラム）に大きな1枚、その下にサムネイルを並べ、タップで主画像を切り替える。
 * 画像の縦横比はまちまちなので object-contain＋暗色背景で全体を見せる（説明文は出さない）。
 */
export function StoryGallery({ shots }: { shots: StoryShot[] }) {
  const [active, setActive] = useState(0);
  if (shots.length === 0) return null;
  const main = shots[Math.min(active, shots.length - 1)];

  return (
    <div>
      {/* 主画像 */}
      <div className="relative aspect-[4/3] overflow-hidden border border-ienazo-rule bg-ienazo-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={main.src}
          src={main.src}
          alt={main.caption}
          className="h-full w-full object-contain object-center"
          draggable={false}
        />
      </div>

      {/* サムネイル */}
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5">
        {shots.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={s.caption}
            aria-current={i === active}
            className={`relative aspect-square overflow-hidden border bg-ienazo-ink transition-[opacity,border-color] ${
              i === active
                ? "border-ienazo-red"
                : "border-ienazo-rule opacity-60 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" className="h-full w-full object-contain object-center" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
