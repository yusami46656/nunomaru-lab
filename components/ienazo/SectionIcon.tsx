"use client";

import { useState } from "react";
import { KeyholeIcon } from "./KeyholeIcon";

/**
 * セクション用ピクトグラム表示。
 * Codex生成PNG（public/ienazo/icons/）を表示し、未配置（404）の間は onError でフォールバック。
 * - fallback="keyhole"：鍵穴アイコン（ABOUT用。配置前も現状の見た目を保つ）
 * - fallback="none"   ：何も出さない（遊び方STEP用。配置前は番号のみ）
 * 装飾画像のため alt は空。配置されれば自動で差し替わる（フラグ操作不要）。
 */
export function SectionIcon({
  src,
  className,
  fallback = "keyhole",
}: {
  src: string;
  className?: string;
  fallback?: "keyhole" | "none";
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return fallback === "keyhole" ? <KeyholeIcon className={className} /> : null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
