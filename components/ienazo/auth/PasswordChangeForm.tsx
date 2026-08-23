"use client";

// ログイン中にパスワードを変える／初めて設定する。
//
// 2通りある理由：Google だけで登録した人はパスワードを持っていない。
// その人には「現在のパスワード」を訊けないので、確認欄を出さずに「設定」させる。
// パスワードを持っている人には現在のものを確認する。共用のパソコンで席を外した隙に
// 変えられるのを防ぐため（Supabase 自体は現在のパスワードを要求しない）。
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

const FIELD =
  "mt-1.5 w-full border border-ienazo-rule bg-ienazo-paper-soft px-3 py-2.5 text-base sm:text-sm";
const LABEL = "block text-xs font-bold tracking-wide text-ienazo-ink-soft";

export function PasswordChangeForm() {
  // null＝まだ分からない。true＝パスワードあり（変更）／false＝なし（新規設定）。
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    if (!supabaseReady) return;
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUserIdentities();
    if (error) {
      // 判別できないときは安全側＝現在のパスワードを訊く。
      setHasPassword(true);
      return;
    }
    setHasPassword((data?.identities ?? []).some((i) => i.provider === "email"));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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

    setCurrent("");
    setNext("");
    setConfirm("");
    setDone(true);
    setHasPassword(true);
    void load();
  }

  const title = hasPassword === false ? "パスワードを設定" : "パスワードを変更";

  return (
    <section className="border border-ienazo-rule bg-ienazo-paper-soft">
      <h2 className="flex items-center gap-3 px-5 py-3.5 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
        <span className="inline-block h-2 w-2 bg-ienazo-ink" aria-hidden />
        パスワード
      </h2>

      <div className="border-t border-ienazo-rule px-5 py-5">
        {hasPassword === null ? (
          <p className="text-xs text-ienazo-ink-soft">読み込み中…</p>
        ) : (
          <>
            {hasPassword === false && (
              <p className="mb-4 text-sm leading-relaxed text-ienazo-ink-soft">
                いまはソーシャルログインだけでご利用中です。パスワードを設定すると、
                メールアドレスとパスワードでもログインできるようになります。
              </p>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
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

              {done && (
                <p className="border border-ienazo-rule bg-ienazo-paper-deep px-3 py-2 text-xs text-ienazo-ink">
                  パスワードを変更しました。
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !supabaseReady}
                className="inline-flex min-h-[44px] w-full items-center justify-center bg-ienazo-red px-5 py-2.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep disabled:opacity-60 sm:w-auto"
              >
                {loading ? "変更中…" : title}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
