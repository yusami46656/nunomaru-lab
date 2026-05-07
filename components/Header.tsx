"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EXTERNAL_LINKS } from "@/lib/external-links";
import { Gear } from "@/components/decorations/Gear";

const NAV = [
  { href: "/experiments", label: "実験一覧" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-brass-500/30 bg-parchment-50">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5"
          aria-label="ぬのまるの実験工房 トップへ"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center">
            <Gear
              className="absolute inset-0 h-full w-full text-brass-500 group-hover:animate-spin-slow"
              teeth={12}
            />
          </span>
          <span className="font-serif text-base font-bold tracking-wide text-ink-900 sm:text-lg">
            ぬのまるの実験工房
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-parchment-200/70 text-ink-900"
                    : "text-ink-700 hover:bg-parchment-100/80 hover:text-ink-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={EXTERNAL_LINKS.note}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 rounded-full border border-brass-500/50 px-3 py-1.5 text-sm text-ink-800 transition hover:border-brass-600 hover:bg-parchment-100"
          >
            note ↗
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="メニューを開閉する"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brass-500/50 text-ink-800 transition hover:bg-parchment-100 md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-brass-500/30 bg-parchment-50 md:hidden"
        >
          <nav className="mx-auto flex max-w-5xl flex-col px-4 py-2 sm:px-6" aria-label="メインナビゲーション(モバイル)">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-3 text-sm text-ink-800 hover:bg-parchment-100"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={EXTERNAL_LINKS.note}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-2 py-3 text-sm text-ink-800 hover:bg-parchment-100"
            >
              note ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
