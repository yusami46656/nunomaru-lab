import Image from "next/image";
import Link from "next/link";
import { ExperimentCard } from "@/components/ExperimentCard";
import { NunomaruMenuPanel } from "@/components/system/NunomaruMenuPanel";
import { fortuneTools } from "@/data/experiments";

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
              ひらめきを、形に。
            </p>
            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--sys-text)" }}>
              ぬのまる工房は、ぬのまるが作った小さなWebコンテンツを並べていく個人制作サイトです。
              謎解きや診断、ちょっとした試作品など、思いついたものを少しずつ形にしています。
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="#tools" className="sys-btn-primary">
                コンテンツを見る
                <span aria-hidden>→</span>
              </Link>
              <Link href="/ienazo" className="sys-btn-ghost">
                家謎で遊ぶ →
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
        id="ienazo"
        index="01"
        label="IENAZO"
        title="家謎"
        description="家謎は、おうちで気軽に遊べる謎解き・脱出ゲームです。あなたは物語の登場人物として、おうちのなかの世界をめぐりながら謎を解いていきます。無料体験から遊べます。"
        noTopRule
      >
        <Link
          href="/ienazo"
          className="sys-panel-flat group flex flex-col items-center gap-6 p-8 transition-colors hover:bg-[var(--sys-bg-soft)] sm:flex-row sm:justify-between"
          aria-label="家謎のサイトへ"
        >
          <Image
            src="/ienazo/logo_lockup.png"
            alt="家謎"
            width={1139}
            height={450}
            className="h-16 w-auto sm:h-20"
          />
          <span className="sys-btn-primary shrink-0">
            家謎を見る
            <span aria-hidden>→</span>
          </span>
        </Link>
      </NunomaruMenuPanel>

      <NunomaruMenuPanel
        id="fortune"
        index="02"
        label="FORTUNE"
        title="占い・診断"
        description="診断、タイプ分け、友人同士で話題にできるような小さなコンテンツを制作しています。"
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
        description="何を作り、どこで詰まり、何を考えたのか。各コンテンツの制作の裏側や試行錯誤を、これからまとめていく予定です。"
      >
        <div className="sys-panel-flat p-6 text-center text-sm" style={{ color: "var(--sys-text-muted)" }}>
          準備中です。
        </div>
      </NunomaruMenuPanel>

      <NunomaruMenuPanel
        id="about"
        index="04"
        label="ABOUT"
        title="About ぬのまる工房"
        description="ぬのまる工房は、ぬのまるが個人で作っている小さなコンテンツの置き場です。謎解きや診断、ちょっとしたWeb体験など、完成したものも構想中のものも、この場所に並べていきます。"
        actions={
          <Link href="/about" className="sys-btn-ghost">
            もっと詳しく →
          </Link>
        }
      />
    </div>
  );
}
