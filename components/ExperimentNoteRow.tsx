import Link from "next/link";
import type { Experiment, ToolStatus } from "@/data/experiments";
import { ThumbnailImage } from "@/components/ThumbnailImage";

type Props = {
  experiment: Experiment;
};

const STATUS_LABEL: Record<ToolStatus, string> = {
  published: "READY",
  comingSoon: "SOON",
  inProgress: "BUILD",
  planning: "DRAFT",
};

const STATUS_BUTTON: Record<ToolStatus, string> = {
  published: "触ってみる",
  comingSoon: "準備中…",
  inProgress: "制作中…",
  planning: "構想中…",
};

export function ExperimentNoteRow({ experiment }: Props) {
  const { title, description, thumbnail, publishedAt, href, ctaLabel, noteArticles, status, noteUrl } = experiment;
  const isActive = status === "published" && !!href;
  const linkHref = href ?? "#";
  // 制作ログ（note）が用意できているものだけ活性。未執筆は「準備中」。
  const noteTopHref = noteUrl ?? noteArticles?.[0]?.url;
  const hasNote = !!noteTopHref;

  return (
    <article className="sys-panel-flat sys-corner-full group">
      <span className="sys-corner-mark tl" aria-hidden />
      <span className="sys-corner-mark tr" aria-hidden />
      <span className="sys-corner-mark bl" aria-hidden />
      <span className="sys-corner-mark br" aria-hidden />
      <div className="flex flex-col gap-0 sm:flex-row">
        {isActive ? (
          <Link
            href={linkHref}
            className="block shrink-0 sm:w-64 sm:self-stretch"
            aria-label={`${title}を開く`}
            tabIndex={-1}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-auto sm:h-full" style={{ backgroundColor: "rgba(214, 208, 187, 0.45)" }}>
              <ThumbnailImage
                src={thumbnail}
                alt={title}
                sizes="(max-width: 640px) 100vw, 256px"
                imageClassName="object-contain transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        ) : (
          <div className="block shrink-0 cursor-default sm:w-64 sm:self-stretch" aria-label={`${title}（${STATUS_LABEL[status]}）`}>
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-auto sm:h-full" style={{ backgroundColor: "rgba(214, 208, 187, 0.45)" }}>
              <ThumbnailImage
                src={thumbnail}
                alt={title}
                sizes="(max-width: 640px) 100vw, 256px"
                imageClassName="object-contain opacity-50"
              />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`sys-tag ${isActive ? "sys-tag-accent" : ""}`}>
              {STATUS_LABEL[status]}
            </span>
            {publishedAt ? (
              <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--sys-text-muted)" }}>
                {publishedAt}
              </span>
            ) : null}
          </div>

          <h3 className="sys-heading text-xl font-bold leading-snug sm:text-2xl">
            {isActive ? (
              <Link href={linkHref} className="hover:opacity-80">
                {title}
              </Link>
            ) : (
              <span style={{ color: "var(--sys-text-muted)" }}>{title}</span>
            )}
          </h3>

          <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
            {description}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            {isActive ? (
              <Link href={linkHref} className="sys-btn-primary">
                {ctaLabel ?? "触ってみる"}
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <span className="sys-btn-ghost cursor-not-allowed opacity-60 pointer-events-none">
                {STATUS_BUTTON[status]}
              </span>
            )}
            {hasNote ? (
              <a
                href={noteTopHref}
                target="_blank"
                rel="noopener noreferrer"
                className="sys-btn-ghost"
              >
                note ↗
              </a>
            ) : (
              <span className="sys-btn-ghost cursor-not-allowed opacity-60 pointer-events-none">
                note（準備中）
              </span>
            )}
          </div>

          {noteArticles && noteArticles.length > 0 ? (
            <div className="sys-rule-soft border-t pt-4">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em]" style={{ color: "var(--sys-text-muted)" }}>
                Making Note
              </p>
              <ul className="flex flex-col gap-1">
                {noteArticles.map((article) => (
                  <li key={article.url}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sys-link text-sm"
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
