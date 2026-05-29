"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EXTERNAL_LINKS } from "@/lib/external-links";

const NAV = [
  { href: "/#learn", label: "Learn" },
  { href: "/#play", label: "Play" },
  { href: "/tools", label: "Making Note" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-30 sys-rule border-b"
      style={{ backgroundColor: "rgba(230, 224, 204, 0.92)", backdropFilter: "blur(4px)" }}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-baseline gap-3"
          aria-label="ぬのまる工房 トップへ"
        >
          <span
            className="font-sans text-base font-bold tracking-[0.06em] sm:text-lg"
            style={{ color: "var(--sys-text)" }}
          >
            ぬのまる工房
          </span>
          <span
            className="hidden sm:inline text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--sys-text-muted)" }}
          >
            : NUNOMARU KOBO
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          {NAV.map((item) => {
            const active =
              !item.href.startsWith("/#") &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "sys-btn-primary" : "sys-btn-ghost"}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={EXTERNAL_LINKS.note}
            target="_blank"
            rel="noopener noreferrer"
            className="sys-btn-ghost"
          >
            note ↗
          </a>
          <a
            href={EXTERNAL_LINKS.x}
            target="_blank"
            rel="noopener noreferrer"
            className="sys-btn-ghost"
          >
            X ↗
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="メニューを開閉する"
          className="inline-flex h-10 w-10 items-center justify-center md:hidden"
          style={{ color: "var(--sys-text)", border: "1px solid var(--sys-line)" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
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
          className="sys-rule border-t md:hidden"
          style={{ backgroundColor: "rgba(230, 224, 204, 0.97)" }}
        >
          <nav className="mx-auto flex max-w-5xl flex-col px-4 py-2 sm:px-6" aria-label="メインナビゲーション(モバイル)">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2 py-3 text-sm tracking-wide"
                style={{ color: "var(--sys-text)" }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={EXTERNAL_LINKS.note}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-3 text-sm tracking-wide"
              style={{ color: "var(--sys-text)" }}
            >
              note ↗
            </a>
            <a
              href={EXTERNAL_LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-3 text-sm tracking-wide"
              style={{ color: "var(--sys-text)" }}
            >
              X ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
