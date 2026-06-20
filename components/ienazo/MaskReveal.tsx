"use client";

import { useEffect, useRef, useState } from "react";

/**
 * マスク・ワイプ出現：下の隠れた行から文字がせり上がってくる演出。
 * 大きな見出し/番号を視覚的に遊ばせるのに使う。
 * 監視は「動かない外側の枠」に対して行う（内側はアニメで動くため監視に不向き）。
 * prefers-reduced-motion では即表示。
 */
export function MaskReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={wrapRef} className={`block overflow-hidden ${className}`}>
      <span
        className={`block transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          shown ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}
