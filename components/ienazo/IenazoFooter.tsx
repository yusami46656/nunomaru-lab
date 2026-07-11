import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/ienazo/works", label: "作品" },
  { href: "/ienazo/howto", label: "遊び方" },
  { href: "/ienazo/faq", label: "FAQ" },
  { href: "/ienazo/account/login", label: "ログイン" },
];

const LEGAL = [
  { href: "/ienazo/legal/tokushoho", label: "特定商取引法に基づく表記" },
  { href: "/ienazo/legal/terms", label: "利用規約" },
  { href: "/ienazo/legal/privacy", label: "プライバシーポリシー" },
];

export function IenazoFooter() {
  return (
    <footer className="mt-24 border-t border-ienazo-rule">
      <div className="mx-auto w-full max-w-6xl">
        {/* 上段: ブランド / ナビ / 法務 を黒罫で3分割 */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* ブランド */}
          <div className="border-b border-ienazo-line px-6 py-10 md:border-b-0 md:border-r md:border-ienazo-rule">
            <Link href="/ienazo" className="inline-flex items-center" aria-label="家謎 トップへ">
              <Image
                src="/ienazo/logo_lockup.png"
                alt="家謎"
                width={1139}
                height={450}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ienazo-ink-soft">
              おうちで気軽に遊べる、謎解き・脱出ゲーム。{/* 仮コピー */}
            </p>
          </div>

          {/* ナビ */}
          <nav
            className="border-b border-ienazo-line px-6 py-10 md:border-b-0 md:border-r md:border-ienazo-rule"
            aria-label="フッターナビゲーション"
          >
            <p className="mb-4 text-[11px] tracking-[0.3em] text-ienazo-ink-soft">SITE</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ienazo-ink hover:text-ienazo-red">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 法務 */}
          <div className="px-6 py-10">
            <p className="mb-4 text-[11px] tracking-[0.3em] text-ienazo-ink-soft">LEGAL</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ienazo-ink-soft hover:text-ienazo-red">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 下段: ぬのまる工房クレジット（補助・信頼補強） */}
        <div className="flex flex-col gap-2 border-t border-ienazo-rule px-6 py-5 text-xs text-ienazo-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>家謎は、ぬのまる工房がつくっています。</p>
          <p>© {new Date().getFullYear()} ぬのまる工房</p>
        </div>
      </div>
    </footer>
  );
}
