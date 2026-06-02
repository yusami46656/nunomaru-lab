import type { Metadata } from "next";
import Link from "next/link";
import { EXTERNAL_LINKS } from "@/lib/external-links";

export const metadata: Metadata = {
  title: "About",
  description:
    "ぬのまる工房は、ぬのまるがAIを使って作ったコンテンツを公開する個人制作サイトです。",
};

export default function AboutPage() {
  return (
    <div className="space-y-10 animate-sys-fade-in">
      <section className="space-y-3">
        <p className="sys-eyebrow">ABOUT</p>
        <h1 className="sys-heading text-3xl font-bold sm:text-4xl">
          About ぬのまる工房
        </h1>
      </section>

      <div className="sys-rule" />

      <section className="space-y-6 text-base leading-relaxed" style={{ color: "var(--sys-text)" }}>
        <p>
          ぬのまる工房は、ぬのまるがAIを使って作ったコンテンツを公開する個人制作サイトです。
        </p>
        <p>
          普段は会社員として働いています。仕事とは別に、「これ、面白くない？」と思ったアイデアをAIと一緒に形にして、ここに並べています。
        </p>
        <p>
          謎解きや占い・診断など、思いついたものを少しずつ作っています。制作の裏側はnoteで発信しています。
        </p>
      </section>

      <section className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/#tools" className="sys-btn-primary">
          コンテンツを見にいく
          <span aria-hidden>→</span>
        </Link>
        <a
          href={EXTERNAL_LINKS.note}
          target="_blank"
          rel="noopener noreferrer"
          className="sys-btn-ghost"
        >
          noteを読む ↗
        </a>
        <a
          href={EXTERNAL_LINKS.x}
          target="_blank"
          rel="noopener noreferrer"
          className="sys-btn-ghost"
        >
          Xをフォロー ↗
        </a>
      </section>
    </div>
  );
}
