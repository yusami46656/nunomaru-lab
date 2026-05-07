import type { Metadata } from "next";
import Link from "next/link";
import { Stamp } from "@/components/decorations/Stamp";
import { Gear } from "@/components/decorations/Gear";

export const metadata: Metadata = {
  title: "ハラスメントタイプ診断 結果 (サンプル)",
  description:
    "ハラスメントタイプ診断の仮の結果ページです。正式版では16タイプの結果を表示します。",
  // 仮ページのため検索インデックスから除外する。
  robots: { index: false, follow: false },
};

export default function HarassmentResultSamplePage() {
  return (
    <div className="space-y-10">
      <section>
        <Stamp label="RESULT / SAMPLE" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold sm:text-4xl">
          診断結果サンプル
        </h1>
        <p className="mt-3 text-sm text-ink-700 sm:text-base">
          ※これは仮の結果ページです。正式版では16タイプの診断結果を表示します。
        </p>
      </section>

      <section className="nl-card relative overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 text-brass-500/20" aria-hidden>
          <Gear className="h-32 w-32 animate-spin-slower" teeth={16} />
        </div>

        <div className="relative">
          <p className="font-serif text-xs tracking-[0.3em] text-brass-700">YOUR TYPE</p>
          <h2 className="mt-3 nl-heading-serif text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
            詰め将軍
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-800 sm:text-base">
            職場や日常の中で、正しさや成果を重視するあまり、相手に強い圧を与えてしまうことがあるタイプです。
          </p>
        </div>
      </section>

      <section className="nl-plate border-dashed text-sm leading-relaxed text-ink-700">
        <p>
          ※ この結果は仮表示です。実際の診断ロジックと16タイプの結果は今後実装します。
        </p>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <Link href="/experiments/harassment-type" className="nl-btn-ghost">
          診断トップへ戻る
        </Link>
        <Link href="/experiments" className="nl-btn-ghost">
          実験一覧へ
        </Link>
      </section>
    </div>
  );
}
