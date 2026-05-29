/**
 * 診断ページ用のテーマ切替。
 * 子に `.ht-area` をつけることで body:has(.ht-area) で全体テーマを上書きする。
 * Server Component なので初期描画時から正しい背景になり、フラッシュしない。
 */
export default function HarassmentTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="ht-area">{children}</div>;
}
