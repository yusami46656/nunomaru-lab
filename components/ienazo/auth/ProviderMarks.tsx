// 各社のブランドマーク。色・形は公式規定で固定されているので、勝手に色を変えないこと。
// 家謎のトーン（角丸なし）に寄せてよいのは外側のボタンの角丸だけで、マーク自体は触らない。

/** Google の 4色 G。Google のブランドガイドラインの公式パス。 */
export function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden focusable="false">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/**
 * LINE の吹き出しマーク（白抜き）。
 * ＊暫定：LINE Developers が配布している公式ボタンアセットに差し替える前提の簡易版。
 */
export function LineMark({ size = 24, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden focusable="false">
      <path
        fill={color}
        d="M12 4.6c-4.09 0-7.42 2.7-7.42 6.02 0 2.97 2.64 5.46 6.2 5.93.24.05.57.16.65.37.08.19.05.48.03.67l-.1.62c-.04.19-.15.73.64.4.79-.34 4.23-2.49 5.77-4.26 1.06-1.16 1.57-2.34 1.57-3.73C19.34 7.3 16.09 4.6 12 4.6z"
      />
    </svg>
  );
}

/** 一覧用の LINE マーク（緑の角丸square に白抜き）。ボタン本体では使わない。 */
export function LineBadge({ size = 20 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded"
      style={{ width: size, height: size, background: "#06c755" }}
    >
      <LineMark size={Math.round(size * 0.9)} />
    </span>
  );
}

/** X のロゴ。 */
export function XMark({ size = 18, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden focusable="false">
      <path
        fill={color}
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z"
      />
    </svg>
  );
}

/** メールログイン行用のアイコン（家謎の線画トーン）。 */
export function MailMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      <rect x="2.5" y="5" width="19" height="14" />
      <path d="m3 6 9 6.5L21 6" />
    </svg>
  );
}
