import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ienazo/SectionHeading";
import { LogoutButton } from "@/components/ienazo/auth/LogoutButton";
import { LinkedAccounts } from "@/components/ienazo/auth/LinkedAccounts";
import { PasswordChangeForm } from "@/components/ienazo/auth/PasswordChangeForm";
import { EmailChangeForm } from "@/components/ienazo/auth/EmailChangeForm";
import { getUser } from "@/lib/ienazo/entitlements";

export const metadata: Metadata = {
  title: "アカウント設定",
  robots: { index: false },
};

// セッション依存のため動的レンダリング。
export const dynamic = "force-dynamic";

/** 主CTA（塗り・大）。サイト共通のサイズに揃える。 */
const BTN_PRIMARY =
  "inline-flex min-w-[11rem] items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep";

export default async function AccountSettingsPage() {
  const user = await getUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      {/* ページ最上部なので instant（入場アニメを待つと見出しが空のまま出る）。 */}
      <SectionHeading
        as="h1"
        instant
        label="ACCOUNT"
        title="アカウント設定"
        description="ログイン方法とご登録の情報を、ここでまとめて変更できます。"
      />

      {!user ? (
        <div className="mt-12 border border-ienazo-rule bg-ienazo-paper-soft px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-ienazo-ink-soft">
            この画面にはログインが必要です。
          </p>
          <div className="mt-7">
            <Link
              href="/ienazo/account/login?next=/ienazo/account/settings"
              className={BTN_PRIMARY}
            >
              ログイン
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 棚へ戻る導線。設定は用が済んだら出ていく場所なので、上下どちらからも戻れるようにする。 */}
          <div className="mt-10 flex flex-col gap-4 border border-ienazo-rule bg-ienazo-paper-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Link
              href="/ienazo/account/library"
              className="text-sm font-medium tracking-wide text-ienazo-ink transition-colors hover:text-ienazo-red"
            >
              ← あなたのライブラリへ戻る
            </Link>
            <LogoutButton variant="button" />
          </div>

          <div className="mt-8 space-y-6">
            <LinkedAccounts email={user.email ?? null} />
            <PasswordChangeForm />
            <EmailChangeForm currentEmail={user.email ?? null} />

            {/* 退会は一番下・一番静かに置く。押し間違いを避けるため確認ページを挟む。 */}
            <section className="border border-ienazo-rule bg-ienazo-paper-soft">
              <h2 className="flex items-center gap-3 px-5 py-3.5 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
                <span className="inline-block h-2 w-2 bg-ienazo-ink" aria-hidden />
                アカウントの削除
              </h2>
              <div className="flex flex-col gap-4 border-t border-ienazo-rule px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed text-ienazo-ink-soft">
                  購入した作品へのアクセスとプレイ進捗を含め、すべて削除されます。
                </p>
                <Link
                  href="/ienazo/account/delete"
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-center border border-ienazo-rule px-5 py-2.5 text-sm text-ienazo-ink-soft transition-colors hover:border-ienazo-red hover:text-ienazo-red"
                >
                  削除の手続きへ
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
