/**
 * 「遊ぶのに必要なもの」用のフラット・ラインアイコン群。
 * 絵文字（🖥 🌐 ✏）の代替。currentColor で着色し、stroke ベースで線の太さを統一。
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  role: "img" as const,
};

/** モニター（PC・タブレット） */
export function MonitorIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="4" width="19" height="12.5" rx="1.5" />
      <path d="M9 20.5h6M12 16.5v4" />
    </svg>
  );
}

/** ブラウザ（地球儀） */
export function BrowserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
    </svg>
  );
}

/** 紙とペン（鉛筆） */
export function PencilIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20l1.2-4.2L16 5a1.8 1.8 0 0 1 2.5 0l.5.5a1.8 1.8 0 0 1 0 2.5L8.2 18.8 4 20z" />
      <path d="M14.5 6.5l3 3" />
    </svg>
  );
}
