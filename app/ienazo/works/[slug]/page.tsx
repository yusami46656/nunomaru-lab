import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/ienazo/SectionHeading";
import { Reveal } from "@/components/ienazo/Reveal";
import { WorkCard } from "@/components/ienazo/WorkCard";
import { WorkSpecTable } from "@/components/ienazo/WorkSpecTable";
import { BuyButton } from "@/components/ienazo/BuyButton";
import { WORKS, FREE_TRIAL, difficultyStars, type Work } from "@/data/ienazo/works";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = WORKS.find((w) => w.slug === slug);
  if (!work) return { title: "作品が見つかりません" };
  return { title: work.title, description: work.summary };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = WORKS.find((w) => w.slug === slug);
  if (!work) notFound();

  const isFree = work.type === "free";
  const others: Work[] = WORKS.filter((w) => w.slug !== work.slug).slice(0, 3);
  // 有料は購入(ログイン)へ、無料はそのままプレイへ
  const primaryHref = isFree
    ? work.playUrl
    : `/ienazo/account/login?next=${encodeURIComponent(`/ienazo/play/${work.slug}`)}`;

  return (
    <div>
      {/* ── ① ヒーロー帯 ── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <Reveal>
            <div className="relative aspect-video w-full overflow-hidden border border-ienazo-rule">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={work.hero} alt={work.title} className="h-full w-full object-cover" />
              {isFree && (
                <span className="absolute left-0 top-0 bg-ienazo-red px-3 py-1 text-xs font-bold tracking-wide text-white">
                  無料体験
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-ienazo-ink-soft">
                {isFree ? "FREE TRIAL" : "WORK"}
              </p>
              <h1 className="mt-3 text-3xl font-black leading-snug tracking-wide sm:text-4xl">
                {work.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ienazo-ink-soft sm:text-base">
                {work.tagline}
              </p>

              {/* 要点 */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ienazo-ink">
                <span>⏱ 約{work.minutes}分</span>
                <span>難易度 {difficultyStars(work.difficulty)}</span>
                <span>👤 {work.players}</span>
                <span>🖥 {work.environment}</span>
              </div>

              {/* 価格＋CTA */}
              <div className="mt-7 flex flex-col gap-3">
                <p className="text-2xl font-bold">
                  {isFree ? "無料" : `¥${work.priceJPY.toLocaleString()}`}
                  {!isFree && <span className="ml-2 text-xs font-normal text-ienazo-ink-soft">（買い切り・税込）</span>}
                </p>
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  {isFree ? (
                    <Link
                      href={primaryHref}
                      className="inline-flex items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
                    >
                      無料で遊ぶ
                    </Link>
                  ) : (
                    <BuyButton slug={work.slug} />
                  )}
                  {!isFree && (
                    <Link
                      href={`/ienazo/works/${FREE_TRIAL.slug}`}
                      className="inline-flex items-center justify-center text-sm font-medium tracking-wide text-ienazo-ink hover:text-ienazo-red"
                    >
                      まず無料体験を見る ▸
                    </Link>
                  )}
                </div>
                {isFree && (
                  <p className="text-xs tracking-wide text-ienazo-ink-soft">＊ 登録不要・ブラウザですぐ始められます</p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ② あらすじ（ネタバレなし） ── */}
      <section className="border-t border-ienazo-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading label="STORY" title="どんな物語？" />
          <Reveal delay={120}>
            <p className="mt-8 max-w-2xl text-sm leading-loose text-ienazo-ink sm:text-base">
              {work.summary}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ③ この作品について（スペック） ── */}
      <section className="border-t border-ienazo-line bg-ienazo-paper-deep">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading label="DETAILS" title="この作品について" />
          <div className="mt-8 max-w-2xl">
            <WorkSpecTable work={work} />
          </div>
        </div>
      </section>

      {/* ── ④ 他の作品 ── */}
      <section className="border-t border-ienazo-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading label="MORE" title="ほかの作品も" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {others.map((w, i) => (
              <Reveal key={w.slug} delay={i * 70}>
                <WorkCard work={w} showPrice />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
