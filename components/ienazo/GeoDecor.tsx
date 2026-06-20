"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 装飾用：正方形・長方形を大胆に重ねた幾何クラスター。
 * セクションの縁からはみ出させ、構成主義ポスター風のリズムを生む。
 * 視界に入った瞬間に、一部の四角が一度だけスプリング回転（B：常時回転はやめる）。
 * pointer-events-none / aria-hidden。reduced-motion で回転停止。
 * tone: "dark"=明地向け（インク＋赤）／"light"=暗地(赤バンド)向け（白）。
 * ※鍵穴モチーフは既に随所にあるため、装飾は抽象的な四角で（しつこさ回避）。
 *   不要なら GeoDecor の使用箇所を削除すれば元に戻る。
 */
export function GeoDecor({
  variant = "a",
  tone = "dark",
  className = "",
}: {
  variant?: "a" | "b" | "c";
  tone?: "dark" | "light";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const line = tone === "light" ? "border-white/55" : "border-ienazo-rule";
  const lineSoft = tone === "light" ? "border-white/30" : "border-ienazo-line";
  const red = tone === "light" ? "bg-white/90" : "bg-ienazo-red";
  const ink = tone === "light" ? "bg-white/15" : "bg-ienazo-ink";
  const turn = shown ? "ienazo-spin-once" : "";

  return (
    <div ref={ref} className={`pointer-events-none absolute ${className}`} aria-hidden>
      {variant === "a" && (
        <div className="relative h-72 w-64">
          {/* 大きな輪郭の長方形 */}
          <span className={`absolute inset-0 border-2 ${line}`} />
          {/* 赤(白)の大きな塗り四角・コーナーに重ねる（出現時に一度回る） */}
          <span className={`${turn} absolute -bottom-10 -right-10 h-28 w-28 ${red}`} />
          {/* 中くらいの輪郭の正方形・左に重ねる（出現時に一度回る） */}
          <span className={`${turn} absolute -left-12 top-10 h-28 w-28 border-2 ${lineSoft}`} />
          {/* 小さなインク塗り四角 */}
          <span className={`absolute bottom-10 left-10 h-12 w-12 ${ink}`} />
        </div>
      )}
      {variant === "b" && (
        <div className="relative h-72 w-80">
          {/* 横長と縦長を大きく重ねる */}
          <span className={`absolute left-0 top-6 h-44 w-64 border-2 ${line}`} />
          <span className={`absolute right-2 top-0 h-72 w-28 border-2 ${lineSoft}`} />
          {/* 赤(白)の塗り四角を交点に（出現時に一度回る） */}
          <span className={`${turn} absolute left-16 top-16 h-20 w-20 ${red}`} />
          {/* 小さなインク四角（出現時に一度回る） */}
          <span className={`${turn} absolute -bottom-5 left-6 h-10 w-10 ${ink}`} />
        </div>
      )}
      {variant === "c" && (
        <div className="relative h-64 w-64">
          {/* ずらし重ねの大きな正方形3枚 */}
          <span className={`absolute left-0 top-0 h-40 w-40 border-2 ${lineSoft}`} />
          <span className={`${turn} absolute left-7 top-7 h-40 w-40 border-2 ${line}`} />
          <span className={`absolute left-14 top-14 h-40 w-40 border-2 ${lineSoft}`} />
          {/* 赤(白)の塗り四角（出現時に一度回る） */}
          <span className={`${turn} absolute -bottom-6 right-2 h-16 w-16 ${red}`} />
        </div>
      )}
    </div>
  );
}
