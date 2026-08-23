/**
 * ライブラリの読み込み表示。
 *
 * このページは force-dynamic なので、開くたびに Supabase への往復ぶんだけ待ちが出る。
 * 何も出さないと真っ白のまま止まって見えるので、確定している見出しは本物を先に出し、
 * セッション依存の部分（アカウント帯・棚）だけ骨組みにしておく。
 * ※このファイルはライブラリ配下だけに効く。/ienazo の他のページには影響しない。
 */
export default function LibraryLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {/* 見出しは静的に確定しているので、待たせずそのまま出す（後の描画とズレない） */}
      <p className="flex items-center gap-3 text-sm font-bold tracking-[0.28em] text-ienazo-ink-soft sm:text-base">
        <span className="inline-block h-2 w-2 bg-ienazo-red" aria-hidden />
        LIBRARY
      </p>
      <h1 className="mt-4 text-3xl font-black leading-[1.18] tracking-wide text-ienazo-ink sm:text-5xl">
        あなたのライブラリ
      </h1>

      <div
        className="mt-10 animate-pulse motion-reduce:animate-none"
        role="status"
        aria-label="読み込み中"
      >
        {/* アカウント帯 */}
        <div className="h-[72px] border border-ienazo-rule bg-ienazo-paper-soft" />

        {/* 棚（横長カード1枚ぶん） */}
        <div className="mt-12 flex border border-ienazo-rule bg-ienazo-paper-soft">
          <div className="h-[208px] w-[156px] shrink-0 border-r border-ienazo-rule bg-ienazo-paper-deep sm:h-[312px] sm:w-[232px]" />
          <div className="flex-1 p-6 sm:p-8">
            <div className="h-7 w-3/5 bg-ienazo-paper-deep" />
            <div className="mt-4 h-3.5 w-2/5 bg-ienazo-paper-deep" />
            <div className="mt-3 h-3.5 w-4/5 bg-ienazo-paper-deep" />
            <div className="mt-7 flex gap-3">
              <div className="h-14 w-44 bg-ienazo-paper-deep" />
              <div className="h-14 w-32 bg-ienazo-paper-deep" />
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">購入した作品を読み込んでいます。</span>
    </div>
  );
}
