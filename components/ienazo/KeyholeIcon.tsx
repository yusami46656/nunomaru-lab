/**
 * 鍵穴アイコン（ダミー画像と同じ作り：同心リング＋すそ広がりの鍵穴）。
 * currentColor で着色。
 */
export function KeyholeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden role="img">
      {/* 同心リング */}
      <circle cx="50" cy="47.6" r="28" stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="50" cy="47.6" r="35.7" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" />
      {/* 鍵穴（円＋すそ広がり） */}
      <g fill="currentColor">
        <circle cx="50" cy="39.9" r="14" />
        <path d="M43 47.6 L37.1 77 H62.9 L57 47.6 Z" />
      </g>
    </svg>
  );
}
