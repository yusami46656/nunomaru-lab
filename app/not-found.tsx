import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-8 py-6 animate-sys-fade-in">
      <section className="space-y-3">
        <p className="sys-eyebrow">404 / NOT FOUND</p>
        <h1 className="sys-heading text-3xl font-bold sm:text-4xl">
          ページが見つかりませんでした
        </h1>
        <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--sys-text)" }}>
          お探しのページは移動・削除されたか、URL が間違っている可能性があります。
        </p>
      </section>

      <div className="sys-rule" />

      <section className="flex flex-wrap items-center gap-3">
        <Link href="/" className="sys-btn-primary">
          トップへ戻る
          <span aria-hidden>→</span>
        </Link>
        <Link href="/tools" className="sys-btn-ghost">
          制作ログへ
        </Link>
      </section>
    </div>
  );
}
