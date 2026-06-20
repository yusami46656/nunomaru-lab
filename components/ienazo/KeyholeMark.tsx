/**
 * 家謎のロゴマーク（プレースホルダ）。
 * 家のシルエット＋鍵穴の丸み太線・モノトーン。currentColor で着色する。
 * 本ロゴ（家謎ロゴ）ができたら public/ienazo/logo.svg に差し替える想定。
 */
export function KeyholeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      aria-hidden
      role="img"
    >
      {/* 家のシルエット（丸み太線） */}
      <path
        d="M7 22 L24 7 L41 22 V39 a3 3 0 0 1-3 3 H10 a3 3 0 0 1-3-3 Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* 鍵穴（丸＋すそ広がり） */}
      <circle cx="24" cy="26" r="3.4" fill="currentColor" />
      <path d="M24 28.6 L21.4 37.5 H26.6 Z" fill="currentColor" />
    </svg>
  );
}
