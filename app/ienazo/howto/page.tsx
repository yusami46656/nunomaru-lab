import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ienazo/SectionHeading";
import { Reveal } from "@/components/ienazo/Reveal";
import { FREE_TRIAL } from "@/data/ienazo/works";
import { ICONS } from "@/data/ienazo/icons";
import { SectionIcon } from "@/components/ienazo/SectionIcon";

export const metadata: Metadata = {
  title: "遊び方",
  description: "家謎の遊び方。ブラウザで作品を選び、物語に入り込みながら謎を解きます。無料体験は登録不要、有料作品はログインで進捗を保存できます。",
};

const STEPS = [
  { n: "01", icon: ICONS.stepSelect, title: "作品を選ぶ", body: "無料体験、または好きな作品を選びます。" },
  { n: "02", icon: ICONS.stepPlay, title: "ブラウザで遊ぶ", body: "その場で物語が始まります。ヒントもあるので、行き詰まっても大丈夫。" },
  { n: "03", icon: ICONS.stepSave, title: "保存して再開", body: "有料作品はログインで進捗を保存。どの端末でも続きから遊べます。" },
];

export default function HowToPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        label="HOW TO PLAY"
        title="家謎の遊び方"
        description="家謎は、おうちで気軽に遊べる謎解き・脱出ゲームです。アプリは不要。ブラウザだけで、すぐに始められます。"
      />

      {/* 3ステップ */}
      <Reveal>
        <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-ienazo-rule sm:overflow-visible sm:pb-0">
          {STEPS.map((s) => (
            <div key={s.n} className="w-[80%] shrink-0 snap-start sm:w-auto">
              <div className="px-0 py-6 sm:px-8">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold leading-none tracking-tight sm:text-5xl">{s.n}</span>
                  <span className="h-px flex-1 bg-ienazo-rule" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-wide">{s.title}</h3>
                <SectionIcon src={s.icon} fallback="none" className="mx-auto mt-5 h-16 w-16 text-ienazo-ink" />
                <p className="mt-4 text-sm leading-relaxed text-ienazo-ink-soft">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 無料と有料のちがい */}
      <div className="mt-16">
        <Reveal>
          <h2 className="text-xl font-bold tracking-wide sm:text-2xl">無料体験と有料作品のちがい</h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <Reveal>
            <div className="h-full border border-ienazo-rule bg-ienazo-paper-soft p-6 sm:p-7">
              <p className="text-sm font-bold tracking-[0.2em] text-ienazo-red">無料体験</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ienazo-ink">
                <li>・登録不要。ブラウザですぐ開始</li>
                <li>・進捗はこの端末・ブラウザ内に保存</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full border border-ienazo-rule bg-ienazo-paper-soft p-6 sm:p-7">
              <p className="text-sm font-bold tracking-[0.2em] text-ienazo-red">有料作品</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ienazo-ink">
                <li>・購入後、ログインして遊ぶ</li>
                <li>・進捗はアカウントに保存。どの端末でも再開できます</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 必要なもの・安心 */}
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="text-xl font-bold tracking-wide sm:text-2xl">遊ぶのに必要なもの</h2>
            <p className="mt-4 text-sm leading-loose text-ienazo-ink-soft">
              🖥 PC・タブレット推奨（スマホも可）／ 🌐 ブラウザ／ ✏ 紙とペンがあると便利。特別な準備は要りません。
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div>
            <h2 className="text-xl font-bold tracking-wide sm:text-2xl">行き詰まっても大丈夫</h2>
            <p className="mt-4 text-sm leading-loose text-ienazo-ink-soft">
              すべての作品にヒントがあります。詰まっても前に進めるので、謎解きが初めての方も安心して遊べます。
            </p>
          </div>
        </Reveal>
      </div>

      {/* CTA */}
      <Reveal delay={120}>
        <div className="mt-16">
          <Link
            href={FREE_TRIAL.playUrl}
            className="inline-flex items-center justify-center bg-ienazo-red px-8 py-4 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
          >
            無料で体験してみる
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
