import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// 丸ゴシック (Zen Maru Gothic) をサイト全体で使う。
// 旧 --font-noto-sans-jp / --font-noto-serif-jp という CSS 変数名を残しているのは
// 既存のコンポーネントが font-sans / font-serif 経由で参照しているため、変更を最小化するため。
// preload: false — Vercel ビルド環境での fonts.gstatic.com 接続失敗を回避するため
// ビルド時のプリロードをスキップし、フォントはランタイムで読み込む
const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-zen-maru",
  display: "swap",
  preload: false,
});

const SITE_URL = "https://nunomaru-lab.com";
const SITE_NAME = "ぬのまるの実験工房";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ぬのまるの実験工房 | AIで作った小さな企画を公開する場所",
    template: "%s | ぬのまるの実験工房",
  },
  description:
    "ぬのまるの実験工房は、AIを活用して制作した診断・ミニコンテンツ・Web実験を公開していくサイトです。",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "ぬのまるの実験工房 | AIで作った小さな企画を公開する場所",
    description:
      "ぬのまるの実験工房は、AIを活用して制作した診断・ミニコンテンツ・Web実験を公開していくサイトです。",
    images: [
      {
        url: "/ogp-default.png",
        width: 1200,
        height: 630,
        alt: "ぬのまるの実験工房",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ぬのまるの実験工房 | AIで作った小さな企画を公開する場所",
    description:
      "ぬのまるの実験工房は、AIを活用して制作した診断・ミニコンテンツ・Web実験を公開していくサイトです。",
    images: ["/ogp-default.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={zenMaru.variable}>
      {/* suppressHydrationWarning: 一部ブラウザ拡張(ColorZilla 等)が body に属性を後付けするため、その差分のみ抑制する。 */}
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:border focus:border-brass-500 focus:bg-parchment-50 focus:px-3 focus:py-1.5 focus:text-ink-900"
        >
          本文へスキップ
        </a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
