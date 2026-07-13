import type { Metadata } from "next";
import { SectionHeading } from "@/components/ienazo/SectionHeading";

export const metadata: Metadata = {
  title: "利用規約",
  description: "家謎の利用規約。",
  robots: { index: false, follow: false },
};

const SECTIONS: { h: string; body: string }[] = [
  {
    h: "第1条（適用）",
    body: "本規約は、ぬのまる工房（以下「運営者」）が提供する「家謎」（以下「本サービス」）の利用に関する条件を、利用者と運営者との間で定めるものです。利用者は、本規約に同意のうえ本サービスを利用するものとします。",
  },
  {
    h: "第2条（アカウント）",
    body: "有料作品の利用にはアカウント登録が必要です。利用者は、自己の責任において登録情報を正確に登録し、適切に管理するものとします。アカウントの管理不十分により利用者が被った損害について、運営者は責任を負いません。",
  },
  {
    h: "第3条（購入・支払い）",
    body: "有料作品は買い切りです。価格・支払方法は各作品ページおよび特定商取引法に基づく表記に従います。決済はクレジットカード（Stripe）により行われ、決済の確定をもって利用権が付与されます。",
  },
  {
    h: "第4条（返金）",
    body: "デジタル商品の性質上、原則として返金はお受けできません。購入したのに作品が開けない等の技術的な提供不能の場合の取扱いを含め、詳細は特定商取引法に基づく表記をご確認ください。",
  },
  {
    h: "第5条（禁止事項）",
    body: "利用者は、作品データの複製・再配布・改変・解析、アクセス手段（アカウント・購入権）の第三者への共有・貸与・譲渡、その他本サービスの運営を妨げる行為を行ってはなりません。",
  },
  {
    h: "第6条（知的財産権）",
    body: "本サービスおよび各作品に関する著作権その他の知的財産権は、運営者または正当な権利者に帰属します。利用者は、私的な利用の範囲を超えてこれらを利用することはできません。",
  },
  {
    h: "第7条（免責）",
    body: "運営者は、本サービスが利用者の特定の目的に適合すること、不具合がないことを保証しません。通信環境や端末に起因する不具合、その他運営者の責めに帰さない事由により生じた損害について、運営者は責任を負いません。",
  },
  {
    h: "第8条（サービスの変更・中断）",
    body: "運営者は、利用者への事前の通知なく、本サービスの内容の変更・追加・中断・終了を行うことができるものとします。",
  },
  {
    h: "第9条（規約の変更）",
    body: "運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本ページに掲載した時点から効力を生じるものとします。",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading label="LEGAL" title="利用規約" />

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="font-bold tracking-wide sm:text-lg">{s.h}</h2>
            <p className="mt-2 text-sm leading-loose text-ienazo-ink-soft">{s.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-12 text-xs text-ienazo-ink-soft">制定日：2026年7月14日</p>
    </div>
  );
}
