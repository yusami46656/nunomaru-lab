import type { Metadata } from "next";
import { EXTERNAL_LINKS } from "@/lib/external-links";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "ぬのまる工房へのお問い合わせ・ご感想は、note または X からご連絡ください。",
};

export default function ContactPage() {
  return (
    <div className="space-y-10 animate-sys-fade-in">
      <section className="space-y-3">
        <p className="sys-eyebrow">CONTACT</p>
        <h1 className="sys-heading text-3xl font-bold sm:text-4xl">お問い合わせ</h1>
      </section>

      <div className="sys-rule" />

      <section className="space-y-4 text-base leading-relaxed" style={{ color: "var(--sys-text)" }}>
        <p>
          ご意見・ご感想・お問い合わせは、note または X からご連絡ください。
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <a
          href={EXTERNAL_LINKS.x}
          target="_blank"
          rel="noopener noreferrer"
          className="sys-panel-flat flex items-center justify-between gap-4 p-5 transition hover:bg-[rgba(214,208,187,0.85)]"
        >
          <div>
            <p className="sys-eyebrow">X</p>
            <p className="mt-1 font-sans text-lg font-bold" style={{ color: "var(--sys-text)" }}>
              Xで連絡する
            </p>
          </div>
          <span aria-hidden style={{ color: "var(--sys-accent)" }}>↗</span>
        </a>

        <a
          href={EXTERNAL_LINKS.note}
          target="_blank"
          rel="noopener noreferrer"
          className="sys-panel-flat flex items-center justify-between gap-4 p-5 transition hover:bg-[rgba(214,208,187,0.85)]"
        >
          <div>
            <p className="sys-eyebrow">NOTE</p>
            <p className="mt-1 font-sans text-lg font-bold" style={{ color: "var(--sys-text)" }}>
              noteで連絡する
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--sys-text-muted)" }}>
              制作ログ・AI活用メモはこちら。
            </p>
          </div>
          <span aria-hidden style={{ color: "var(--sys-accent)" }}>↗</span>
        </a>
      </section>
    </div>
  );
}
