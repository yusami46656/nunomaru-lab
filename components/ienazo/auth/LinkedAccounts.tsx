"use client";

// マイページの「ログイン方法」。連携の追加と解除をここで完結させる。
//
// これがある理由：購入した作品は user_id に紐付いている。メールで買った人が別ルートで
// ログインして新しいユーザーができてしまうと「買ったのに読めない」事故になる。
// メールが一致すれば Supabase が自動で同じユーザーに束ねるが、メールを返さない
// プロバイダ（LINE のメール権限が未申請のとき等）では自動ではつながらない。
// その取りこぼしを本人の手で救えるようにするのがこの画面。
import { useCallback, useEffect, useState } from "react";
import type { UserIdentity } from "@supabase/supabase-js";
import { createClient } from "@/lib/ienazo/supabase/client";
import {
  OAUTH_PROVIDERS,
  SUPABASE_PROVIDER,
  SITE_URL,
  type OAuthProviderId,
} from "@/lib/ienazo/config";
import {
  GoogleMark,
  LineBadge,
  XMark,
  MailMark,
} from "@/components/ienazo/auth/ProviderMarks";

const NAME: Record<OAuthProviderId, string> = {
  google: "Google",
  line: "LINE",
  twitter: "X",
};

function Mark({ id }: { id: OAuthProviderId }) {
  if (id === "google") return <GoogleMark size={20} />;
  if (id === "line") return <LineBadge size={20} />;
  return <XMark size={18} color="#181818" />;
}

/** identity.provider は "google" / "custom:line" のどちらの綴りで返るか環境差があるので両方見る。 */
function matches(identity: UserIdentity, id: OAuthProviderId) {
  const want = SUPABASE_PROVIDER[id];
  return identity.provider === want || identity.provider === want.replace(/^custom:/, "");
}

/**
 * variant
 *   section … 見出し付きの独立パネル（従来）
 *   rows    … 行だけ返す。アカウント設定の一覧に混ぜて並べるとき。
 *             メールアドレスの行は設定側が持つので出さない。
 */
export function LinkedAccounts({
  email,
  variant = "section",
}: {
  email: string | null;
  variant?: "section" | "rows";
}) {
  const [identities, setIdentities] = useState<UserIdentity[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUserIdentities();
    if (error) {
      setError("ログイン方法を読み込めませんでした。");
      setIdentities([]);
      return;
    }
    setIdentities(data?.identities ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (OAUTH_PROVIDERS.length === 0) return null;

  // 解除できるのは2つ以上あるときだけ。1つしかないと最後のログイン手段を失うため
  // Supabase 側でも拒否される。ボタンを出さないことでその拒否に触れさせない。
  const canUnlink = (identities?.length ?? 0) >= 2;

  async function link(id: OAuthProviderId) {
    setError(null);
    setBusy(id);
    const supabase = createClient();
    const { error } = await supabase.auth.linkIdentity({
      provider: SUPABASE_PROVIDER[id] as never,
      options: {
        redirectTo: `${SITE_URL}/ienazo/account/callback?next=${encodeURIComponent(
          "/ienazo/account/library",
        )}`,
      },
    });
    if (error) {
      setBusy(null);
      setError("連携できませんでした。すでに他のアカウントで使われている可能性があります。");
    }
  }

  async function unlink(identity: UserIdentity) {
    setError(null);
    setBusy(identity.identity_id);
    const supabase = createClient();
    const { error } = await supabase.auth.unlinkIdentity(identity);
    setBusy(null);
    if (error) {
      setError("解除できませんでした。");
      return;
    }
    await load();
  }

  const rows = (
    <>
      {/* 独立パネルのときだけ、メールを登録状態として並べる（解除はさせない）。 */}
      {variant === "section" && (
        <Row
          mark={<MailMark />}
          name="メールアドレス"
          sub={email ?? "未登録"}
          action={<span className="text-xs text-ienazo-ink-soft">—</span>}
        />
      )}

      {identities === null ? (
        <p className="border-t border-ienazo-rule px-5 py-4 text-xs text-ienazo-ink-soft">
          読み込み中…
        </p>
      ) : (
        OAUTH_PROVIDERS.map((id) => {
          const identity = identities.find((i) => matches(i, id));
          return (
            <Row
              key={id}
              mark={<Mark id={id} />}
              name={NAME[id]}
              sub={identity ? "連携済み" : "未連携"}
              action={
                identity ? (
                  canUnlink ? (
                    <button
                      type="button"
                      onClick={() => unlink(identity)}
                      disabled={busy !== null}
                      className="h-11 border border-ienazo-rule px-4 text-xs text-ienazo-ink-soft transition-colors hover:border-ienazo-ink hover:text-ienazo-ink disabled:opacity-60"
                    >
                      {busy === identity.identity_id ? "解除中…" : "解除"}
                    </button>
                  ) : (
                    <span className="text-xs text-ienazo-ink-soft">唯一のログイン方法</span>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => link(id)}
                    disabled={busy !== null}
                    className="h-11 border border-ienazo-rule bg-ienazo-paper-soft px-4 text-xs font-bold tracking-wide transition-colors hover:border-ienazo-ink disabled:opacity-60"
                  >
                    {busy === id ? "接続中…" : "連携する"}
                  </button>
                )
              }
            />
          );
        })
      )}

      {error && (
        <p className="border-t border-ienazo-rule bg-ienazo-red/5 px-5 py-3 text-xs text-ienazo-red">
          {error}
        </p>
      )}
    </>
  );

  if (variant === "rows") return rows;

  return (
    <section className="border border-ienazo-rule bg-ienazo-paper-soft">
      <h2 className="flex items-center gap-3 px-5 py-3.5 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
        <span className="inline-block h-2 w-2 bg-ienazo-ink" aria-hidden />
        ログイン方法
      </h2>
      {rows}
    </section>
  );
}

function Row({
  mark,
  name,
  sub,
  action,
}: {
  mark: React.ReactNode;
  name: string;
  sub: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-t border-ienazo-rule px-5 py-3.5">
      <span className="flex w-5 shrink-0 items-center justify-center text-ienazo-ink-soft">
        {mark}
      </span>
      <span className="flex min-w-0 flex-grow flex-col gap-0.5">
        <span className="text-sm font-bold">{name}</span>
        <span className="truncate text-xs text-ienazo-ink-soft">{sub}</span>
      </span>
      <span className="shrink-0 text-right">{action}</span>
    </div>
  );
}
