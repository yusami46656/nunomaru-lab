import type { Metadata } from "next";
import { SectionHeading } from "@/components/ienazo/SectionHeading";

export const metadata: Metadata = {
  title: "利用規約",
  description: "家謎の利用規約。",
};

// ※内容は仮。正式な規約で確定すること。
const SECTIONS: { h: string; body: string }[] = [
  { h: "第1条（適用）", body: "本規約は、家謎（以下「本サービス」）の利用に関する条件を、利用者と運営者との間で定めるものです。" },
  { h: "第2条（アカウント）", body: "有料作品の利用にはアカウント登録が必要です。利用者は登録情報を適切に管理するものとします。" },
  { h: "第3条（購入・支払い）", body: "有料作品は買い切りです。価格・支払方法は各作品ページおよび特定商取引法に基づく表記に従います。" },
  { h: "第4条（返金）", body: "デジタル商品の性質上、原則として返金はお受けできません。詳細は特定商取引法に基づく表記をご確認ください。" },
  { h: "第5条（禁止事項）", body: "作品データの複製・再配布・解析、アクセス手段の第三者への共有・譲渡を禁止します。" },
  { h: "第6条（免責）", body: "通信環境や端末に起因する不具合について、運営者は責任を負わない場合があります。" },
  { h: "第7条（規約の変更）", body: "運営者は、必要に応じて本規約を変更できるものとします。" },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading label="LEGAL" title="利用規約" />
      <p className="mt-6 text-xs text-ienazo-ink-soft">※ 本ページの内容は仮です。正式な規約で確定します。</p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="font-bold tracking-wide sm:text-lg">{s.h}</h2>
            <p className="mt-2 text-sm leading-loose text-ienazo-ink-soft">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
