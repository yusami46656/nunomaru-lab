"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

/**
 * ログアウト。置き場所によって見た目を変える。
 *   link   … 従来の小さなテキストリンク（既定。既存の呼び出しはこのまま）
 *   nav    … フッターのリンク列に並べる
 *   button … アカウント帯に置く枠ボタン。指で押せるよう高さ 44px を確保する
 */
export type LogoutVariant = "link" | "nav" | "button";

const VARIANT_CLASS: Record<LogoutVariant, string> = {
  link: "text-xs font-bold tracking-wide text-ienazo-ink-soft underline-offset-4 hover:text-ienazo-red hover:underline disabled:opacity-60",
  nav: "text-left text-sm text-ienazo-ink transition-colors hover:text-ienazo-red disabled:opacity-60",
  button:
    "inline-flex w-full min-h-[44px] items-center justify-center border border-ienazo-rule bg-ienazo-paper-soft px-5 py-2.5 text-sm font-bold tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper disabled:opacity-60 sm:w-auto",
};

export function LogoutButton({ variant = "link" }: { variant?: LogoutVariant }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!supabaseReady) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/ienazo");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={VARIANT_CLASS[variant]}
    >
      {loading ? "ログアウト中…" : "ログアウト"}
    </button>
  );
}
