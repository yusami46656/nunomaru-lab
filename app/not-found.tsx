import Link from "next/link";
import { Stamp } from "@/components/decorations/Stamp";
import { Gear } from "@/components/decorations/Gear";

export default function NotFound() {
  return (
    <div className="space-y-8 py-6">
      <section className="relative">
        <div className="pointer-events-none absolute -right-2 -top-2 hidden text-brass-500/25 sm:block" aria-hidden>
          <Gear className="h-24 w-24 animate-spin-slow" teeth={14} />
        </div>
        <Stamp label="404 / NOT FOUND" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold sm:text-4xl">
          ページが見つかりませんでした
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-800 sm:text-base">
          お探しのページは移動・削除されたか、URL が間違っている可能性があります。
        </p>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Link href="/" className="nl-btn">
          トップへ戻る
          <span aria-hidden>→</span>
        </Link>
        <Link href="/experiments" className="nl-btn-ghost">
          実験一覧へ
        </Link>
      </section>
    </div>
  );
}
