"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

// アカウント削除。二段階（確認を開く→理解チェック→実行）にして誤操作を防ぐ。
// 実削除はサーバー(/api/ienazo/account/delete)で本人セッションを検証して行う。
function messageFor(code?: string): string {
  switch (code) {
    case "unauthorized":
      return "ログインが切れています。再度ログインしてお試しください。";
    case "not_configured":
      return "アカウント削除は現在利用できません。";
    default:
      return "削除に失敗しました。時間をおいて再度お試しください。";
  }
}

export function DeleteAccountButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ack, setAck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ienazo/account/delete", { method: "POST" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(messageFor(d?.error));
        setLoading(false);
        return;
      }
      // セッション破棄（Cookie掃除）してトップへ。ユーザーは既に削除済みなので失敗は無視。
      if (supabaseReady) {
        try {
          await createClient().auth.signOut();
        } catch {
          /* noop */
        }
      }
      router.push("/ienazo");
      router.refresh();
    } catch {
      setError("通信に失敗しました。時間をおいて再度お試しください。");
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-ienazo-ink hover:text-ienazo-red"
      >
        アカウント削除
      </button>
    );
  }

  return (
    <div className="rounded border border-ienazo-red/40 bg-ienazo-red/5 px-4 py-4">
      <p className="text-sm font-bold text-ienazo-ink">アカウントを削除しますか？</p>
      <p className="mt-2 text-xs leading-relaxed text-ienazo-ink-soft">
        購入した作品へのアクセス・プレイ進捗を含め、すべてのデータが削除され、
        <span className="font-bold text-ienazo-ink">元に戻せません</span>。
        購入の返金はありません。
      </p>

      <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ienazo-ink">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
          className="mt-0.5 shrink-0"
        />
        <span>上記を理解し、アカウントとすべてのデータの削除に同意します。</span>
      </label>

      {error && <p className="mt-3 text-xs text-ienazo-red">＊ {error}</p>}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onDelete}
          disabled={!ack || loading}
          className="inline-flex items-center justify-center bg-ienazo-red px-5 py-2.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep disabled:opacity-50"
        >
          {loading ? "削除中…" : "完全に削除する"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setAck(false);
            setError(null);
          }}
          disabled={loading}
          className="inline-flex items-center justify-center border border-ienazo-rule px-5 py-2.5 text-sm font-medium tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-paper-deep disabled:opacity-50"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
