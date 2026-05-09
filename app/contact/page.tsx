import type { Metadata } from "next";
import { Stamp } from "@/components/decorations/Stamp";
import { EXTERNAL_LINKS } from "@/lib/external-links";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "ぬのまるの実験工房へのお問い合わせ・ご感想は、note または X からご連絡ください。",
};

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section>
        <Stamp label="CONTACT" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold sm:text-4xl">お問い合わせ</h1>
      </section>

      <section className="space-y-4 text-base leading-relaxed text-ink-800">
        <p>
          ご意見・ご感想・お問い合わせは、note または X からご連絡ください。
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <a
          href={EXTERNAL_LINKS.x}
          target="_blank"
          rel="noopener noreferrer"
          className="nl-card flex items-center justify-between gap-4 transition hover:border-brass-600"
        >
          <div>
            <p className="font-serif text-xs tracking-[0.3em] text-brass-700">X</p>
            <p className="mt-1 font-serif text-lg font-bold text-ink-900">
              Xで連絡する
            </p>
          </div>
          <span aria-hidden className="text-brass-600">↗</span>
        </a>

        <a
          href={EXTERNAL_LINKS.note}
          target="_blank"
          rel="noopener noreferrer"
          className="nl-card flex items-center justify-between gap-4 transition hover:border-brass-600"
        >
          <div>
            <p className="font-serif text-xs tracking-[0.3em] text-brass-700">NOTE</p>
            <p className="mt-1 font-serif text-lg font-bold text-ink-900">
              noteで連絡する
            </p>
            <p className="mt-1 text-xs text-ink-700">
              制作ログ・AI活用メモはこちら。
            </p>
          </div>
          <span aria-hidden className="text-brass-600">↗</span>
        </a>
      </section>
    </div>
  );
}
