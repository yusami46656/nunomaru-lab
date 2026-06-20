import type { Metadata } from "next";
import { SectionHeading } from "@/components/ienazo/SectionHeading";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "家謎の特定商取引法に基づく表記。",
};

// ※内容は仮。正式な事業者情報・価格・返金方針で確定すること。
const ROWS: [string, React.ReactNode][] = [
  ["販売事業者", "ぬのまる工房（仮）"],
  ["運営統括責任者", "（後日記載）"],
  ["所在地", "（請求があったら遅滞なく開示します／後日記載）"],
  ["連絡先", "（メールアドレスを後日記載）"],
  ["販売URL", "https://nunomaru-lab.com/ienazo"],
  ["販売価格", "各作品の詳細ページに税込価格で表示します。"],
  ["商品代金以外の必要料金", "インターネット接続料金・通信料はお客様のご負担となります。"],
  ["支払方法", "クレジットカード（Stripe）"],
  ["支払時期", "ご購入時にお支払いが確定します。"],
  ["商品の引渡時期", "決済完了後、ただちにプレイ可能になります（オンライン提供）。"],
  [
    "返品・キャンセル",
    "デジタル商品の性質上、原則として返品・返金はお受けできません。ただし、購入したのに作品が開けない等の技術的な提供不能の場合は、個別に対応いたします。",
  ],
  ["動作環境", "PC・タブレット推奨（スマホも可）。最新のブラウザでのご利用を推奨します。"],
];

export default function TokushohoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading label="LEGAL" title="特定商取引法に基づく表記" />
      <p className="mt-6 text-xs text-ienazo-ink-soft">※ 本ページの内容は仮です。正式情報で確定します。</p>

      <dl className="mt-10 border-t border-ienazo-rule">
        {ROWS.map(([k, v]) => (
          <div key={k} className="grid grid-cols-1 gap-1 border-b border-ienazo-line py-5 sm:grid-cols-[12rem_1fr] sm:gap-4">
            <dt className="text-sm font-bold tracking-wide text-ienazo-ink-soft">{k}</dt>
            <dd className="text-sm leading-relaxed text-ienazo-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
