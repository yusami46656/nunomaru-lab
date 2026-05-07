import type { Metadata } from "next";
import { Stamp } from "@/components/decorations/Stamp";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "ぬのまるの実験工房における診断・コンテンツの利用についての免責事項です。",
};

export default function DisclaimerPage() {
  return (
    <article className="space-y-8">
      <header>
        <Stamp label="DISCLAIMER" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold sm:text-4xl">免責事項</h1>
        <p className="mt-3 text-sm text-ink-700">最終更新日: 2026年5月</p>
      </header>

      <section className="space-y-3">
        <h2 className="nl-heading-serif text-xl font-bold">1. コンテンツの目的</h2>
        <p className="text-sm leading-relaxed text-ink-800">
          当サイトに掲載している診断・ミニコンテンツ等は、すべて娯楽および自己理解を目的としたものです。法的・医学的・心理学的な判断を行うものではありません。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="nl-heading-serif text-xl font-bold">2. 個人・団体への意図について</h2>
        <p className="text-sm leading-relaxed text-ink-800">
          コンテンツに登場するタイプ名・キャラクター・例示等は、特定の個人、団体、属性を攻撃・評価・断定する意図を持つものではありません。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="nl-heading-serif text-xl font-bold">3. コンテンツの変更・削除</h2>
        <p className="text-sm leading-relaxed text-ink-800">
          当サイトに掲載されたコンテンツは、運営者の判断により予告なく変更・削除される場合があります。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="nl-heading-serif text-xl font-bold">4. 損害の責任について</h2>
        <p className="text-sm leading-relaxed text-ink-800">
          当サイトの利用、または利用できなかったことによって生じたいかなる損害についても、当サイト運営者は責任を負いかねます。利用者ご自身の責任のもとでご利用ください。
        </p>
      </section>
    </article>
  );
}
