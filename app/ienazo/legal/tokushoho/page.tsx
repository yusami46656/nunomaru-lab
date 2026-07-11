import type { Metadata } from "next";
import { SectionHeading } from "@/components/ienazo/SectionHeading";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "家謎の特定商取引法に基づく表記。",
  // 法令上は「購入者が閲覧できる状態」であれば足り、検索エンジンへの掲載義務はない。
  // 運営者氏名が名前検索でヒットしないよう、本ページは noindex とする（フッターから閲覧可能）。
  robots: { index: false, follow: false },
};

const ROWS: [string, React.ReactNode][] = [
  ["販売事業者", "ぬのまる工房"],
  ["運営統括責任者", "宇佐美友雅"],
  [
    "所在地",
    "ご請求をいただいた場合、遅滞なく開示いたします。下記の連絡先メールアドレスまでお問い合わせください。",
  ],
  [
    "電話番号",
    "ご請求をいただいた場合、遅滞なく開示いたします。下記の連絡先メールアドレスまでお問い合わせください。",
  ],
  ["連絡先", "nunomaru0x0u@gmail.com"],
  ["販売URL", "https://nunomaru-lab.com/ienazo"],
  ["販売価格", "各作品の詳細ページに税込価格で表示します。"],
  ["商品代金以外の必要料金", "インターネット接続料金・通信料はお客様のご負担となります。"],
  ["支払方法", "クレジットカード（Stripe）"],
  ["支払時期", "ご購入手続き時にお支払いが確定します。"],
  ["商品の引渡時期", "決済完了後、ただちにプレイ可能になります（オンライン提供）。"],
  [
    "返品・キャンセル",
    "デジタル商品の性質上、原則として返品・返金はお受けできません。ただし、購入したのに作品が開けない等の技術的な提供不能の場合は、上記の連絡先までご連絡いただければ個別に対応いたします。",
  ],
  ["動作環境", "PC・タブレット推奨（スマホも可）。最新のブラウザでのご利用を推奨します。"],
];

export default function TokushohoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading label="LEGAL" title="特定商取引法に基づく表記" />

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
