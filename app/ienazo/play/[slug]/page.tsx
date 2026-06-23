import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { WORKS } from "@/data/ienazo/works";
import { getUser, hasEntitlement } from "@/lib/ienazo/entitlements";
import { PlayLauncher } from "@/components/ienazo/PlayLauncher";

// 無料作品は作品ページから直接プレイ起動するため、このゲートは有料のみ。
export function generateStaticParams() {
  return WORKS.filter((w) => !w.comingSoon && w.type !== "free").map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = WORKS.find((w) => w.slug === slug);
  return { title: work ? `${work.title}（プレイ）` : "プレイ", robots: { index: false } };
}

// 所有検証はセッション依存のため動的レンダリング。
export const dynamic = "force-dynamic";

export default async function PlayGatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = WORKS.find((w) => w.slug === slug);
  // 無料作品は作品ページから直接起動する方針のため、このゲートは有料専用（無料は 404）。
  if (!work || work.comingSoon || work.type === "free") notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-xs font-bold tracking-[0.3em] text-ienazo-ink-soft">PLAY</p>
      <h1 className="mt-3 text-3xl font-black tracking-wide">{work.title}</h1>
      <PaidGate slug={work.slug} />
    </div>
  );
}

// 有料：ログイン＋所有検証を通った人だけ起動ボタン、それ以外は導線。
async function PaidGate({ slug }: { slug: string }) {
  const user = await getUser();
  const owned = user ? await hasEntitlement(slug) : false;

  if (owned) {
    return (
      <>
        <p className="mt-5 text-sm leading-relaxed text-ienazo-ink-soft">
          所有を確認しました。下のボタンから、別タブで物語が始まります。
        </p>
        <div className="flex justify-center">
          <PlayLauncher slug={slug} mode="owned" />
        </div>
      </>
    );
  }

  if (user) {
    // ログイン済み・未所有 → 購入
    return (
      <>
        <p className="mt-5 text-sm leading-relaxed text-ienazo-ink-soft">
          この作品はまだ購入されていません。
        </p>
        <div className="mt-8">
          <Link
            href={`/ienazo/works/${slug}`}
            className="inline-flex items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
          >
            作品ページで購入する
          </Link>
        </div>
      </>
    );
  }

  // 未ログイン → ログイン（戻り先をこのゲートに）
  return (
    <>
      <p className="mt-5 text-sm leading-relaxed text-ienazo-ink-soft">
        この作品を遊ぶには、購入とログインが必要です。
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={`/ienazo/works/${slug}`}
          className="inline-flex items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
        >
          作品ページで購入する
        </Link>
        <Link
          href={`/ienazo/account/login?next=/ienazo/play/${slug}`}
          className="inline-flex items-center justify-center border border-ienazo-rule px-8 py-4 font-bold tracking-wide transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper"
        >
          ログイン
        </Link>
      </div>
    </>
  );
}
