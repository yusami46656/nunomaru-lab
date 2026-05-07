import type { Metadata } from "next";
import Link from "next/link";
import { Stamp } from "@/components/decorations/Stamp";
import { Gear } from "@/components/decorations/Gear";

export const metadata: Metadata = {
  title: "ハラスメントタイプ診断",
  description:
    "職場や日常のコミュニケーションにおけるあなたの危険なクセを、16タイプであぶり出す診断コンテンツです。",
};

export default function HarassmentTypeTopPage() {
  return (
    <div className="space-y-10">
      <section className="relative">
        <div className="pointer-events-none absolute -top-2 -right-2 hidden text-brass-500/25 sm:block" aria-hidden>
          <Gear className="h-24 w-24 animate-spin-slow" teeth={14} />
        </div>

        <Stamp label="EXPERIMENT 01" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold leading-tight sm:text-4xl">
          ハラスメントタイプ診断
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-800">
          職場や日常のコミュニケーションにおけるあなたの危険なクセを、16タイプであぶり出す診断です。
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-800">
          実はあなたも無自覚なうちにハラスメントをしてしまっているかも！？
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-700 sm:text-base">
          この診断では、パワハラ・モラハラ・セクハラ・カスハラ的なコミュニケーションのクセをもとに、あなたの傾向をファンタジーキャラクター風のタイプとして表示します。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/experiments/harassment-type/questions" className="nl-btn">
            診断をはじめる
            <span aria-hidden>→</span>
          </Link>
          <Link href="/experiments" className="nl-btn-ghost">
            実験一覧へ戻る
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="caution-heading"
        className="nl-plate border-dashed"
      >
        <h2
          id="caution-heading"
          className="font-serif text-base font-bold tracking-wide text-ink-900"
        >
          ご利用にあたっての注意
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700">
          <li>・この診断は娯楽・自己理解を目的としたコンテンツです。</li>
          <li>・法的・医学的な判断を行うものではありません。</li>
          <li>・実在の個人や特定の属性を攻撃・断定する意図はありません。</li>
        </ul>
      </section>
    </div>
  );
}
