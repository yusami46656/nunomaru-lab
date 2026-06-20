import { Reveal } from "./Reveal";
import { MaskReveal } from "./MaskReveal";

/**
 * セクション見出し。
 * 英字ラベルは小さなサブ（eyebrow）、日本語見出しをロゴと同じ丸ゴシックで大きく主役に。
 * 日本語見出しはマスク・ワイプでせり上げる。
 */
export function SectionHeading({
  label,
  sub,
  title,
  description,
}: {
  label: string; // 英字サブ "ABOUT"
  sub?: string; // "家謎" など
  title: React.ReactNode; // 大きく見せる日本語
  description?: React.ReactNode;
}) {
  return (
    <div>
      {/* 英字サブ（eyebrow） */}
      <Reveal>
        <p className="flex items-center gap-3 text-sm font-bold tracking-[0.28em] text-ienazo-ink-soft sm:text-base">
          {/* 【#2試作】赤の反復を抑え、マーカーはインク色に。赤はCTA/無料体験帯へ集中 */}
          <span className="inline-block h-2 w-2 bg-ienazo-ink" aria-hidden />
          {label}
          {sub && <span className="text-ienazo-ink-soft/70">／ {sub}</span>}
        </p>
      </Reveal>

      {/* 日本語見出し（大・ロゴと同じ丸ゴシック最太・マスクワイプ） */}
      <h2 className="mt-4 text-3xl font-black leading-[1.18] tracking-wide text-ienazo-ink sm:text-5xl">
        <MaskReveal>{title}</MaskReveal>
      </h2>

      {description && (
        <Reveal delay={150}>
          <p className="mt-6 max-w-xl text-sm leading-loose text-ienazo-ink-soft sm:text-base">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
