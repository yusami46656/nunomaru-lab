"use client";

/**
 * ライブラリで想定外の例外が出たときの受け皿。
 *
 * 購入情報の取得失敗そのものは loadOwnedSlugs() が結果として返すので、ページ側で
 * 落ち着いた画面を出す。ここはそれ以外の例外（描画時のエラーなど）を拾う最後の砦。
 *
 * どちらの経路でも、伝えることは同じ2つ。
 *   1. 読み込めなかっただけで、購入したものは消えていない
 *   2. もう一度試す手段がある
 */
import { useEffect } from "react";

export default function LibraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // digest はサーバー側ログとの突き合わせ用。本文はユーザーに出さない。
    console.error("[ienazo/library]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="flex items-center gap-3 text-sm font-bold tracking-[0.28em] text-ienazo-ink-soft sm:text-base">
        <span className="inline-block h-2 w-2 bg-ienazo-red" aria-hidden />
        LIBRARY
      </p>
      <h1 className="mt-4 text-3xl font-black leading-[1.18] tracking-wide text-ienazo-ink sm:text-5xl">
        あなたのライブラリ
      </h1>

      <div className="mt-12 border border-ienazo-red bg-ienazo-paper-soft px-6 py-12 text-center sm:px-8 sm:py-16">
        <p className="text-base font-bold leading-relaxed text-ienazo-ink">
          ライブラリを表示できませんでした。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ienazo-ink-soft">
          通信の状態を確かめて、もう一度お試しください。
          <br />
          <span className="font-bold text-ienazo-ink">購入した作品が消えたわけではありません。</span>
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-w-[11rem] items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
          >
            再読み込み
          </button>
          <a
            href="/ienazo/faq"
            className="inline-flex items-center justify-center border border-ienazo-rule px-6 py-4 font-medium tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper"
          >
            よくある質問
          </a>
        </div>
      </div>
    </div>
  );
}
