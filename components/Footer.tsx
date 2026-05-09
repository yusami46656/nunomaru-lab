import Link from "next/link";
import { EXTERNAL_LINKS } from "@/lib/external-links";
import { Gear } from "@/components/decorations/Gear";

const FOOTER_LINKS = [
  { href: "/experiments", label: "実験ノート" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-brass-500/30 bg-parchment-100/60">
      <div className="pointer-events-none absolute -top-10 right-6 hidden md:block" aria-hidden>
        <Gear className="h-20 w-20 text-brass-500/40 animate-spin-slower" teeth={14} />
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-serif text-lg font-bold text-ink-900">ぬのまるの実験工房</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              AIで作った小さな企画を公開する実験工房です。
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="フッターナビゲーション">
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ink-800 hover:text-brass-700 hover:underline underline-offset-4"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={EXTERNAL_LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-800 hover:text-brass-700 hover:underline underline-offset-4"
            >
              X ↗
            </a>
            <a
              href={EXTERNAL_LINKS.note}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-800 hover:text-brass-700 hover:underline underline-offset-4"
            >
              note ↗
            </a>
          </nav>
        </div>

        <div className="mt-8 flex items-center gap-3 border-t border-brass-500/20 pt-4 text-xs text-ink-700">
          <span className="inline-flex h-5 w-5 items-center justify-center text-brass-500/70">
            <Gear className="h-full w-full" teeth={10} />
          </span>
          <span>© 2026 ぬのまるの実験工房</span>
        </div>
      </div>
    </footer>
  );
}
