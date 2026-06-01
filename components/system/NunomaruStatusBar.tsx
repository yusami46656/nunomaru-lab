type Props = {
  items?: string[];
  className?: string;
};

const DEFAULT_ITEMS = [
  "NUNOMARU LABO",
  "SYS // 001",
  "LEARN / PLAY",
  "v 2026.05",
];

/**
 * NieR メニュー上部の HUD ライン風の細いステータスバー。
 * 細罫線で挟み、英字＋ドット区切りで「システム情報」感を出す。
 */
export function NunomaruStatusBar({ items = DEFAULT_ITEMS, className = "" }: Props) {
  return (
    <div
      className={`sys-rule sys-rule-soft flex w-full items-center justify-between gap-3 overflow-hidden border-b border-t px-1 py-1.5 text-[10px] uppercase tracking-[0.28em] ${className}`}
      style={{ color: "var(--sys-text-muted)" }}
      aria-hidden
    >
      <ul className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        {items.map((item, i) => (
          <li key={i} className="inline-flex items-center gap-3">
            {i > 0 ? <span className="opacity-60">·</span> : null}
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <span className="hidden shrink-0 sm:inline-flex items-center gap-1">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--sys-accent)" }} />
        READY
      </span>
    </div>
  );
}
