import type { Metadata } from "next";
import Link from "next/link";
import { Stamp } from "@/components/decorations/Stamp";
import { EXTERNAL_LINKS } from "@/lib/external-links";

export const metadata: Metadata = {
  title: "About",
  description:
    "ぬのまるの実験工房は、AIを活用して制作したコンテンツを、実際に触れる形で公開していく場所です。",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section>
        <Stamp label="ABOUT" />
        <h1 className="mt-4 nl-heading-serif text-3xl font-bold sm:text-4xl">
          ぬのまるの実験工房について
        </h1>
      </section>

      <section className="space-y-5 text-base leading-relaxed text-ink-800">
        <p>
          ぬのまるの実験工房は、AIを活用して制作したコンテンツを、実際に触れる形で公開していく場所です。
        </p>
        <p>
          ここに置くのは、診断、ミニコンテンツ、Web実験などの「成果物」です。
          <br />
          制作の裏側、AI活用メモ、考えたことの記録は、noteで公開しています。
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="nl-plate">
            <p className="font-serif text-sm font-bold tracking-wider text-brass-700">WEB</p>
            <p className="mt-1 text-ink-900">Webサイトは触る場所。</p>
          </div>
          <div className="nl-plate">
            <p className="font-serif text-sm font-bold tracking-wider text-brass-700">NOTE</p>
            <p className="mt-1 text-ink-900">noteは読む場所。</p>
          </div>
        </div>

        <p>
          そんな役割分担で、AI時代の個人制作を少しずつ試していきます。
        </p>
      </section>

      <section className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/experiments" className="nl-btn">
          実験を見にいく
          <span aria-hidden>→</span>
        </Link>
        <a
          href={EXTERNAL_LINKS.note}
          target="_blank"
          rel="noopener noreferrer"
          className="nl-btn-ghost"
        >
          noteを見る ↗
        </a>
      </section>
    </div>
  );
}
