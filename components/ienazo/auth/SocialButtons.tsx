"use client";

// ソーシャルログインのボタン列。ログイン／会員登録の両方から使う。
// 出すプロバイダは env（NEXT_PUBLIC_IENAZO_OAUTH_PROVIDERS）で決まるので、
// Supabase 側の設定が済んだものから順に通電していける。
//
// ボタンの色・ロゴ・文言は各社のブランドガイドラインで固定されている。
// 家謎のトーンに寄せてよいのは角丸だけで、それも「規定どおり(A案)」を採用している
// （Google 4px / LINE 6px）。ここを触るときは各社の規定を先に読むこと。
import { useState } from "react";
import { createClient } from "@/lib/ienazo/supabase/client";
import {
  OAUTH_PROVIDERS,
  SUPABASE_PROVIDER,
  SITE_URL,
  type OAuthProviderId,
} from "@/lib/ienazo/config";
import { GoogleMark, LineMark, XMark } from "@/components/ienazo/auth/ProviderMarks";

type Intent = "login" | "register";

const LABEL: Record<OAuthProviderId, Record<Intent, string>> = {
  google: { login: "Google でログイン", register: "Google で登録" },
  line: { login: "LINEでログイン", register: "LINEで登録" },
  twitter: { login: "X でログイン", register: "X で登録" },
};

export function SocialButtons({ intent, next }: { intent: Intent; next: string }) {
  const [pending, setPending] = useState<OAuthProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (OAUTH_PROVIDERS.length === 0) return null;

  async function start(id: OAuthProviderId) {
    setError(null);
    setPending(id);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      // custom:line は @supabase/supabase-js の Provider 型に無いためキャストする。
      provider: SUPABASE_PROVIDER[id] as never,
      options: {
        redirectTo: `${SITE_URL}/ienazo/account/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // 成功時はリダイレクトが走るので、ここに戻ってくるのは失敗したときだけ。
    if (error) {
      setPending(null);
      setError("外部サービスに接続できませんでした。時間をおいて試してください。");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3">
        {OAUTH_PROVIDERS.map((id) => (
          <ProviderButton
            key={id}
            id={id}
            label={LABEL[id][intent]}
            disabled={pending !== null}
            loading={pending === id}
            onClick={() => start(id)}
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 rounded border border-ienazo-red/40 bg-ienazo-red/5 px-3 py-2 text-xs text-ienazo-red">
          {error}
        </p>
      )}

      {/* 押す前に読める位置に置く。Google の同意画面には家謎ではなく認証基盤（Supabase）の
          ドメインが出るため、これが無いと「知らないサイトに飛ばされた」と読まれてしまう。
          自前ドメインに変えるには Supabase の有料アドオンが要るので、当面は先に伝えて防ぐ。 */}
      <p className="mt-3 text-[11px] leading-relaxed text-ienazo-ink-soft">
        ログイン画面に <span className="font-medium text-ienazo-ink">supabase.co</span>{" "}
        と表示されることがあります。家謎が認証に使っているサービスのドメインです。
      </p>

      <div className="mt-7 flex items-center gap-4">
        <span className="h-px flex-grow bg-ienazo-rule" />
        <span className="text-[11px] font-bold tracking-[0.18em] text-ienazo-ink-soft">または</span>
        <span className="h-px flex-grow bg-ienazo-rule" />
      </div>
    </div>
  );
}

function ProviderButton({
  id,
  label,
  disabled,
  loading,
  onClick,
}: {
  id: OAuthProviderId;
  label: string;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  const common = "h-12 w-full font-medium transition-colors disabled:opacity-60";

  if (id === "google") {
    // Google: 白地／枠 #747775／角丸 4px／ロゴ 18px。
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${common} flex items-center justify-center gap-3 rounded-[4px] border border-[#747775] bg-white px-4 text-[15px] text-[#1f1f1f] hover:bg-[#f8f9fa]`}
      >
        <GoogleMark />
        <span>{loading ? "接続中…" : label}</span>
      </button>
    );
  }

  if (id === "line") {
    // LINE: 地 #06C755／アイコン枠を 1px の暗線で仕切る／角丸 6px。
    // 文言はアイコン幅ぶんの余白を右にも取って、ボタン全体の中央に置く。
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${common} flex items-stretch overflow-hidden rounded-md bg-[#06c755] text-white hover:bg-[#05b54b]`}
      >
        <span className="flex w-12 shrink-0 items-center justify-center border-r border-black/[0.08]">
          <LineMark />
        </span>
        <span className="flex flex-grow items-center justify-center pr-12 text-[15px]">
          {loading ? "接続中…" : label}
        </span>
      </button>
    );
  }

  // X: 黒地／白ロゴ。
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${common} flex items-center justify-center gap-3 rounded-[4px] bg-black px-4 text-[15px] text-white hover:bg-[#1a1a1a]`}
    >
      <XMark />
      <span>{loading ? "接続中…" : label}</span>
    </button>
  );
}
