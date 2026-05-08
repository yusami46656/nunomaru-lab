import Image from "next/image";
import Link from "next/link";
import { ExperimentCard } from "@/components/ExperimentCard";
import { Gear } from "@/components/decorations/Gear";
import { Stamp } from "@/components/decorations/Stamp";
import { experiments } from "@/data/experiments";
import { EXTERNAL_LINKS } from "@/lib/external-links";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative">
        <div className="pointer-events-none absolute -top-6 -right-2 hidden text-brass-500/30 sm:block" aria-hidden>
          <Gear className="h-28 w-28 animate-spin-slow" teeth={14} />
        </div>
        <div className="pointer-events-none absolute -bottom-10 left-2 hidden text-brass-500/20 sm:block" aria-hidden>
          <Gear className="h-20 w-20 animate-spin-slower" teeth={10} />
        </div>

        <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Stamp label="WORKSHOP / 実験工房" />
            <h1 className="mt-4 nl-heading-serif text-3xl font-bold leading-tight sm:text-5xl">
              ぬのまるの実験工房
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-800 sm:text-lg">
              AIで作った小さな企画を、実際に触れる形で実験的に公開していく工房です。
              <br />
              制作の裏側やAI活用メモはnoteで公開しています。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/experiments" className="nl-btn">
                公開中の実験を見る
                <span aria-hidden>→</span>
              </Link>
              <a
                href={EXTERNAL_LINKS.note}
                target="_blank"
                rel="noopener noreferrer"
                className="nl-btn-ghost"
              >
                noteで制作ログを読む ↗
              </a>
            </div>
          </div>

          <div className="pointer-events-none shrink-0 self-center sm:self-auto" aria-hidden>
            <Image
              src="/character/nunomaru-hero.png"
              alt="ぬのまる"
              width={220}
              height={225}
              className="drop-shadow-md"
              priority
            />
          </div>
        </div>
      </section>

      <div className="nl-divider">
        <span className="px-4 font-serif text-xs tracking-[0.3em]">EXPERIMENTS</span>
      </div>

      <section aria-labelledby="experiments-heading" className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 id="experiments-heading" className="nl-heading-serif text-2xl font-bold sm:text-3xl">
            実験一覧
          </h2>
          <Link href="/experiments" className="nl-link shrink-0 text-sm">
            一覧を見る →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {experiments.map((exp) => (
            <ExperimentCard key={exp.slug} experiment={exp} />
          ))}
        </div>
      </section>
    </div>
  );
}
