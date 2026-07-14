"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

// 復旧リンク着地後の新パスワード設定。
// コールバックが verifyOtp(type=recovery) で一時的な復旧セッションを張った状態で開かれる想定。
// セッションが無い（リンク無効・期限切れ・直接アクセス）場合は再送導線を出す。
export function ResetForm() {
  const router = useRouter();
  const [gate, setGate] = useState<"checking" | "ok" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabaseReady) {
      setGate("invalid");
      return;
    }
    const supabase = createClient();
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setGate(data.session ? "ok" : "invalid");
    });
    // 着地直後は PASSWORD_RECOVERY / SIGNED_IN 遅れてセッションが入ることがある。
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setGate("ok");
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("パスワードは6文字以上にしてください。");
      return;
    }
    if (password !== confirm) {
      setError("確認用パスワードが一致しません。");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // 更新成功＝そのままログイン状態。ライブラリへ。
    router.push("/ienazo/account/library");
    router.refresh();
  }

  if (gate === "checking") {
    return (
      <div className="mt-8 rounded border border-ienazo-rule bg-ienazo-paper-soft px-5 py-8 text-center">
        <p className="text-sm text-ienazo-ink-soft">確認中…</p>
      </div>
    );
  }

  if (gate === "invalid") {
    return (
      <div className="mt-8 rounded border border-ienazo-rule bg-ienazo-paper-soft px-5 py-8 text-center">
        <p className="text-sm leading-relaxed text-ienazo-ink-soft">
          リンクが無効か、有効期限が切れています。
          <br />
          お手数ですが、もう一度お試しください。
        </p>
        <Link
          href="/ienazo/account/forgot"
          className="mt-6 inline-flex items-center justify-center bg-ienazo-red px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
        >
          再設定リンクを送り直す
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label className="block text-xs font-bold tracking-wide text-ienazo-ink-soft">新しいパスワード（6文字以上）</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1.5 w-full border border-ienazo-rule bg-ienazo-paper-soft px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-bold tracking-wide text-ienazo-ink-soft">新しいパスワード（確認）</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {loading ? "更新中…" : "パスワードを更新する"}
      </button>
    </form>
  );
}
