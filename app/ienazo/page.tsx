import Link from "next/link";
import Image from "next/image";
import { CoverFlow, type FlowItem } from "@/components/ienazo/CoverFlow";
import { SectionHeading } from "@/components/ienazo/SectionHeading";
import { Reveal } from "@/components/ienazo/Reveal";
import { MaskReveal } from "@/components/ienazo/MaskReveal";
import { WorkCard } from "@/components/ienazo/WorkCard";
import { SectionIcon } from "@/components/ienazo/SectionIcon";
import { CardSlider } from "@/components/ienazo/CardSlider";
import { GeoDecor } from "@/components/ienazo/GeoDecor"; // お試し装飾（削除可）
import { WORKS, FREE_TRIAL } from "@/data/ienazo/works";
import { ICONS } from "@/data/ienazo/icons";

const FLOW_ITEMS: FlowItem[] = WORKS.map((w) => ({
  image: w.comingSoon ? "" : w.cover, // 縦長3:4カバー。準備中は空＝プレースホルダ描画
  title: w.comingSoon ? "準備中" : w.title, // 準備中はタイトルを伏せる
  href: w.comingSoon ? "" : `/ienazo/works/${w.slug}`,
}));

const VALUES = [
  { icon: ICONS.aboutImmersive, title: "没入型の謎解き体験", body: "ストーリーのある没入型の謎解き・脱出ゲームです。" },
  { icon: ICONS.aboutHome, title: "おうちで完結", body: "移動やキット購入は不要。おうちのPCやスマホのブラウザだけで遊べます。" },
  { icon: ICONS.aboutTime, title: "選べる体験時間", body: "15分の手軽な謎解きから、2~3時間の本格謎解きまで、幅広くご用意しています。" },
];

const STEPS = [
  { n: "01", icon: ICONS.stepSelect, title: "作品を選ぶ", body: "好きな作品を選びます。（体験版の謎解きもご用意しています）" },
  { n: "02", icon: ICONS.stepPlay, title: "ブラウザで遊ぶ", body: "その場で物語が始まります。ヒントもあるので安心して遊んでいただけます。" },
  { n: "03", icon: ICONS.stepSave, title: "保存して再開", body: "アカウントログインで進捗が保存されます。どの端末でも続きからプレイ可能です。" },
];

const FAQ_EXCERPT = [
  { q: "本当に登録なしで遊べる？", a: "はい。無料体験は会員登録もメールも不要で、ブラウザでそのまま始められます。" },
  { q: "謎が難しすぎませんか？", a: "すべての作品にヒントがあります。行き詰まっても必ず前に進めるので、初めての方も安心です。" },
  { q: "スマホでも遊べる？", a: "遊べます。じっくり遊ぶならPC・タブレットを推奨していますが、スマホでもプレイ可能です。" },
];

/**
 * 家謎トップ（ダミーアセットでの全体実装）。
 * 白×黒×幾何学のギャラリー基調＋カバーフローのヒーロー。
 * 3レーン：①世界観理解 ②即体験 ③作品棚→購入。
 */
