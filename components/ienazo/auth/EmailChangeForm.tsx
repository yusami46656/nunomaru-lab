"use client";

// アカウント設定の「メールアドレス」行。
//
// 既定は閉じている。いまの登録アドレスを見せて、変えたい人だけ開く。
//
// すぐには変わらない。新しいアドレス宛に確認リンクが飛び、それを開いて初めて確定する。
// Supabase の設定によっては旧アドレスにも通知が行く（乗っ取り対策）。
// そのため「送りました」で終わらせず、まだ変わっていないことを画面で断言する。
import { useState } from "react";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady, SITE_URL } from "@/lib/ienazo/config";
import { MailMark } from "@/components/ienazo/auth/ProviderMarks";

const FIELD =
  "mt-1.5 w-full border border-ienazo-rule bg-ienazo-paper-soft px-3 py-2.5 text-base sm:text-sm";
const LABEL = "block text-xs font-bold tracking-wide text-ienazo-ink-soft";
const ROW_ACTION =
  "h-11 border border-ienazo-rule px-4 text-xs font-bold tracking-wide transition-colors hover:border-ienazo-ink disabled:opacity-60";

export function EmailChangeForm({ currentEmail }: { currentEmail: string | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setEmail("");
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
    close();
    setSentTo(wanted);
  }

  return (
    <div className="border-t border-ienazo-rule">
      <div className="flex items-center gap-4 px-5 py-3.5">
        <span className="flex w-5 shrink-0 items-center justify-center text-ienazo-ink-soft">
          <MailMark />
        </span>
        <span className="flex min-w-0 flex-grow flex-col gap-0.5">
          <span className="text-sm font-bold">メールアドレス</span>
          <span className="truncate text-xs text-ienazo-ink-soft">{currentEmail ?? "未登録"}</span>
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
                setSentTo(null);
                setOpen(true);
              }}
              disabled={!supabaseReady}
              className={ROW_ACTION}
            >
              変更
            </button>
          )}
        </span>
      </div>

      {sentTo && !open && (
        <div className="border-t border-ienazo-rule bg-ienazo-paper-deep px-5 py-4">
          <p className="text-sm leading-relaxed text-ienazo-ink">
            <span className="break-all font-bold">{sentTo}</span> 宛に確認メールを送りました。
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ienazo-ink-soft">
            メール内のリンクを開くまで、登録アドレスは変わりません。
            <br />
            いまご登録のアドレスにも確認が届くことがあります。両方に届いた場合は、どちらのリンクも開いてください。
          </p>
        </div>
      )}

      {open && (
        <form onSubmit={onSubmit} className="ienazo-rise space-y-4 border-t border-ienazo-line px-5 py-5">
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
            <p className="mt-2 text-xs leading-relaxed text-ienazo-ink-soft">
              新しいアドレス宛に確認メールを送ります。リンクを開くまで登録は変わりません。
            </p>
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
              {loading ? "送信中…" : "確認メールを送る"}
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
