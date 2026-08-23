"use client";

// 登録メールアドレスの変更。
//
// すぐには変わらない。新しいアドレス宛に確認リンクが飛び、それを開いて初めて確定する。
// Supabase の設定によっては旧アドレスにも通知が行く（乗っ取り対策）。
// そのため「送りました」で終わらせず、まだ変わっていないことを画面で断言する。
import { useState } from "react";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady, SITE_URL } from "@/lib/ienazo/config";

const FIELD =
  "mt-1.5 w-full border border-ienazo-rule bg-ienazo-paper-soft px-3 py-2.5 text-base sm:text-sm";
const LABEL = "block text-xs font-bold tracking-wide text-ienazo-ink-soft";

export function EmailChangeForm({ currentEmail }: { currentEmail: string | null }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSentTo(null);

    const wanted = email.trim();
    if (wanted && currentEmail && wanted.toLowerCase() === currentEmail.toLowerCase()) {
      setError("いまと同じメールアドレスです。");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser(
      { email: wanted },
      {
        emailRedirectTo: `${SITE_URL}/ienazo/account/callback?next=${encodeURIComponent(
          "/ienazo/account/settings",
        )}`,
      },
    );
    setLoading(false);

    if (updateError) {
      // Supabase の生メッセージは英語なので出さない。
      setError("変更を受け付けられませんでした。すでに使われているアドレスかもしれません。");
      return;
    }
    setSentTo(wanted);
    setEmail("");
  }

  return (
    <section className="border border-ienazo-rule bg-ienazo-paper-soft">
      <h2 className="flex items-center gap-3 px-5 py-3.5 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
        <span className="inline-block h-2 w-2 bg-ienazo-ink" aria-hidden />
        メールアドレス
      </h2>

      <div className="border-t border-ienazo-rule px-5 py-5">
        <p className="text-sm text-ienazo-ink-soft">
          いまの登録：
          <span className="ml-1 break-all font-bold text-ienazo-ink">
            {currentEmail ?? "未登録"}
          </span>
        </p>

        {sentTo ? (
          <div className="mt-4 border border-ienazo-rule bg-ienazo-paper-deep px-4 py-4">
            <p className="text-sm leading-relaxed text-ienazo-ink">
              <span className="break-all font-bold">{sentTo}</span> 宛に確認メールを送りました。
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ienazo-ink-soft">
              メール内のリンクを開くまで、登録アドレスは変わりません。
              <br />
              リンクを開くと、この画面に戻ってきます。
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className={LABEL} htmlFor="email-next">
                新しいメールアドレス
              </label>
              <input
                id="email-next"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={FIELD}
              />
            </div>

            {error && (
              <p className="border border-ienazo-red/40 bg-ienazo-red/5 px-3 py-2 text-xs text-ienazo-red">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !supabaseReady}
              className="inline-flex min-h-[44px] w-full items-center justify-center border border-ienazo-rule bg-ienazo-paper-soft px-5 py-2.5 text-sm font-bold tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper disabled:opacity-60 sm:w-auto"
            >
              {loading ? "送信中…" : "確認メールを送る"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
