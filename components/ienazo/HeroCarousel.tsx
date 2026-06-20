"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = {
  src: string;
  alt?: string;
};

const INTERVAL_MS = 5000;

/**
 * ヒーローのフルブリード切替カルーセル。
 * - クロスフェード＋アクティブ画像のゆっくりズーム(Ken Burns)
 * - 自動送り。hover/フォーカス中は一時停止
 * - prefers-reduced-motion では自動送り・ズームを無効化
 * - children をビジュアルの上に重ねる（中央のプレート等）
 */
export function HeroCarousel({
  slides,
  children,
}: {
  slides: HeroSlide[];
  children?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || reduced.current || slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <section
      aria-roledescription="カルーセル"
      aria-label="作品ビジュアル"
      className="relative w-full overflow-hidden border-y border-ienazo-rule bg-ienazo-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* 切替ビジュアル */}
      <div className="relative h-[64vh] min-h-[440px] w-full sm:h-[78vh]">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
                active ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={active ? slide.alt ?? "" : ""}
                className={`h-full w-full object-cover ${active ? "ienazo-kenburns" : ""}`}
                draggable={false}
              />
            </div>
          );
        })}

        {/* 文字可読性のためのごく薄いスクリム */}
        <div className="pointer-events-none absolute inset-0 bg-ienazo-ink/15" />

        {/* オーバーレイ（中央プレート等） */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          {children}
        </div>

        {/* インジケータ（ギャラリーの四角い目印） */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1}番目のビジュアルを表示`}
              aria-current={i === index}
              className={`h-2.5 w-2.5 border border-white/80 transition-colors ${
                i === index ? "bg-white" : "bg-transparent hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
