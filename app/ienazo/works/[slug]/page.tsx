import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/ienazo/SectionHeading";
import { Reveal } from "@/components/ienazo/Reveal";
import { WorkCard } from "@/components/ienazo/WorkCard";
import { WorkSpecTable } from "@/components/ienazo/WorkSpecTable";
import { BuyButton } from "@/components/ienazo/BuyButton";
import { PlayLauncher } from "@/components/ienazo/PlayLauncher";
import { StoryGallery } from "@/components/ienazo/StoryGallery";
import { WORKS, FREE_TRIAL, difficultyStars, type Work } from "@/data/ienazo/works";

// 要点表示のフラットなラインアイコン（絵文字の置き換え）。
function MetaIcon({ name }: { name: "clock" | "user" | "monitor" }) {
  const p = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "shrink-0 text-ienazo-ink-soft",
    "aria-hidden": true,
  };
  if (name === "clock")
    return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5V12l3 1.8" />
      </svg>
    );
  if (name === "user")
    return (
      <svg {...p}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
      </svg>
    );
  return (
    <svg {...p}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function generateStaticParams() {
  return WORKS.filter((w) => !w.comingSoon).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = WORKS.find((w) => w.slug === slug);
  if (!work) return { title: "作品が見つかりません" };
  const description = work.summary.replace(/\s*\n+\s*/g, " ").trim();
  // 1200×630 のOGPカード（SNS共有時のサムネ）。作品ごとに public/ienazo/og/og_<slug>.png を用意した場合のみ付与。
  const ogImage = `/ienazo/og/og_${slug}.png`;
  const hasOg = slug === "broken-android";
  return {
    title: work.title,
    description,
    ...(hasOg
      ? {
          openGraph: {
            title: work.title,
            description,
            type: "article",
            images: [{ url: ogImage, width: 1200, height: 630, alt: work.title }],
          },
          twitter: {
            card: "summary_large_image",
            title: work.title,
            description,
            images: [ogImage],
          },
        }
      : {}),
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = WORKS.find((w) => w.slug === slug);
  if (!work || work.comingSoon) notFound();

  const isFree = work.type === "free";
  const others: Work[] = WORKS.filter((w) => w.slug !== work.slug).slice(0, 3);

  return (
    <div>
      {/* ── ① ヒーロー帯 ── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <Reveal>
            <div className="relative aspect-video w-full overflow-hidden border border-ienazo-rule">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={work.hero} alt={work.title} className="h-full w-full object-cover object-center" />
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

              {/* 要点（フラットなラインアイコン） */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ienazo-ink">
                <span className="inline-flex items-center gap-1.5">
                  <MetaIcon name="clock" />約{work.minutes}分
                </span>
                <span>難易度 {difficultyStars(work.difficulty)}</span>
                <span className="inline-flex items-center gap-1.5">
                  <MetaIcon name="user" />{work.players}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MetaIcon name="monitor" />{work.environment}
                </span>
              </div>

              {/* 価格＋CTA */}
              <div className="mt-7 flex flex-col gap-3">
                <p className="text-2xl font-bold">
                  {isFree ? "無料" : `¥${work.priceJPY.toLocaleString()}`}
                  {!isFree && <span className="ml-2 text-xs font-normal text-ienazo-ink-soft">（買い切り・税込）</span>}
                </p>
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  {isFree ? (
                    <PlayLauncher slug={work.slug} mode="free" label="PLAY" />
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

      {/* ── ② あらすじ（左：画像ギャラリー／右：物語の説明文）── */}
      <section className="border-t border-ienazo-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading label="STORY" title="どんな物語？" />
          <div className="mt-10 grid items-start gap-8 md:grid-cols-2 md:gap-12">
            {/* 左：ギャラリー（大きな1枚＋サムネ） */}
            {work.storyShots && work.storyShots.length > 0 && (
              <Reveal>
                <StoryGallery shots={work.storyShots} />
              </Reveal>
            )}
            {/* 右：物語の説明文（改行を活かして雰囲気を出す） */}
            <Reveal delay={120}>
              <p className="whitespace-pre-line text-sm leading-[2.1] tracking-wide text-ienazo-ink sm:text-base">
                {work.summary}
              </p>
            </Reveal>
          </div>
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
