import Image from "next/image";
import Link from "next/link";
import { ExperimentCard } from "@/components/ExperimentCard";
import { NunomaruMenuPanel } from "@/components/system/NunomaruMenuPanel";
import { mysteryTools, fortuneTools } from "@/data/experiments";

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
              AIとつくる、おもちゃ箱
            </p>
            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--sys-text)" }}>
              ぬのまる工房は、AIを使って作ったコンテンツを並べる個人制作サイトです。
              謎解きや占い・診断など、思いついたアイデアをAIと一緒に形にしています。
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="#tools" className="sys-btn-primary">
                コンテンツを見る
                <span aria-hidden>→</span>
              </Link>
              <Link href="/contents" className="sys-btn-ghost">
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
        <span className="sys-divider-label" style={{ color: "var(--sys-text)" }}>CONTENTS</span>
        <span className="text-[10px] uppercase tracking-[0.32em]" style={{ color: "var(--sys-text-muted)" }}>
          04 ITEMS
        </span>
      </div>

      <NunomaruMenuPanel
        id="mystery"
        index="01"
        label="MYSTERY"
        title="謎解き"
        description="閃き、推理、発見の楽しさを詰め込んだ謎解きコンテンツです。現在、第一弾を構想中です。"
        noTopRule
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {mysteryTools.map((tool) => (
            <ExperimentCard key={tool.slug} experiment={tool} />
          ))}
        </div>
      </NunomaruMenuPanel>

      <NunomaruMenuPanel
        id="fortune"
        index="02"
        label="FORTUNE"
        title="占い・診断"
        description="診断、タイプ分け、友人同士で遊べるコンテンツなど、思いついた小さなアイデアを気軽に形にしています。"
      >
        {fortuneTools.length === 0 ? (
          <div className="sys-panel-flat p-6 text-center text-sm" style={{ color: "var(--sys-text-muted)" }}>
            準備中です。
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {fortuneTools.map((tool) => (
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
          <Link href="/contents" className="sys-btn-primary">
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
        description="ぬのまる工房は、ぬのまるがAIを使って作ったコンテンツを公開する個人制作サイトです。謎解きや占い・診断など、思いついたアイデアをAIと一緒に形にしています。"
        actions={
          <Link href="/about" className="sys-btn-ghost">
            もっと詳しく →
          </Link>
        }
      />
    </div>
  );
}
