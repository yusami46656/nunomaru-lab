"use client";

import { useState } from "react";
import { ENGINE_BASE_URL } from "@/lib/ienazo/config";

type Props = {
  slug: string;
  /** "free" = トークンなしで直接起動 / "owned" = 所有検証→短命チケットで起動 */
  mode: "free" | "owned";
  /** ボタン表記（既定「プレイを開始する」） */
  label?: string;
};

export function PlayLauncher({ slug, mode, label = "プレイを開始する" }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function launchFree() {
    if (!ENGINE_BASE_URL) {
      setError("プレイエンジンは準備中です（別タブで起動予定）。");
      return;
    }
    // クリア画面の戻る導線用に、この作品の紹介ページを戻り先として渡す。
    const ret = encodeURIComponent(`${window.location.origin}/ienazo/works/${slug}`);
    window.open(`${ENGINE_BASE_URL}/${slug}?return=${ret}`, "_blank", "noopener");
  }

  async function launchOwned() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ienazo/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "起動に失敗しました。");
        return;
      }
      if (!data.ready || !data.url) {
        setError("プレイエンジンは準備中です（チケットは発行できています）。");
        return;
      }
      window.open(data.url, "_blank", "noopener");
    } catch {
      setError("通信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={mode === "free" ? launchFree : launchOwned}
        disabled={loading}
        className="inline-flex items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep disabled:opacity-60"
      >
        {loading ? "起動中…" : label}
      </button>
      {error && <p className="mt-5 text-xs text-ienazo-ink-soft">＊ {error}</p>}
    </div>
  );
}
