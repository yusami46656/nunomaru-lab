import type { Metadata } from "next";
import { SectionHeading } from "@/components/ienazo/SectionHeading";

export const metadata: Metadata = {
  title: "よくある質問",
  description: "家謎のよくある質問。無料体験・購入・支払い・アカウント・動作環境・プレイについての疑問にお答えします。",
};

const FAQ: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "家謎について",
    items: [
      { q: "家謎ってどんなサービス？", a: "おうちで気軽に遊べる、謎解き・脱出ゲームです。ブラウザだけで、物語の世界に入り込みながら謎を解きます。" },
      { q: "スマホでも遊べる？", a: "遊べます。じっくり遊ぶならPC・タブレットを推奨していますが、スマホでもプレイ可能です。" },
    ],
  },
  {
    category: "無料体験について",
    items: [
      { q: "本当に登録なしで遊べる？", a: "はい。無料体験は会員登録もメールも不要で、ブラウザでそのまま始められます。" },
      { q: "無料体験の進捗は保存される？", a: "同じ端末・同じブラウザであれば、途中から再開できます（端末内に保存されます）。" },
    ],
  },
  {
    category: "購入・支払いについて",
    items: [
      { q: "支払い方法は？", a: "クレジットカード（Stripe）でのお支払いに対応しています。" },
      { q: "買い切り？追加課金はある？", a: "買い切りです。一度購入すれば、追加課金なく何度でも遊べます。" },
      { q: "返金はできる？", a: "デジタル商品のため、原則として返金はお受けできません。ただし、購入したのに作品が開けない等の技術的な提供不能のケースは個別に対応します。" },
    ],
  },
  {
    category: "アカウント・ログインについて",
    items: [
      { q: "なぜ有料作品はログインが必要？", a: "あなたの購入を守るためです。ログインで進捗も保存され、どの端末でも続きから遊べます。" },
      { q: "パスワードを忘れたら？", a: "ログイン画面から再設定できます（準備中）。" },
    ],
  },
  {
    category: "プレイ・動作環境について",
    items: [
      { q: "推奨環境は？", a: "PC・タブレット推奨（スマホも可）。最新のブラウザでのご利用を推奨します。" },
      { q: "途中でやめても再開できる？", a: "有料作品はログインで進捗を保存し、続きから再開できます。無料体験は同じ端末内で再開できます。" },
      { q: "謎が難しすぎませんか？", a: "すべての作品にヒントがあります。行き詰まっても必ず前に進めるので、初めての方も安心です。" },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading label="FAQ" title="よくある質問" />

      <div className="mt-12 space-y-12">
        {FAQ.map((group) => (
          <div key={group.category}>
            <h2 className="flex items-center gap-3 text-sm font-bold tracking-[0.2em] text-ienazo-ink-soft">
              <span className="inline-block h-2 w-2 bg-ienazo-red" aria-hidden />
              {group.category}
            </h2>
            <div className="mt-4 border-t border-ienazo-rule">
              {group.items.map((item) => (
                <details key={item.q} className="group border-b border-ienazo-line">
                  <summary className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-lg font-bold leading-7 text-ienazo-red">Q</span>
                    <span className="flex-1 font-bold leading-7 tracking-wide sm:text-lg">{item.q}</span>
                    <span className="mt-1 shrink-0 text-ienazo-ink-soft transition-transform group-open:rotate-45" aria-hidden>
                      ＋
                    </span>
                  </summary>
                  <div className="flex items-start gap-4 pb-6">
                    <span className="text-lg font-bold leading-7 text-ienazo-ink-soft">A</span>
                    <p className="flex-1 text-sm leading-7 text-ienazo-ink-soft">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
