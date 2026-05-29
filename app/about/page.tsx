import type { Metadata } from "next";
import Link from "next/link";
import { EXTERNAL_LINKS } from "@/lib/external-links";

export const metadata: Metadata = {
  title: "About",
  description:
    "ぬのまる工房は、ぬのまるがAIを使って小さなWebツールやコンテンツを作る個人制作サイトです。",
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

      <section className="space-y-5 text-base leading-relaxed" style={{ color: "var(--sys-text)" }}>
        <p>
          ぬのまる工房は、ぬのまるがAIを使って小さなWebツールやコンテンツを作る個人制作サイトです。
        </p>
        <p>
          学びたいけど少し難しいもの、思いついたけど形にする機会がなかった小ネタを、AIの力を借りながら少しずつ形にしています。
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sys-panel-flat px-5 py-4">
            <p className="sys-eyebrow">LEARN</p>
            <p className="mt-1.5 font-bold" style={{ color: "var(--sys-text)" }}>
              学びの道具をつくる。
            </p>
          </div>
          <div className="sys-panel-flat px-5 py-4">
            <p className="sys-eyebrow">PLAY</p>
            <p className="mt-1.5 font-bold" style={{ color: "var(--sys-text)" }}>
              遊びの道具をつくる。
            </p>
          </div>
        </div>

        <p className="text-sm" style={{ color: "var(--sys-text-muted)" }}>
          普段は会社員として働きながら、AIを使った個人制作に取り組んでいます。
          制作の裏側や試行錯誤は、noteの「制作ログ」にまとめています。
        </p>
      </section>

      <section className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/#tools" className="sys-btn-primary">
          道具を見にいく
          <span aria-hidden>→</span>
        </Link>
        <a
          href={EXTERNAL_LINKS.note}
          target="_blank"
          rel="noopener noreferrer"
          className="sys-btn-ghost"
        >
          noteで制作ログを読む ↗
        </a>
      </section>
    </div>
  );
}
