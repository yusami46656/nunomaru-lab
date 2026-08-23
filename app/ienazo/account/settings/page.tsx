import type { Metadata } from "next";
import Link from "next/link";
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

const BTN_PRIMARY =
  "inline-flex min-w-[11rem] items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep";

export default async function AccountSettingsPage() {
  const user = await getUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      {/* 設定は用を済ませて出ていく場所。見出しは作品の棚ほど大きくしない。
          大きさは認証ページ（AuthShell）の h1 に揃える。 */}
      <nav className="mb-6 text-sm">
        <Link
          href="/ienazo/account/library"
          className="font-medium tracking-wide text-ienazo-ink-soft transition-colors hover:text-ienazo-red"
        >
          ← あなたのライブラリ
        </Link>
      </nav>

      <p className="flex items-center gap-3 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
        <span className="inline-block h-2 w-2 bg-ienazo-ink" aria-hidden />
        ACCOUNT
      </p>
      <h1 className="mt-3 text-2xl font-black tracking-wide text-ienazo-ink sm:text-3xl">
        アカウント設定
      </h1>

      {!user ? (
        <div className="mt-10 border border-ienazo-rule bg-ienazo-paper-soft px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-ienazo-ink-soft">
            この画面にはログインが必要です。
          </p>
          <div className="mt-7">
            <Link href="/ienazo/account/login?next=/ienazo/account/settings" className={BTN_PRIMARY}>
              ログイン
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* いまの状態を並べ、変えたい行だけ開く。開いた状態で置かない。 */}
          <section className="border border-ienazo-rule bg-ienazo-paper-soft">
            <h2 className="px-5 py-3.5 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
              ログイン情報
            </h2>
            <EmailChangeForm currentEmail={user.email ?? null} />
            <PasswordChangeForm />
            {/* 連携（Google）も同じ一覧に並べる。メールの行は上にあるので出さない。 */}
            <LinkedAccounts email={user.email ?? null} variant="rows" />
          </section>

          <section className="border border-ienazo-rule bg-ienazo-paper-soft">
            <h2 className="px-5 py-3.5 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
              セッション
            </h2>
            <div className="flex items-center gap-4 border-t border-ienazo-rule px-5 py-3.5">
              <span className="flex min-w-0 flex-grow flex-col gap-0.5">
                <span className="text-sm font-bold">ログアウト</span>
                <span className="truncate text-xs text-ienazo-ink-soft">
                  この端末からサインアウトします
                </span>
              </span>
              <span className="shrink-0">
                <LogoutButton variant="row" />
              </span>
            </div>
          </section>

          {/* 退会は一番下・一番静かに。押した先の確認ページで初めて実行できる。 */}
          <section className="border border-ienazo-rule bg-ienazo-paper-soft">
            <h2 className="px-5 py-3.5 text-xs font-bold tracking-[0.28em] text-ienazo-ink-soft">
              アカウントの削除
            </h2>
            <div className="flex items-center gap-4 border-t border-ienazo-rule px-5 py-3.5">
              <span className="flex min-w-0 flex-grow flex-col gap-0.5">
                <span className="text-sm font-bold">アカウントを削除する</span>
                <span className="text-xs leading-relaxed text-ienazo-ink-soft">
                  購入した作品とプレイ進捗も、すべて削除されます
                </span>
              </span>
              <Link
                href="/ienazo/account/delete"
                className="inline-flex h-11 shrink-0 items-center justify-center border border-ienazo-rule px-4 text-xs font-bold tracking-wide text-ienazo-ink-soft transition-colors hover:border-ienazo-red hover:text-ienazo-red"
              >
                削除へ
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