export default function IenazoTopPage() {
  return (
    <div>
      {/* ───────── ヒーロー：左ロゴ／右カバーフロー（黒背景・1画面） ───────── */}
      {/* -mt-16: ヘッダー(高さ16=64px)の下に潜らせ、透明ヘッダーを黒と同化させる */}
      {/* 全画面高。MORE は最下部に置き、次セクションは覗かせない */}
      <section className="relative isolate -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-ienazo-ink pt-16 text-white">
        {/* 微テクスチャ：黒ベタを“紙の上の黒”に寄せる（高級感） */}
        <span className="ienazo-grain" aria-hidden />
        {/* PCは従来どおり（左：ロゴ＋見出し／右：カバーフロー）。スマホだけ ロゴ→カバーフロー→見出し に並べ替える。
            ロゴは表示位置がSP/PCで違うため、SP用(最上部)とPC用(左カラム内)に分けて出し分ける。 */}
        <div className="mx-auto grid w-full max-w-6xl grow items-start gap-6 px-4 pb-12 pt-4 sm:gap-8 sm:px-6 sm:pt-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12 lg:py-12">
          {/* ① 家謎ロゴ（スマホ最上部のみ。PCでは非表示＝左カラム内のロゴを使う） */}
          <div className="order-1 lg:hidden">
            <Image
              src="/ienazo/logo_lockup.png"
              alt="家謎"
              width={1139}
              height={450}
              priority
              className="mx-auto h-24 w-auto invert sm:h-28"
            />
          </div>

          {/* ② カバーフロー（スマホ中段 / PC右カラム） */}
          <div className="order-2 lg:order-2">
            <CoverFlow items={FLOW_ITEMS} />
          </div>

          {/* ③ 左カラム：ロゴ(PCのみ)＋コンセプト＋CTA（スマホ下段 / PC左カラム） */}
          <div className="order-3 text-center lg:order-1 lg:text-left">
            <Image
              src="/ienazo/logo_lockup.png"
              alt="家謎"
              width={1139}
              height={450}
              priority
              className="hidden h-36 w-auto invert lg:block"
            />
            <h1 className="text-2xl font-bold tracking-[0.02em] sm:text-3xl lg:mt-7">
              おうちで気軽に、謎解きを
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base lg:mx-0">
              家謎は、おうちで遊べる謎解き・脱出ゲームです。物語の世界に入り込みながら謎解きをお楽しみいただけます。{/* 仮コピー */}
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href={`/ienazo/works/${FREE_TRIAL.slug}`}
                className="inline-flex items-center justify-center bg-ienazo-red px-7 py-3.5 font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
              >
                無料で体験する
              </Link>
              <Link
                href="#works"
                className="inline-flex items-center justify-center border border-white/40 px-7 py-3.5 font-medium tracking-wide text-white transition-colors hover:bg-white/10"
              >
                作品を見る
              </Link>
            </div>
            <p className="mt-4 text-xs tracking-wide text-white/55">＊ 無料体験は登録不要</p>
          </div>
        </div>

        {/* スクロール誘導（More 》） */}
        <a
          href="#about"
          aria-label="下のセクションへ"
          className="relative z-10 mx-auto mb-6 flex shrink-0 flex-col items-center gap-1.5 text-white/55 transition-colors hover:text-white"
        >
          <span className="text-[10px] tracking-[0.4em]">MORE</span>
          <span className="ienazo-scrollcue inline-block leading-none" aria-hidden>
            <span className="inline-block rotate-90 text-base font-bold leading-none">》</span>
          </span>
        </a>
      </section>

      {/* ───────── ① ABOUT：世界観理解 ───────── */}
      <section id="about" className="relative mx-auto max-w-6xl scroll-mt-16 overflow-hidden px-4 py-28 sm:px-6 sm:py-40">
        {/* GEO-DECOR お試し装飾（削除可） */}
        <GeoDecor variant="b" className="hidden -right-10 top-8 origin-top-right sm:block sm:scale-75 lg:scale-100" />
        <SectionHeading
          label="ABOUT"
          title={<>物語に入り込みながら、<br className="hidden sm:block" />謎を解く</>}
          description="家謎は、おうちで気軽に遊べる謎解き・脱出ゲームです。あなたは物語の登場人物として、おうちのなかの世界をめぐりながら謎を解いていきます。"
        />

        {/* 3つの価値（スマホ＝ページめくり／PC＝白カード3列） */}
        <Reveal>
          <div className="mt-16">
            <CardSlider>
              {VALUES.map((v) => (
                <div key={v.title} className="h-full border border-ienazo-rule bg-ienazo-paper-soft p-7 sm:p-8">
                  <h3 className="text-xl font-bold tracking-wide sm:text-2xl">{v.title}</h3>
                  <span className="mt-4 block h-0.5 w-10 bg-ienazo-red" aria-hidden />
                  <SectionIcon src={v.icon} fallback="keyhole" className="mx-auto my-7 h-44 w-44 text-ienazo-ink sm:h-56 sm:w-56" />
                  <p className="text-sm leading-loose text-ienazo-ink-soft">{v.body}</p>
                </div>
              ))}
            </CardSlider>
          </div>
        </Reveal>
      </section>

      {/* ───────── ② 無料体験（最重要CV・全幅の赤バンド＝①プラン。CV領域は静かに＝装飾なし） ───────── */}
      <section id="free-trial" className="relative overflow-hidden bg-ienazo-maroon text-white">
        {/* 微テクスチャ：マロンのベタ面を布目のように沈める */}
        <span className="ienazo-grain" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-24 sm:px-6 sm:py-32 md:grid-cols-[auto_1fr] md:gap-14">
          {/* ポスター（額装・ダミー画像は押せない）。他セクションと揃えて左寄せ */}
          <Reveal>
            <div className="mx-auto block aspect-[3/4] w-60 border border-white/30 shadow-ienazo-card sm:w-72 md:mx-0 lg:w-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FREE_TRIAL.cover} alt={`${FREE_TRIAL.title}（無料体験）`} className="h-full w-full object-cover" draggable={false} />
            </div>
          </Reveal>

          {/* テキスト＋ベネフィット＋CTA（左揃え） */}
          <div className="text-left">
            <Reveal>
              <p className="flex items-center justify-start gap-3 text-sm font-bold tracking-[0.28em] text-white/85 sm:text-base">
                <span className="inline-block h-2 w-2 bg-white" aria-hidden />
                FREE TRIAL
              </p>
            </Reveal>
            <h2 className="mt-4 text-3xl font-black leading-[1.18] tracking-wide sm:text-4xl">
              <MaskReveal>まずは、登録なしで</MaskReveal>
            </h2>
            <Reveal delay={120}>
              <p className="mt-5 max-w-md text-sm leading-loose text-white/85 [word-break:keep-all] sm:text-base">
                <span className="whitespace-nowrap">無料体験『{FREE_TRIAL.title}』</span>は、
                <span className="whitespace-nowrap">約{FREE_TRIAL.minutes}分でひと巡りできる</span>最初の一篇。
                <wbr />会員登録もメールも不要です。
              </p>
            </Reveal>

            {/* 安心のベネフィット（買う前の不安潰し） */}
            <Reveal delay={180}>
              <ul className="mt-7 inline-block space-y-3 text-left text-sm sm:text-base">
                {[
                  "会員登録・メール不要。ブラウザですぐ開始",
                  `所要 約${FREE_TRIAL.minutes}分。スキマ時間で遊べる`,
                  "ヒントつきだから、行き詰まらない",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-white" aria-hidden />
                    <span className="text-white">{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-start">
                <Link
                  href={`/ienazo/works/${FREE_TRIAL.slug}`}
                  className="inline-flex items-center justify-center bg-white px-8 py-4 font-bold tracking-wide text-ienazo-ink transition-colors hover:bg-white/90"
                >
                  無料で遊んでみる
                </Link>
                <span className="text-xs tracking-wide text-white/70">＊ 登録不要・所要 約{FREE_TRIAL.minutes}分</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── ③ 作品棚（Works）→ 購入入口 ───────── */}
      <section id="works" className="scroll-mt-16">
        {/* 作品まわり（CV領域）は静かに＝装飾なし */}
        <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-40">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            label="WORKS"
            title="家謎の作品一覧"
            description="世界観で選ぶもよし、体験時間で選ぶもよし。気になった物語から、どうぞ。"
          />
          <Reveal>
            <Link
              href="/ienazo/works"
              className="hidden shrink-0 border border-ienazo-rule px-5 py-2.5 text-sm font-medium tracking-wide transition-colors hover:bg-ienazo-ink hover:text-ienazo-paper sm:inline-block"
            >
              すべて見る →
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {WORKS.map((w, i) => (
            <Reveal key={w.slug} delay={i * 70}>
              <WorkCard work={w} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <Link
            href="/ienazo/works"
            className="inline-block border border-ienazo-rule px-5 py-2.5 text-sm font-medium tracking-wide"
          >
            すべて見る →
          </Link>
        </div>
        </div>
      </section>

      {/* ───────── ④ 遊び方 3ステップ（大きな番号＋接続線のステッパー） ───────── */}
      <section className="relative overflow-hidden bg-ienazo-paper-deep">
        {/* GEO-DECOR お試し装飾（削除可） */}
        <GeoDecor variant="c" className="hidden -left-14 top-16 origin-top-left sm:block sm:scale-75 lg:scale-100" />
        <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-40">
          <SectionHeading label="HOW TO PLAY" title="遊び方は、3ステップ" />
          <Reveal>
            <div className="mt-12">
              <CardSlider>
                {STEPS.map((s) => (
                  <div key={s.n} className="h-full border border-ienazo-rule bg-ienazo-paper-soft p-7 sm:p-8">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold leading-none tracking-tight text-ienazo-ink sm:text-5xl">
                        {s.n}
                      </span>
                      <span className="h-px flex-1 bg-ienazo-rule" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold tracking-wide sm:text-2xl">{s.title}</h3>
                    <SectionIcon src={s.icon} fallback="none" className="mx-auto mt-5 h-40 w-40 text-ienazo-ink sm:h-52 sm:w-52" />
                    <p className="mt-4 text-sm leading-relaxed text-ienazo-ink-soft">{s.body}</p>
                  </div>
                ))}
              </CardSlider>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12">
              <Link href="/ienazo/howto" className="text-sm font-medium tracking-wide text-ienazo-ink hover:text-ienazo-red">
                遊び方をもっと詳しく →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── ⑤ はじめての方へ / FAQ抜粋（大きなQ・罫線リスト） ───────── */}
      <section className="relative overflow-hidden">
        {/* GEO-DECOR お試し装飾（削除可） */}
        <GeoDecor variant="b" className="hidden -bottom-12 -right-16 origin-bottom-right sm:block sm:scale-75 lg:scale-100" />
        <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-40">
        <SectionHeading label="FAQ" title="はじめての方へ" />
        <div className="mt-12 border-t border-ienazo-rule">
          {FAQ_EXCERPT.map((f, i) => (
            <Reveal key={f.q} delay={i * 80}>
              <div className="border-b border-ienazo-rule py-7">
                <div className="flex items-start gap-4 sm:gap-5">
                  <span className="w-5 shrink-0 text-xl font-bold leading-7 text-ienazo-red">Q</span>
                  <p className="font-bold leading-7 tracking-wide sm:text-lg">{f.q}</p>
                </div>
                <div className="mt-3 flex items-start gap-4 sm:gap-5">
                  <span className="w-5 shrink-0 text-xl font-bold leading-7 text-ienazo-ink-soft">A</span>
                  <p className="text-sm leading-7 text-ienazo-ink-soft">{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={100}>
          <div className="mt-10">
            <Link href="/ienazo/faq" className="text-sm font-medium tracking-wide text-ienazo-ink hover:text-ienazo-red">
              よくある質問をすべて見る →
            </Link>
          </div>
        </Reveal>
        </div>
      </section>
    </div>
  );
}
