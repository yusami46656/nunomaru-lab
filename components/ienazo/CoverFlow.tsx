"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type FlowItem = {
  image: string; // 16:9
  title: string;
  href: string;
};

const AUTO_MS = 4000;

/** 円環上の最短符号付き距離（ラップアラウンド） */
function signedDist(i: number, active: number, n: number) {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

/** 配置：中央は正面、左右は2枚ずつパースで台形に。translateXは自分の幅基準(%)でコンテナ内に収まる */
function styleFor(off: number): React.CSSProperties {
  if (off === 0) {
    return { transform: "translate(-50%, -50%) scale(1)", zIndex: 40, opacity: 1 };
  }
  const abs = Math.abs(off);
  const sign = Math.sign(off);
  const x = abs === 1 ? 64 : 112; // % of own width（縦長カバー用）
  const ry = -sign * (abs === 1 ? 56 : 66);
  const scale = abs === 1 ? 0.8 : 0.62;
  return {
    transform: `translate(-50%, -50%) translateX(${sign * x}%) rotateY(${ry}deg) scale(${scale})`,
    zIndex: 30 - abs,
    opacity: abs === 1 ? 0.78 : 0.5,
  };
}

/**
 * カバーフロー（16:9・コンテナ内に収まる単体ウィジェット）。
 * 中央は正面で大きく、左右は2枚ずつ台形で待機。自動で順に切替。
 * 親要素の幅にフィットする（ヒーロー右カラム等に配置可能）。
 */
export function CoverFlow({ items }: { items: FlowItem[] }) {
  const n = items.length;
  const visible = Math.max(1, Math.min(2, Math.ceil(n / 2) - 1));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current || n <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => clearInterval(id);
  }, [paused, n]);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  return (
    <div
      aria-roledescription="カバーフロー"
      aria-label="作品ビジュアル"
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* 3Dステージ（縦長カバーが大きく収まる比率） */}
      <div className="relative aspect-[7/6] w-full overflow-hidden" style={{ perspective: "1400px" }}>
        {items.map((it, i) => {
          const off = signedDist(i, active, n);
          if (Math.abs(off) > visible) return null;
          const isCenter = off === 0;
          return (
            <div
              key={it.image}
              className="absolute left-1/2 top-1/2 aspect-[3/4] w-[56%] transition-[transform,opacity] duration-[600ms] ease-out"
              style={styleFor(off)}
              aria-hidden={!isCenter}
            >
              {isCenter ? (
                /* ダミー画像は押せない（作品詳細は後日LP化）。リンクなし */
                <div className="block h-full w-full border border-white/25 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.title} className="h-full w-full object-cover" draggable={false} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${it.title} を中央に表示`}
                  className="block h-full w-full border border-white/15"
                  tabIndex={-1}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt="" className="h-full w-full object-cover" draggable={false} />
                </button>
              )}
            </div>
          );
        })}

        {/* 送りボタン */}
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="前の作品"
          className="absolute left-1 top-1/2 z-40 -translate-y-1/2 border border-white/30 px-2.5 py-2 text-lg leading-none text-white/80 transition-colors hover:bg-white/10 sm:left-2"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="次の作品"
          className="absolute right-1 top-1/2 z-40 -translate-y-1/2 border border-white/30 px-2.5 py-2 text-lg leading-none text-white/80 transition-colors hover:bg-white/10 sm:right-2"
        >
          ›
        </button>
      </div>

      {/* インジケータ */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {items.map((it, i) => (
          <button
            key={it.image}
            type="button"
            onClick={() => go(i)}
            aria-label={`${i + 1}番目を表示`}
            aria-current={i === active}
            className={`h-2 w-2 border border-white/70 transition-colors ${
              i === active ? "bg-white" : "bg-transparent hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
