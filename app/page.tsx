import Image from "next/image";
import Link from "next/link";
import { ExperimentCard } from "@/components/ExperimentCard";
import { NunomaruMenuPanel } from "@/components/system/NunomaruMenuPanel";
import { learnTools, playTools } from "@/data/experiments";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="animate-sys-fade-in relative">
        <div className="grid gap-8 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-8 space-y-5">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--sys-text-muted)" }}>
              <span className="sys-marker" aria-hidden />
              <span>NUNOMARU LABO</span>
              <span className="opacity-50">·</span>
              <span>INDEX // 00</span>
            </div>
            <h1
              className="sys-heading text-3xl font-bold leading-tight sm:text-5xl"
              style={{ letterSpacing: "0.06em" }}
            >
              ぬのまる工房
            </h1>
            <p
              className="text-lg font-medium leading-relaxed sm:text-2xl"
              style={{ color: "var(--sys-text)", letterSpacing: "0.02em" }}
            >
              AIでつくる、学びと遊びの小さな道具箱
            </p>
            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--sys-text)" }}>
              ぬのまる工房は、AIを使って作った小さなWebツールやコンテンツを並べる場所です。
              世界史・神話・哲学などを楽しく学ぶための道具や、診断・クイズなど気軽に遊べるコンテンツを制作しています。
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="#tools" className="sys-btn-primary">
                道具を見る
                <span aria-hidden>→</span>
              </Link>
              <Link href="/tools" className="sys-btn-ghost">
                制作ログを読む →
              </Link>
            </div>
          </div>

          <div className="sm:col-span-4 flex justify-center sm:justify-end" aria-hidden>
            <Image
              src="/character/nunomaru-hero.png"
              alt="ぬのまる"
              width={280}
              height={287}
              className="opacity-90 w-[200px] h-auto sm:w-[280px]"
              priority
            />
          </div>
        </div>
      </section>

      <div id="tools" className="sys-section-bar">
        <span className="sys-divider-label" style={{ color: "var(--sys-text)" }}>TOOLS</span>
        <span className="text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--sys-text-muted)" }}>
          04 ITEMS
        </span>
      </div>

      <NunomaruMenuPanel
        id="learn"
        index="01"
        label="LEARN"
        title="学びの道具"
        description="世界史・神話・哲学など、面白いけれど少しとっつきにくいテーマを、Webならではの形で学びやすくするための道具です。"
        noTopRule
      >
        {learnTools.length === 0 ? (
          <div className="sys-panel-flat p-6 text-center text-sm" style={{ color: "var(--sys-text-muted)" }}>
            準備中です。
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {learnTools.map((tool) => (
              <ExperimentCard key={tool.slug} experiment={tool} />
            ))}
          </div>
        )}
      </NunomaruMenuPanel>

      <NunomaruMenuPanel
        id="play"
        index="02"
        label="PLAY"
        title="遊びの道具"
        description="診断、クイズ、友人同士で遊べるネタ系コンテンツなど、思いついた小さなアイデアを気軽に形にした道具です。"
      >
        {playTools.length === 0 ? (
          <div className="sys-panel-flat p-6 text-center text-sm" style={{ color: "var(--sys-text-muted)" }}>
            準備中です。
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {playTools.map((tool) => (
              <ExperimentCard key={tool.slug} experiment={tool} />
            ))}
          </div>
        )}
      </NunomaruMenuPanel>

      <NunomaruMenuPanel
        id="making-note"
        index="03"
        label="MAKING NOTE"
        title="制作ログ"
        description="AIで何を作り、どこで詰まり、何を考えたのか。制作の裏側や試行錯誤はnoteにまとめています。"
        actions={
          <Link href="/tools" className="sys-btn-primary">
            制作ログを読む
            <span aria-hidden>→</span>
          </Link>
        }
      />

      <NunomaruMenuPanel
        id="about"
        index="04"
        label="ABOUT"
        title="About ぬのまる工房"
        description="ぬのまる工房は、ぬのまるがAIを使って小さなWebツールやコンテンツを作る個人制作サイトです。学びたいけど少し難しいもの、思いついたけど形にする機会がなかった小ネタを、AIの力を借りながら少しずつ形にしています。"
        actions={
          <Link href="/about" className="sys-btn-ghost">
            もっと詳しく →
          </Link>
        }
      />
    </div>
  );
}
