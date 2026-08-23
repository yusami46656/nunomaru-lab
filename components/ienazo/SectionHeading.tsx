import { Reveal } from "./Reveal";
import { MaskReveal } from "./MaskReveal";

/**
 * セクション見出し。
 * 英字ラベルは小さなサブ（eyebrow）、日本語見出しをロゴと同じ丸ゴシックで大きく主役に。
 * 日本語見出しはマスク・ワイプでせり上げる。
 *
 * as      … 見出しタグ。ページの主見出しに使うときは "h1"。既定は "h2"。
 * instant … 入場アニメを省く。ページ最上部で使うときに指定する。
 *           理由：Reveal も MaskReveal も「視界に入ったら出す」ので、初期表示で
 *           すでに見えている位置だと、ハイドレーションが終わるまで文字が出ない。
 *           スクロールしない場所では演出にならず、見出しが空のまま待たされるだけになる。
 */
export function SectionHeading({
  label,
  sub,
  title,
  description,
  as: Tag = "h2",
  instant = false,
}: {
  label: string; // 英字サブ "ABOUT"
  sub?: string; // "家謎" など
  title: React.ReactNode; // 大きく見せる日本語
  description?: React.ReactNode;
  as?: "h1" | "h2";
  instant?: boolean;
}) {
  const eyebrow = (
    <p className="flex items-center gap-3 text-sm font-bold tracking-[0.28em] text-ienazo-ink-soft sm:text-base">
      {/* 英字ラベル前のマーカーは赤に統一（全ページ共通） */}
      <span className="inline-block h-2 w-2 bg-ienazo-red" aria-hidden />
      {label}
      {sub && <span className="text-ienazo-ink-soft/70">／ {sub}</span>}
    </p>
  );

  const body = description && (
    <p className="mt-6 max-w-xl text-sm leading-loose text-ienazo-ink-soft sm:text-base">
      {description}
    </p>
  );

  return (
    <div>
      {/* 英字サブ（eyebrow） */}
      {instant ? eyebrow : <Reveal>{eyebrow}</Reveal>}

      {/* 日本語見出し（大・ロゴと同じ丸ゴシック最太・マスクワイプ） */}
      <Tag className="mt-4 text-3xl font-black leading-[1.18] tracking-wide text-ienazo-ink sm:text-5xl">
        {instant ? title : <MaskReveal>{title}</MaskReveal>}
      </Tag>

      {description && (instant ? body : <Reveal delay={150}>{body}</Reveal>)}
    </div>
  );
}
