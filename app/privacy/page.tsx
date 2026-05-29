import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ぬのまる工房におけるアクセス解析・広告配信・Cookieの利用方針について記載したプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <article className="space-y-8 animate-sys-fade-in">
      <header className="space-y-2">
        <p className="sys-eyebrow">PRIVACY POLICY</p>
        <h1 className="sys-heading text-3xl font-bold sm:text-4xl">
          プライバシーポリシー
        </h1>
        <p className="text-sm" style={{ color: "var(--sys-text-muted)" }}>
          最終更新日: 2026年5月
        </p>
      </header>

      <div className="sys-rule" />

      <section className="space-y-3">
        <h2 className="sys-heading text-xl font-bold">1. 個人情報の取り扱いについて</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          ぬのまる工房(以下「当サイト」)は、利用者の個人情報の重要性を認識し、適切に取り扱うよう努めます。当サイトは原則として、利用者の氏名・住所・電話番号・メールアドレス等の個人情報を取得することはありません。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="sys-heading text-xl font-bold">2. アクセス解析ツールについて</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          当サイトでは、サイト利用状況の把握とコンテンツ改善のため、Google LLC の提供するアクセス解析ツール「Google Analytics」を利用する場合があります。Google Analytics は Cookie を使用して、個人を特定する情報を含まない形で利用者の行動データを収集します。
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          収集されたデータは Google 社のプライバシーポリシーに基づき管理されます。利用者はブラウザ設定により Cookie を無効化することで、データの収集を拒否することができます。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="sys-heading text-xl font-bold">3. 広告配信について</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          当サイトは、第三者配信の広告サービス(Google AdSense 等)を利用する場合があります。これらの広告配信事業者は、利用者の興味に応じた広告を表示するために、Cookie を使用して当サイトや他のサイトへのアクセス情報を取得することがあります。
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          利用者は、Google の広告設定ページからパーソナライズ広告を無効化することができます。第三者配信事業者の Cookie 利用については、それぞれの事業者のプライバシーポリシーをご確認ください。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="sys-heading text-xl font-bold">4. Cookie について</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          Cookie とは、Web サイトを訪問した際に利用者のデバイスに保存される小さなテキストデータです。当サイトでは、アクセス解析・広告配信のために Cookie を利用する場合があります。
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          利用者はブラウザの設定により、Cookie の受け入れを拒否したり、保存された Cookie を削除したりすることができます。ただし、Cookie を無効化した場合、当サイトの一部機能が正常に動作しないことがあります。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="sys-heading text-xl font-bold">5. 免責事項</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          当サイトに掲載された情報の正確性には十分注意を払っていますが、その内容について保証するものではありません。当サイトの利用によって生じた損害について、当サイト運営者は一切の責任を負いかねます。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="sys-heading text-xl font-bold">6. プライバシーポリシーの変更</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text)" }}>
          当サイトは、必要に応じて本プライバシーポリシーの内容を変更することがあります。変更後の内容は当ページに掲載した時点から効力を生じるものとします。
        </p>
      </section>
    </article>
  );
}
