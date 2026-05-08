import Link from "next/link";
import type { Experiment } from "@/data/experiments";
import { Rivets } from "@/components/decorations/Rivets";

type Props = {
  experiment: Experiment;
};

export function ExperimentCard({ experiment }: Props) {
  const { title, description, thumbnail, publishedAt, href, ctaLabel } = experiment;

  return (
    <article className="nl-card group flex flex-col overflow-hidden p-0">
      <Rivets />

      <Link href={href} className="block" aria-label={`${title}を開く`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-parchment-200">
          <ThumbnailPlaceholder />
          {thumbnail ? (
            // background-image で描画しているので、ファイル未配置時はプレースホルダーが透けて表示される。
            <div
              role="img"
              aria-label=""
              className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
              style={{ backgroundImage: `url(${thumbnail})` }}
            />
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-ink-700">
          <span className="nl-tag">公開日 {publishedAt}</span>
        </div>

        <h3 className="nl-heading-serif text-xl font-bold leading-snug sm:text-2xl">
          <Link href={href} className="hover:text-brass-700">
            {title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-ink-700">{description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <Link href={href} className="nl-btn">
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * サムネイル未設定時のプレースホルダー。方眼紙＋歯車のミニ装飾。
 * 画像を後から /public 配下に置けば差し替わる。
 */
function ThumbnailPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-parchment-200">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(154, 109, 62, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(154, 109, 62, 0.18) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative flex flex-col items-center gap-1 text-brass-700/70">
        <svg viewBox="0 0 100 100" aria-hidden className="h-12 w-12">
          <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.7" />
          <line x1="50" y1="18" x2="50" y2="6" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="94" x2="50" y2="82" stroke="currentColor" strokeWidth="2" />
          <line x1="6" y1="50" x2="18" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="82" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="font-serif text-xs tracking-[0.25em] text-brass-700/70">EXPERIMENT</span>
      </div>
    </div>
  );
}
