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

      <section className="space-y-6 text-base leading-relaxed" style={{ color: "var(--sys-text)" }}>
        <p>
          ぬのまる工房は、コンサルタントとして働くぬのまるが、AIを使って遊べるWebコンテンツを作る個人制作サイトです。
        </p>
        <p>
          コンサルの仕事では、ロジックが全てです。構造を整理して、論点を出して、数字で説明する。それはそれで大事なんですが、AIが当たり前になってくると、「整理するだけ」の価値はどんどん薄れていくな、とも感じています。
        </p>
        <p>
          じゃあ何が残るのかというと、<strong>「何を面白がれるか」</strong>だと思っていて。何をかわいいと思うか、何を不思議に思うか、何を人に届けたいか——そういう感性の部分は、AIにはまだ代替できない。
        </p>
        <p>
          だから、ロジックで働きながら、感性でものをつくる実験をしてみたくなりました。謎解きや占い・診断など、自分が「これ、面白くない？」と思ったアイデアをAIと一緒に形にしています。制作の裏側はnoteで発信しています。
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
