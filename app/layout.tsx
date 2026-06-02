import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { NunomaruSystemLayout } from "@/components/system/NunomaruSystemLayout";
import { NunomaruStatusBar } from "@/components/system/NunomaruStatusBar";
import Script from "next/script";

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
const SITE_NAME = "ぬのまる工房";
const ADSENSE_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "ca-pub-9671599687662194";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ぬのまる工房｜AIとつくる、おもちゃ箱",
    template: "%s | ぬのまる工房",
  },
  description:
    "ぬのまる工房は、AIを使って謎解きや占い・診断など、遊べるWebコンテンツを作る個人制作サイトです。",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "ぬのまる工房",
    description: "AIとつくる、おもちゃ箱。",
    images: [
      {
        url: "/ogp-default.png",
        width: 1200,
        height: 630,
        alt: "ぬのまる工房",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ぬのまる工房",
    description: "AIとつくる、おもちゃ箱。",
    images: ["/ogp-default.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: { url: "/icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
  other: {
    "google-adsense-account": "ca-pub-9671599687662194",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={zenMaru.variable}>
      <GoogleAnalytics />
      {process.env.NODE_ENV === "production" && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      )}
      {/* suppressHydrationWarning: 一部ブラウザ拡張(ColorZilla 等)が body に属性を後付けするため、その差分のみ抑制する。 */}
      <body className="sys-mode min-h-screen font-sans" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:border focus:border-brass-500 focus:bg-parchment-50 focus:px-3 focus:py-1.5 focus:text-ink-900"
        >
          本文へスキップ
        </a>
        <NunomaruSystemLayout>
          <Header />
          <div className="sys-shell-only mx-auto w-full max-w-5xl px-4 pt-3 sm:px-6">
            <NunomaruStatusBar />
          </div>
          <main id="main" className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
            {children}
          </main>
          <Footer />
        </NunomaruSystemLayout>
      </body>
    </html>
  );
}
