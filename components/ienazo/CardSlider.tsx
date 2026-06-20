"use client";

import { Children, useRef, useState } from "react";

/**
 * カードのシンプルなスライダー。
 * - スマホ：1枚ずつ表示。指の横スワイプで前後に切替（縦スクロールは邪魔しない）。
 *   カードの左右にさりげない矢印を重ね、押すと前後の1枚へ。ドット等は無し。
 *   位置は transform で制御（スナップ巻き戻り等が無く確実）。
 * - sm 以上：従来どおり 3 列グリッドで一覧表示。
 * 子要素として「カード本体（h-full のボックス）」を3枚渡す。
 */
export function CardSlider({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);
  const n = items.length;
  const [i, setI] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);

  const go = (d: -1 | 1) => setI((v) => Math.min(n - 1, Math.max(0, v + d)));

  const onTouchStart = (e: React.TouchEvent) => {
    start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!start.current) return;
    const dx = e.changedTouches[0].clientX - start.current.x;
    const dy = e.changedTouches[0].clientY - start.current.y;
    // 横移動が縦より大きく、しきい値を超えたときだけ切替（縦スクロールは妨げない）
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    start.current = null;
  };

  const Arrow = ({ dir, disabled }: { dir: -1 | 1; disabled: boolean }) => (
    <button
      type="button"
      onClick={() => go(dir)}
      disabled={disabled}
      aria-label={dir < 0 ? "前のカード" : "次のカード"}
      className={`absolute top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-ienazo-rule bg-ienazo-paper/80 text-ienazo-ink-soft shadow-sm backdrop-blur-sm transition-opacity hover:text-ienazo-ink disabled:pointer-events-none disabled:opacity-0 ${dir < 0 ? "left-1.5" : "right-1.5"}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
        {dir < 0 ? <path d="M15 5 L8 12 L15 19" /> : <path d="M9 5 L16 12 L9 19" />}
      </svg>
    </button>
  );

  return (
    <div>
      {/* スマホ：スワイプ＋左右矢印 */}
      <div className="relative sm:hidden">
        <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {items.map((c, idx) => (
              <div key={idx} className="w-full shrink-0" aria-hidden={idx !== i}>
                {c}
              </div>
            ))}
          </div>
        </div>
        <Arrow dir={-1} disabled={i === 0} />
        <Arrow dir={1} disabled={i === n - 1} />
      </div>

      {/* PC：3列グリッド */}
      <div className="hidden sm:grid sm:grid-cols-3 sm:gap-7">{items}</div>
    </div>
  );
}
