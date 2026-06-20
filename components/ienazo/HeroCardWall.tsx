/**
 * ヒーロー：たくさんのカードが横に流れ続ける壁（2列で速度差＝パララックスの奥行き）。
 * hover で一時停止、prefers-reduced-motion で停止（globals.css の .ienazo-cardrow）。
 * children を中央に重ねる（白い解説プレート等）。
 * Server Component（CSSアニメーションのみ。JSは不要）。
 */
export function HeroCardWall({
  covers,
  children,
}: {
  covers: string[];
  children?: React.ReactNode;
}) {
  // -50% スライドで継ぎ目をなくすため、各列の中身は2回繰り返す
  const rowA = [...covers, ...covers];
  const rowB = [...covers.slice().reverse(), ...covers.slice().reverse()];

  return (
    <section
      aria-label="作品ビジュアル"
      className="ienazo-wall relative w-full overflow-hidden border-b border-ienazo-rule bg-ienazo-ink"
    >
      {/* 背景のカード壁（2列） */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-3 py-3"
        aria-hidden
      >
        {[rowA, rowB].map((row, ri) => (
          <div key={ri} className="flex w-max gap-3 px-1.5">
            <div className={`flex w-max gap-3 ${ri === 1 ? "ienazo-cardrow ienazo-cardrow-rev" : "ienazo-cardrow"}`}>
              {row.map((src, i) => (
                <div
                  key={`${ri}-${i}`}
                  className="aspect-[3/4] w-32 shrink-0 overflow-hidden border border-white/15 sm:w-40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 可読性のための減光 */}
      <div className="pointer-events-none absolute inset-0 bg-ienazo-ink/55" aria-hidden />

      {/* 中央オーバーレイ */}
      <div className="relative flex min-h-[60vh] items-center justify-center px-4 py-16 sm:min-h-[74vh]">
        {children}
      </div>
    </section>
  );
}
