import type { ReactNode } from "react";

type Props = {
  /** 英字オーバーライン（例: "LEARN" / "PLAY"） */
  label: string;
  /** 日本語見出し */
  title: string;
  /** セクション番号（例: "01"）。左側に大きく表示。 */
  index?: string;
  /** 補足説明（任意） */
  description?: string;
  /** 見出し横に置くアクション（任意） */
  actions?: ReactNode;
  /** セクション本文 */
  children?: ReactNode;
  /** 識別用 id（アンカーに使用） */
  id?: string;
  /** 上罫線を消す（直前に divider がある場合など） */
  noTopRule?: boolean;
  className?: string;
};

/**
 * NieR:Automata のメニュー画面オマージュ。
 * - 左カラム: セクション番号 + 英字ラベル（HUD的）
 * - 右カラム: 日本語見出し → 説明 → アクション（縦積み）
 * 派手な装飾は避け、細罫線・短い縦線・小さな四角インジケータで構成。
 */
export function NunomaruMenuPanel({
  label,
  title,
  index,
  description,
  actions,
  children,
  id,
  noTopRule = false,
  className = "",
}: Props) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`animate-sys-fade-in scroll-mt-24 ${className}`}
    >
      {noTopRule ? null : <div className="sys-rule pt-6" />}

      <div className="relative grid gap-x-8 gap-y-4 py-7 sm:grid-cols-12">
        {/* 左カラム: インデックス番号 + ラベル */}
        <header className="relative sm:col-span-3 sm:pl-6">
          <span
            className="absolute left-0 top-0 hidden h-full w-px sm:block"
            style={{ backgroundColor: "var(--sys-line)" }}
            aria-hidden
          />
          <span
            className="absolute left-0 top-0 hidden h-10 w-px sm:block"
            style={{ backgroundColor: "var(--sys-accent)" }}
            aria-hidden
          />
          <div className="flex items-baseline gap-3 sm:flex-col sm:items-start sm:gap-4">
            {index ? (
              <span
                className="font-sans text-3xl font-bold leading-none tracking-tight sm:text-4xl"
                style={{ color: "var(--sys-text)" }}
                aria-hidden
              >
                {index}
              </span>
            ) : null}
            <p className="sys-eyebrow">{label}</p>
          </div>
        </header>

        {/* 右カラム: 見出し + 説明 + アクション */}
        <div className="relative sm:col-span-9">
          <span
            className="absolute -left-3 top-2 hidden h-2 w-2 sm:block"
            style={{ backgroundColor: "var(--sys-accent)" }}
            aria-hidden
          />
          <h2
            id={headingId}
            className="sys-heading text-2xl font-bold leading-tight sm:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p
              className="mt-3 text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--sys-text)" }}
            >
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </div>
      </div>

      {children ? <div className="mt-2">{children}</div> : null}
    </section>
  );
}
