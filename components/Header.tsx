"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EXTERNAL_LINKS } from "@/lib/external-links";

const NAV = [
  { href: "/#mystery", label: "Mystery" },
  { href: "/#fortune", label: "Fortune" },
  { href: "/tools", label: "Making Note" },
  { href: "/about", label: "About" },
];

const DARK_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(74, 71, 62, 0.95)",
  backdropFilter: "blur(4px)",
  borderColor: "rgba(240, 237, 224, 0.18)",
  "--sys-text": "#f0ede0",
  "--sys-text-muted": "#b8af9c",
  "--sys-line": "rgba(240, 237, 224, 0.18)",
  "--sys-line-soft": "rgba(240, 237, 224, 0.10)",
} as React.CSSProperties;

const LIGHT_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(251, 246, 241, 0.95)",
  backdropFilter: "blur(4px)",
  borderColor: "rgba(0, 0, 0, 0.10)",
  "--sys-text": "#2c2a24",
  "--sys-text-muted": "#6b665c",
  "--sys-line": "rgba(44, 42, 36, 0.22)",
  "--sys-line-soft": "rgba(44, 42, 36, 0.12)",
} as React.CSSProperties;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHtPage = pathname.startsWith("/tools/harassment-type");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="sys-shell sticky top-0 z-30 border-b"
      style={isHtPage ? LIGHT_STYLE : DARK_STYLE}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          aria-label="ぬのまる工房 トップへ"
        >
          <span
            aria-hidden
            className="shrink-0"
            style={{
              display: "inline-block",
              width: 32,
              height: 32,
              backgroundColor: "var(--sys-text)",
              maskImage: "url('/icon.svg')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url('/icon.svg')",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            } as React.CSSProperties}
          />
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
            : NUNOMARU LABO
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          {NAV.map((item) => {
            const active =
              !item.href.startsWith("/#") && pathname === item.href;
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
          style={{ color: "var(--sys-text)", border: `1px solid ${isHtPage ? "rgba(0, 0, 0, 0.18)" : "rgba(240, 237, 224, 0.3)"}` }}
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
          className="border-t md:hidden"
          style={isHtPage
            ? { backgroundColor: "rgba(251, 246, 241, 0.98)", borderColor: "rgba(0, 0, 0, 0.10)" }
            : { backgroundColor: "rgba(74, 71, 62, 0.97)", borderColor: "rgba(240, 237, 224, 0.18)" }}
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
