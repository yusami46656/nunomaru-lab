import { difficultyStars, type Work } from "@/data/ienazo/works";

/**
 * 作品カード。
 * 価格表示ルール：トップの棚は価格を出さない（showPrice=false）／一覧は出す（true）。
 *   - 無料作品のみ [無料] バッジ（有料は印なし＝無料との対比で分かる）
 * ※作品詳細は後日 LP風に作るため、現状はリンクなし（ダミー画像は押せない）。
 */
export function WorkCard({ work, showPrice = false }: { work: Work; showPrice?: boolean }) {
  const isFree = work.type === "free";
  return (
    <div className="group block border border-ienazo-rule bg-ienazo-paper-soft shadow-ienazo-soft transition-[transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-ienazo-card">
      {/* カバー（縦3:4・スマホでも収まりやすい）。ienazo-frame で額装ヘアライン */}
      <div className="ienazo-frame relative aspect-[3/4] overflow-hidden border-b border-ienazo-rule">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={work.cover} alt="" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" draggable={false} />
        {/* 無料バッジのみ（有料は印なし） */}
        {isFree && (
          <span className="absolute left-0 top-0 bg-ienazo-red px-2.5 py-1 text-xs font-bold tracking-wide text-white">
            無料
          </span>
        )}
      </div>

      {/* 情報 */}
      <div className="px-4 py-4">
        <h3 className="font-bold leading-snug tracking-wide">{work.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ienazo-ink-soft">
          {work.tagline}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-ienazo-ink-soft">
          <span>⏱ {work.minutes}分</span>
          <span aria-label={`難易度 ${work.difficulty}`}>{difficultyStars(work.difficulty)}</span>
          {showPrice && (
            <span className="ml-auto font-bold text-ienazo-ink">
              {isFree ? "無料" : `¥${work.priceJPY.toLocaleString()}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
