import type { Metadata } from "next";
import { IenazoHeader } from "@/components/ienazo/IenazoHeader";
import { IenazoFooter } from "@/components/ienazo/IenazoFooter";
// 見出しはロゴと同じ丸ゴシック(Zen Maru Gothic, 親レイアウトの font-sans)を
// 最太(font-black=900)で使う。専用ディスプレイフォントは調和を欠くため不採用。

export const metadata: Metadata = {
  title: {
    default: "家謎｜おうちで遊ぶ、謎解き・脱出ゲーム",
    template: "%s | 家謎",
  },
  description:
    "家謎は、おうちで気軽に遊べる謎解き・脱出ゲーム。ブラウザだけで物語の世界に入り込みながら謎を解きます。まずは無料体験から。",
  // 家謎セクションのファビコン（SPマーク由来）。/ienazo 配下で親のfaviconを上書き。
  icons: {
    icon: [{ url: "/ienazo/favicon.png", type: "image/png" }],
  },
};

/**
 * 家謎 特設サイトのレイアウト殻。
 * .ienazo-area を付けることで body:has(.ienazo-area)（globals.css）が
 * 親サイト（ぬのまる工房）の NieR システムUI を上書きし、家謎テーマに切り替える。
 * 親レイアウトが既に <main> を持つため、ここでは <main> を重ねない。
 */
export default function IenazoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ienazo-area min-h-screen bg-ienazo-paper font-sans text-ienazo-ink">
      <IenazoHeader />
      {children}
      <IenazoFooter />
    </div>
  );
}
