import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ienazo/SectionHeading";
import { LogoutButton } from "@/components/ienazo/auth/LogoutButton";
import { getUser, getOwnedSlugs } from "@/lib/ienazo/entitlements";
import { WORKS, difficultyStars } from "@/data/ienazo/works";

export const metadata: Metadata = {
  title: "ライブラリ",
  robots: { index: false },
};

// セッション依存のため動的レンダリング。
export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const user = await getUser();
  const ownedSlugs = user ? await getOwnedSlugs() : [];
  const ownedWorks = WORKS.filter((w) => ownedSlugs.includes(w.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          label="LIBRARY"
          title="あなたのライブラリ"
          description="購入した作品が並びます。続きからプレイできます。"
        />
        {user && (
          <div className="shrink-0 pt-2 text-right">
            <p className="text-xs text-ienazo-ink-soft">{user.email}</p>
            <div className="mt-1">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>

      {!user ? (
        // 未ログイン
        <div className="mt-12 border border-ienazo-rule bg-ienazo-paper-soft px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-ienazo-ink-soft">
            ログインすると、購入済みの作品がここに表示されます。
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/ienazo/account/login?next=/ienazo/account/library"
              className="inline-flex items-center justify-center border border-ienazo-rule px-6 py-3 text-sm font-bold tracking-wide transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper"
            >
              ログイン
            </Link>
            <Link
              href="/ienazo/works"
              className="inline-flex items-center justify-center bg-ienazo-red px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
            >
              作品を見る
            </Link>
          </div>
        </div>
      ) : ownedWorks.length === 0 ? (
        // ログイン済み・未購入
        <div className="mt-12 border border-ienazo-rule bg-ienazo-paper-soft px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-ienazo-ink-soft">
            まだ購入した作品がありません。
          </p>
          <div className="mt-7">
            <Link
              href="/ienazo/works"
              className="inline-flex items-center justify-center bg-ienazo-red px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
            >
              作品を見る
            </Link>
          </div>
        </div>
      ) : (
        // 購入済み一覧
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ownedWorks.map((work) => (
            <li key={work.slug}>
              <Link
                href={`/ienazo/play/${work.slug}`}
                className="group block border border-ienazo-rule bg-ienazo-paper-soft transition-colors hover:border-ienazo-ink"
              >
                <div className="relative aspect-[3/4] overflow-hidden border-b border-ienazo-rule">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={work.cover} alt="" className="h-full w-full object-cover" draggable={false} />
                </div>
                <div className="px-4 py-4">
                  <h3 className="font-bold leading-snug tracking-wide">{work.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-ienazo-ink-soft">
                    <span>⏱ {work.minutes}分</span>
                    <span aria-label={`難易度 ${work.difficulty}`}>{difficultyStars(work.difficulty)}</span>
                  </div>
                  <span className="mt-3 inline-block text-xs font-bold tracking-wide text-ienazo-red">
                    プレイする 》
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
