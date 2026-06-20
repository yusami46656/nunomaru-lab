"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

/**
 * スクロールで視界に入ったらフェードアップする薄いラッパー。
 * staggered にしたい場合は delay(ms) を渡す。
 * 高級感のため、ゆっくり(0.85s)＋上質なイージング(0.22,1,0.36,1)で統一。
 * prefers-reduced-motion では即表示（動かさない）。
 */
// 全要素で共有する“静かな”イージング。MaskReveal / scrollcue と揃える。
export const IENAZO_EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number; // ms。stagger 用
  className?: string;
  as?: keyof typeof motion;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as React.ComponentType<HTMLMotionProps<"div">>;

  if (reduced) {
    const Tag = as as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, ease: IENAZO_EASE, delay: delay / 1000 }}
    >
      {children}
    </MotionTag>
  );
}
