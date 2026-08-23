"use client";

// アカウント設定の「パスワード」行。
//
// 既定は閉じている。設定画面を開いた時点で入力欄が並んでいると、何を変えに来たのか
// 分からないまま編集画面に立たされる。いまの状態を見せて、変えたい人だけ開く。
//
// 変更と新規設定の2通りがある。Google だけで登録した人はパスワードを持たないので
// 「現在のパスワード」を訊けない。持っている人には確認する。共用のパソコンで席を
// 外した隙に変えられるのを防ぐため（Supabase 自体は現在のパスワードを要求しない）。
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

const FIELD =
  "mt-1.5 w-full border border-ienazo-rule bg-ienazo-paper-soft px-3 py-2.5 text-base sm:text-sm";
const LABEL = "block text-xs font-bold tracking-wide text-ienazo-ink-soft";
const ROW_ACTION =
  "h-11 border border-ienazo-rule px-4 text-xs font-bold tracking-wide transition-colors hover:border-ienazo-ink disabled:opacity-60";

export function PasswordChangeForm() {
  // null＝まだ分からない。true＝パスワードあり（変更）／false＝なし（新規設定）。
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    if (!supabaseReady) return;
    const supabase = createClient();
    const { data, error: loadError } = await supabase.auth.getUserIdentities();
    if (loadError) {
      // 判別できないときは安全側＝現在のパスワードを訊く。
      setHasPassword(true);
      return;
    }
    setHasPassword((data?.identities ?? []).some((i) => i.provider === "email"));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function close() {
    setOpen(false);
    setCurrent("");
    setNext("");
    setConfirm("");
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);

    if (next.length < 6) {
      setError("パスワードは6文字以上にしてください。");
      return;
    }
    if (next !== confirm) {
      setError("確認用パスワードが一致しません。");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // 現在のパスワードの確認。間違っていてもいまのセッションは切れない。
    if (hasPassword) {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email;
      if (!email) {
        setLoading(false);
        setError("メールアドレスが登録されていないため、この方法では変更できません。");
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (signInError) {
        setLoading(false);
        setError("現在のパスワードが正しくありません。");
        return;
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setLoading(false);
    if (updateError) {
      setError("パスワードを変更できませんでした。時間をおいて再度お試しください。");
      return;
    }

    close();
    setDone(true);
    setHasPassword(true);
    void load();
  }

  const status =
    hasPassword === null ? "確認中…" : hasPassword ? "設定済み" : "未設定（ソーシャルログインのみ）";
  const actionLabel = hasPassword === false ? "設定する" : "変更";

  return (
    <div className="border-t border-ienazo-rule">
      <div className="flex items-center gap-4 px-5 py-3.5">
        <span className="flex w-5 shrink-0 items-center justify-center text-ienazo-ink-soft">
          <LockMark />
        </span>
        <span className="flex min-w-0 flex-grow flex-col gap-0.5">
          <span className="text-sm font-bold">パスワード</span>
          <span className="truncate text-xs text-ienazo-ink-soft">{status}</span>
        </span>
        <span className="shrink-0 text-right">
          {open ? (
            <button type="button" onClick={close} className={ROW_ACTION}>
              やめる
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDone(false);
                setOpen(true);
              }}
              disabled={hasPassword === null || !supabaseReady}
              className={ROW_ACTION}
            >
              {actionLabel}
            </button>
          )}
        </span>
      </div>

      {done && !open && (
        <p className="border-t border-ienazo-rule bg-ienazo-paper-deep px-5 py-3 text-xs text-ienazo-ink">
          パスワードを変更しました。
        </p>
      )}

      {open && (
        <form onSubmit={onSubmit} className="space-y-4 border-t border-ienazo-line px-5 py-5">
          {hasPassword === false && (
            <p className="text-sm leading-relaxed text-ienazo-ink-soft">
              パスワードを設定すると、メールアドレスとパスワードでもログインできるようになります。
            </p>
          )}

          {hasPassword && (
            <div>
              <label className={LABEL} htmlFor="pw-current">
                現在のパスワード
              </label>
              <input
                id="pw-current"
                type="password"
                required
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className={FIELD}
              />
            </div>
          )}

          <div>
            <label className={LABEL} htmlFor="pw-next">
              新しいパスワード（6文字以上）
            </label>
            <input
              id="pw-next"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL} htmlFor="pw-confirm">
              新しいパスワード（確認）
            </label>
            <input
              id="pw-confirm"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={FIELD}
            />
          </div>

          {error && (
            <p className="border border-ienazo-red/40 bg-ienazo-red/5 px-3 py-2 text-xs text-ienazo-red">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[44px] items-center justify-center bg-ienazo-red px-5 py-2.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep disabled:opacity-60"
            >
              {loading ? "変更中…" : hasPassword === false ? "設定する" : "変更する"}
            </button>
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-[44px] items-center justify-center border border-ienazo-rule px-5 py-2.5 text-sm font-medium tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-paper-deep"
            >
              やめる
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/** 鍵。ProviderMarks と線幅・サイズを揃える。 */
function LockMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      aria-hidden
      role="img"
    >
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
