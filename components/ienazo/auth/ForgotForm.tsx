"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady, SITE_URL } from "@/lib/ienazo/config";

// パスワード再設定の入口。メール宛に復旧リンクを送る。
// 成否は明かさない（登録の有無を外部に開示しない＝メール列挙対策）。
export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabaseReady) {
      setError("認証機能は準備中です。");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    // 復旧リンクはコールバック経由で /reset へ。エラーでも同じ完了表示にする（列挙対策）。
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/ienazo/account/callback?next=${encodeURIComponent("/ienazo/account/reset")}`,
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-8 rounded border border-ienazo-rule bg-ienazo-paper-soft px-5 py-8 text-center">
        <p className="text-sm leading-relaxed text-ienazo-ink-soft">
          <span className="font-bold text-ienazo-ink">{email}</span> 宛に
          <br />
          パスワード再設定用のリンクを送りました（登録がある場合）。
          <br />
          メール内のリンクを開いて、新しいパスワードを設定してください。
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-xs font-bold tracking-wide text-ienazo-ink-soft">メールアドレス</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full border border-ienazo-rule bg-ienazo-paper-soft px-3 py-2.5 text-sm"
          />
        </div>

        {error && (
          <p className="rounded border border-ienazo-red/40 bg-ienazo-red/5 px-3 py-2 text-xs text-ienazo-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ienazo-red px-6 py-3.5 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep disabled:opacity-60"
        >
          {loading ? "送信中…" : "再設定リンクを送る"}
        </button>
      </form>

      {!supabaseReady && (
        <p className="mt-4 rounded border border-ienazo-line bg-ienazo-paper-deep px-3 py-2 text-xs text-ienazo-ink-soft">
          ＊ 認証機能は準備中です。
        </p>
      )}

      <p className="mt-6 text-sm text-ienazo-ink-soft">
        パスワードを思い出した方は{" "}
        <Link href="/ienazo/account/login" className="font-medium text-ienazo-ink hover:text-ienazo-red">
          ログイン
        </Link>
      </p>
    </>
  );
}
