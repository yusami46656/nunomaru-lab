import Link from "next/link";
import type { Experiment } from "@/data/experiments";
import { Rivets } from "@/components/decorations/Rivets";

type Props = {
  experiment: Experiment;
};

export function ExperimentNoteRow({ experiment }: Props) {
  const { title, description, thumbnail, publishedAt, href, ctaLabel, noteArticles, comingSoon } = experiment;

  return (
    <article className="nl-card group overflow-hidden p-0">
      <Rivets />

      <div className="flex flex-col gap-0 sm:flex-row">
        {comingSoon ? (
          <div className="block shrink-0 cursor-default sm:w-48" aria-label={`${title}（近日公開）`}>
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-parchment-200 sm:aspect-auto sm:h-full sm:min-h-[9rem]">
              <ThumbnailPlaceholder />
              {thumbnail ? (
                <div
                  role="img"
                  aria-label=""
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{ backgroundImage: `url(${thumbnail})` }}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <Link
            href={href}
            className="block shrink-0 sm:w-48"
            aria-label={`${title}を開く`}
            tabIndex={-1}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-parchment-200 sm:aspect-auto sm:h-full sm:min-h-[9rem]">
              <ThumbnailPlaceholder />
              {thumbnail ? (
                <div
                  role="img"
                  aria-label=""
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url(${thumbnail})` }}
                />
              ) : null}
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

          {noteArticles && noteArticles.length > 0 ? (
            <div className="border-t border-parchment-300 pt-4">
              <p className="mb-2 text-xs font-semibold tracking-widest text-ink-600 uppercase">
                制作ノート
              </p>
              <ul className="flex flex-col gap-1">
                {noteArticles.map((article) => (
                  <li key={article.url}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nl-link text-sm"
                    >
                      {article.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

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
        <svg viewBox="0 0 100 100" aria-hidden className="h-10 w-10">
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
