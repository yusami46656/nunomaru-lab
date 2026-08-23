import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ienazo/SectionHeading";
import { WorkCard } from "@/components/ienazo/WorkCard";
import { PlayLauncher } from "@/components/ienazo/PlayLauncher";
import { getUser, loadOwnedSlugs } from "@/lib/ienazo/entitlements";
import { loadLastPlayed, formatPlayedAt } from "@/lib/ienazo/progress";
import { WORKS, difficultyStars, type Work } from "@/data/ienazo/works";
import { ClockIcon } from "@/components/ienazo/RequirementIcons";

export const metadata: Metadata = {
  title: "ライブラリ",
  robots: { index: false },
};

// セッション依存のため動的レンダリング。
export const dynamic = "force-dynamic";

/** 主CTA（塗り・大）。サイト共通のサイズに揃える。 */
const BTN_PRIMARY =
  "inline-flex min-w-[11rem] items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep";
/** 副CTA（枠・大）。 */
const BTN_GHOST =
  "inline-flex items-center justify-center border border-ienazo-rule px-6 py-4 font-medium tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper";

/** 棚が2件以下のときの横長カード。1件でも画面が空かないようにする形。 */
function ShelfRow({ work, playedAt }: { work: Work; playedAt?: string }) {
  const played = formatPlayedAt(playedAt);
  // 無料はチケット不要で直接起動する。有料と同じ mode で叩くと発券に失敗する。
  const isFree = work.type === "free";
  return (
    <li className="grid grid-cols-[104px_1fr] border border-ienazo-rule bg-ienazo-paper-soft shadow-ienazo-soft sm:grid-cols-[232px_1fr]">
      {/* カバーは grid の行高いっぱいに伸ばす（情報量で高さが変わっても隙間ができない） */}
      <div className="ienazo-frame relative overflow-hidden border-r border-ienazo-rule">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={work.cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {isFree && (
          <span className="absolute left-0 top-0 bg-ienazo-red px-2.5 py-1 text-xs font-bold tracking-wide text-white">
            無料
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col p-4 sm:p-8">
        <h2 className="text-xl font-black leading-snug tracking-wide text-ienazo-ink sm:text-[28px]">
          {work.title}
        </h2>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ienazo-ink-soft sm:mt-3 sm:text-[13px]">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5" />
            {work.minutes}分
          </span>
          <span aria-label={`難易度 ${work.difficulty}`}>{difficultyStars(work.difficulty)}</span>
          {played && (
            <>
              <span className="hidden h-3 w-px bg-ienazo-line sm:inline-block" aria-hidden />
              <span>最後に遊んだ日 {played}</span>
            </>
          )}
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-ienazo-ink-soft sm:mt-3 sm:text-sm">
          {work.tagline}
        </p>

        <div className="mt-5 flex flex-col items-start gap-3 sm:mt-7 sm:flex-row sm:items-center sm:gap-4">
          {/* 続きがあるかで文言だけ変える。再開位置の判断はエンジンが持っている。 */}
          <PlayLauncher
            slug={work.slug}
            mode={isFree ? "free" : "owned"}
            label={played ? "続きから遊ぶ" : "はじめる"}
          />
          <Link
            href={`/ienazo/works/${work.slug}`}
            className="text-[13px] font-medium tracking-wide text-ienazo-ink-soft transition-colors hover:text-ienazo-red sm:ml-auto"
          >
            作品ページを見る →
          </Link>
        </div>
      </div>
    </li>
  );
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ purchased?: string }>;
}) {
  const { purchased } = await searchParams;
  const user = await getUser();
  const owned = user ? await loadOwnedSlugs() : null;

  const ownedSlugs = owned?.ok ? owned.slugs : [];
  const purchasedWorks = WORKS.filter((w) => ownedSlugs.includes(w.slug));
  // 無料作品は購入記録を持たないので entitlement には出てこない。
  // ただし遊べることに変わりはないので、棚には並べる（体験版を探して迷わせない）。
  const freeWorks = WORKS.filter(
    (w) => w.type === "free" && !w.comingSoon && !ownedSlugs.includes(w.slug),
  );
  // 並びは「買ったもの → 無料」。最後に遊んだ順にすると開くたびに入れ替わって落ち着かない。
  const shelfWorks = [...purchasedWorks, ...freeWorks];

  // 取れなかったのか、本当に0件なのかを区別する。ここを潰すと障害時に
  // 購入済みの人へ「まだ購入した作品がありません」と表示してしまう。
  const loadFailed = owned !== null && !owned.ok && owned.reason === "load_failed";

  const lastPlayed = user && shelfWorks.length > 0 ? await loadLastPlayed(user.id) : {};

  // 決済直後の戻り先。実際に所有している作品のときだけ出す（URL を書き換えても出ない）。
  const justPurchased = purchased ? purchasedWorks.find((w) => w.slug === purchased) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {/* ページ最上部なので instant。スクロールで現れる演出は成立せず、
          ハイドレーションが終わるまで見出しが空になるだけになる。 */}
      <SectionHeading
        as="h1"
        instant
        label="LIBRARY"
        title="あなたのライブラリ"
        description="購入した作品が並びます。途中まで進んだ作品は、続きから遊べます。"
      />

      {justPurchased && (
        <div className="mt-10 flex flex-col gap-4 border border-ienazo-red bg-ienazo-paper-soft px-5 py-5 sm:flex-row sm:items-start sm:gap-5 sm:px-7 sm:py-6">
          <span
            className="mt-1.5 hidden h-2.5 w-2.5 shrink-0 bg-ienazo-red sm:inline-block"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold leading-relaxed text-ienazo-ink sm:text-[17px]">
              『{justPurchased.title}』をご購入いただき、ありがとうございます。
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ienazo-ink-soft sm:text-sm">
              この棚からいつでも遊べます。下のボタンを押すと、別のタブで開きます。
            </p>
          </div>
          {/* クエリを外すだけなので JS 不要。閉じたあとリロードしても戻らない。 */}
          <Link
            href="/ienazo/account/library"
            className="inline-flex shrink-0 items-center justify-center self-start border border-ienazo-rule px-4 py-2.5 text-[13px] font-medium text-ienazo-ink-soft transition-colors hover:border-ienazo-ink hover:text-ienazo-ink"
          >
            閉じる
          </Link>
        </div>
      )}

      {!user ? (
        // 未ログイン。このページに来た人の目的はログインなので、塗りボタンはログイン側。
        <div className="mt-12 border border-ienazo-rule bg-ienazo-paper-soft px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-ienazo-ink-soft">
            ログインすると、購入済みの作品がここに表示されます。
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/ienazo/account/login?next=/ienazo/account/library" className={BTN_PRIMARY}>
              ログイン
            </Link>
            <Link href="/ienazo/works" className={BTN_GHOST}>
              作品を見る
            </Link>
          </div>
          <p className="mt-5 text-[13px] text-ienazo-ink-soft">
            はじめての方は{" "}
            <Link
              href="/ienazo/account/register?next=/ienazo/account/library"
              className="font-bold text-ienazo-ink transition-colors hover:text-ienazo-red"
            >
              会員登録
            </Link>
          </p>
        </div>
      ) : loadFailed ? (
        // 取得失敗。「購入0件」と同じ見た目にしてはいけない画面。
        <div className="mt-12 border border-ienazo-red bg-ienazo-paper-soft px-6 py-16 text-center">
          <p className="text-base font-bold leading-relaxed text-ienazo-ink">
            購入情報を読み込めませんでした。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ienazo-ink-soft">
            通信の状態を確かめて、もう一度お試しください。
            <br />
            <span className="font-bold text-ienazo-ink">
              購入した作品が消えたわけではありません。
            </span>
          </p>
          <div className="mt-7">
            {/* Link だと同一ルートで再取得が走らないことがあるので、素の a で読み直す。 */}
            <a href="/ienazo/account/library" className={BTN_PRIMARY}>
              再読み込み
            </a>
          </div>
        </div>
      ) : shelfWorks.length === 0 ? (
        // 遊べるものが1つも無いとき（無料作品も配信していない場合）。
        <div className="mt-12 border border-ienazo-rule bg-ienazo-paper-soft px-6 py-16 text-center">
          <p className="text-sm leading-relaxed text-ienazo-ink-soft">
            まだ遊べる作品がありません。
          </p>
          <div className="mt-7">
            <Link href="/ienazo/works" className={BTN_PRIMARY}>
              作品を見る
            </Link>
          </div>
        </div>
      ) : (
        <>
          {shelfWorks.length <= 2 ? (
            // 1〜2件は横長カード。4列グリッドだと3列ぶんが空白のまま残る。
            <ul className="mt-12 flex flex-col gap-5">
              {shelfWorks.map((work) => (
                <ShelfRow key={work.slug} work={work} playedAt={lastPlayed[work.slug]} />
              ))}
            </ul>
          ) : (
            // 3件以上は作品一覧と同じカード・同じ列数に揃える。
            <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {shelfWorks.map((work) => (
                <li key={work.slug} className="flex">
                  <WorkCard work={work} />
                </li>
              ))}
            </ul>
          )}

          {/* まだ買っていない人にだけ、棚の下に静かに置く。棚そのものは空にしない。 */}
          {purchasedWorks.length === 0 && (
            <div className="mt-8 flex flex-col items-start gap-4 border border-ienazo-rule bg-ienazo-paper-soft px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm leading-relaxed text-ienazo-ink-soft">
                有料の作品もあります。物語も謎も、たっぷり遊べます。
              </p>
              <Link
                href="/ienazo/works"
                className="inline-flex shrink-0 items-center justify-center border border-ienazo-rule px-5 py-2.5 text-sm font-bold tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper"
              >
                作品を見る
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
