"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/ienazo/account/library";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("メールアドレスかパスワードが正しくありません。");
      return;
    }
    router.push(next);
    router.refresh();
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
        <div>
          <label className="block text-xs font-bold tracking-wide text-ienazo-ink-soft">パスワード</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
          {loading ? "ログイン中…" : "ログイン"}
        </button>
      </form>

      {!supabaseReady && (
        <p className="mt-4 rounded border border-ienazo-line bg-ienazo-paper-deep px-3 py-2 text-xs text-ienazo-ink-soft">
          ＊ 認証機能は準備中です。
        </p>
      )}

      <p className="mt-6 text-sm text-ienazo-ink-soft">
        はじめての方は{" "}
        <Link href="/ienazo/account/register" className="font-medium text-ienazo-ink hover:text-ienazo-red">
          会員登録
        </Link>
      </p>
    </>
  );
}
