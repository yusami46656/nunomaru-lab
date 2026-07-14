"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 有料作品の購入ボタン。クリック時に Checkout セッションを作って Stripe へ遷移する。
// 未ログイン（401）なら戻り先を作品ページにしてログインへ送る。
export function BuyButton({ slug, label = "購入する" }: { slug: string; label?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function buy() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ienazo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.status === 401) {
        router.push(`/ienazo/account/login?next=/ienazo/works/${slug}`);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "購入手続きを開始できませんでした。");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("決済ページのURLを取得できませんでした。");
      }
    } catch {
      setError("通信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className="inline-flex min-w-[11rem] items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep disabled:opacity-60"
      >
        {loading ? "手続き中…" : label}
      </button>
      {error && <p className="text-xs text-ienazo-ink-soft">＊ {error}</p>}
    </div>
  );
}
