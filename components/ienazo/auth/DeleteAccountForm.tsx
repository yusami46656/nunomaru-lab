"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

// アカウント削除の確認ページ本体。ログイン中のみ実行可能。
// 実削除はサーバー(/api/ienazo/account/delete)が本人セッションを検証して行う。
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

export function DeleteAccountForm() {
  const router = useRouter();
  const [gate, setGate] = useState<"checking" | "authed" | "guest">("checking");
  const [ack, setAck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseReady) {
      setGate("guest");
      return;
    }
    const supabase = createClient();
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setGate(data.session ? "authed" : "guest");
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setGate(session ? "authed" : "guest");
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

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

  if (gate === "checking") {
    return <p className="mt-8 text-sm text-ienazo-ink-soft">確認中…</p>;
  }

  if (gate === "guest") {
    return (
      <div className="mt-8 rounded border border-ienazo-rule bg-ienazo-paper-soft px-5 py-8 text-center">
        <p className="text-sm leading-relaxed text-ienazo-ink-soft">
          この操作にはログインが必要です。
        </p>
        <Link
          href="/ienazo/account/login?next=/ienazo/account/delete"
          className="mt-6 inline-flex items-center justify-center border border-ienazo-rule px-6 py-3 text-sm font-bold tracking-wide transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper"
        >
          ログイン
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="rounded border border-ienazo-red/40 bg-ienazo-red/5 px-5 py-5">
        <p className="text-sm font-bold text-ienazo-ink">この操作は取り消せません。</p>
        <p className="mt-2 text-sm leading-relaxed text-ienazo-ink-soft">
          購入した作品へのアクセス・プレイ進捗を含め、すべてのデータが削除されます。
          購入の返金はありません。
        </p>
      </div>

      <label className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-ienazo-ink">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
          className="mt-1 shrink-0"
        />
        <span>上記を理解し、アカウントとすべてのデータの削除に同意します。</span>
      </label>

      {error && <p className="mt-4 text-sm text-ienazo-red">＊ {error}</p>}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onDelete}
          disabled={!ack || loading}
          className="inline-flex items-center justify-center bg-ienazo-red px-6 py-3 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep disabled:opacity-50"
        >
          {loading ? "削除中…" : "完全に削除する"}
        </button>
        <Link
          href="/ienazo/account/library"
          className="inline-flex items-center justify-center border border-ienazo-rule px-6 py-3 font-medium tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-paper-deep"
        >
          キャンセル
        </Link>
      </div>
    </div>
  );
}
