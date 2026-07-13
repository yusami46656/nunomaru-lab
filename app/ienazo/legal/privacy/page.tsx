import type { Metadata } from "next";
import { SectionHeading } from "@/components/ienazo/SectionHeading";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "家謎のプライバシーポリシー。取得する情報・利用目的・第三者提供について記載しています。",
  robots: { index: false, follow: false },
};

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "第1条（事業者）",
    body: "本サービス「家謎」は、ぬのまる工房（以下「当方」）が運営しています。当方は、利用者の個人情報の重要性を認識し、適切に取り扱います。",
  },
  {
    h: "第2条（取得する情報）",
    body: "当方は、本サービスの提供にあたり、次の情報を取得します。①アカウント登録時のメールアドレス、②有料作品の購入・利用履歴および進捗データ、③お問い合わせの際にご提供いただく情報、④アクセス解析・広告配信に伴う Cookie 等の情報。なお、クレジットカード番号等の決済情報は決済代行事業者（Stripe）が取得・管理し、当方は保持しません。",
  },
  {
    h: "第3条（利用目的）",
    body: "取得した情報は、①本サービスの提供・本人確認・購入作品の利用権管理、②お問い合わせへの対応、③不正利用の防止、④サービスの維持・改善およびご案内のために利用します。",
  },
  {
    h: "第4条（第三者提供・委託）",
    body: "当方は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。ただし、決済処理のため Stripe（Stripe, Inc. および関連会社）へ、認証・データ保管のため当方が利用するクラウドサービスへ、必要な範囲で取扱いを委託します。これらの事業者は各社のプライバシーポリシーに基づき情報を管理します。",
  },
  {
    h: "第5条（決済について）",
    body: "有料作品の決済は Stripe を通じて行われます。カード情報は Stripe に直接送信され、当方のサーバーを経由しません。Stripe における情報の取扱いは、Stripe のプライバシーポリシーに従います。",
  },
  {
    h: "第6条（アクセス解析・広告・Cookie）",
    body: "当方は、利用状況の把握・改善のため Google Analytics 等のアクセス解析ツールを、また第三者配信の広告サービスを利用する場合があります。これらは Cookie を使用して、個人を特定しない形で行動データを収集することがあります。利用者はブラウザ設定により Cookie を無効化できます。",
  },
  {
    h: "第7条（情報の管理・開示・訂正・削除）",
    body: "当方は、取得した個人情報を適切に管理し、漏えい・滅失・毀損の防止に努めます。ご本人から、保有する個人情報の開示・訂正・利用停止・削除のご請求があった場合は、本人確認のうえ、法令に従い遅滞なく対応します。",
  },
  {
    h: "第8条（お問い合わせ窓口）",
    body: (
      <>
        個人情報の取扱いに関するお問い合わせは、次の連絡先までお願いいたします。
        <br />
        ぬのまる工房（家謎 運営）／ nunomaru0x0u@gmail.com
      </>
    ),
  },
  {
    h: "第9条（本ポリシーの変更）",
    body: "当方は、必要に応じて本ポリシーを変更することがあります。変更後の内容は、本ページに掲載した時点から効力を生じるものとします。",
  },
];

export default function IenazoPrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading label="LEGAL" title="プライバシーポリシー" />

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
