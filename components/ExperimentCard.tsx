import Link from "next/link";
import type { Experiment } from "@/data/experiments";
import { Rivets } from "@/components/decorations/Rivets";
import { ThumbnailImage } from "@/components/ThumbnailImage";

type Props = {
  experiment: Experiment;
};

export function ExperimentCard({ experiment }: Props) {
  const { title, description, thumbnail, publishedAt, href, ctaLabel, comingSoon } = experiment;

  return (
    <article className="nl-card group flex flex-col overflow-hidden p-0">
      <Rivets />

      {comingSoon ? (
        <div className="block cursor-default" aria-label={`${title}（近日公開）`}>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-parchment-200">
            <ThumbnailImage
              src={thumbnail}
              alt={title}
              sizes="(max-width: 640px) 100vw, 50vw"
              imageClassName="object-cover opacity-60"
            />
          </div>
        </div>
      ) : (
        <Link href={href} className="block" aria-label={`${title}を開く`}>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-parchment-200">
            <ThumbnailImage
              src={thumbnail}
              alt={title}
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </Link>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-ink-700">
          {comingSoon ? (
            <span className="nl-tag bg-parchment-300 text-ink-500">近日公開</span>
          ) : (
            <span className="nl-tag">公開日 {publishedAt}</span>
          )}
        </div>

        <h3 className="nl-heading-serif text-xl font-bold leading-snug sm:text-2xl">
          {comingSoon ? (
            <span className="text-ink-500">{title}</span>
          ) : (
            <Link href={href} className="hover:text-brass-700">
              {title}
            </Link>
          )}
        </h3>

        <p className="text-sm leading-relaxed text-ink-700">{description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          {comingSoon ? (
            <span className="nl-btn cursor-not-allowed opacity-50 pointer-events-none">
              準備中…
            </span>
          ) : (
            <Link href={href} className="nl-btn">
              {ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
