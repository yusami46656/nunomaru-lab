import Link from "next/link";
import { EXTERNAL_LINKS } from "@/lib/external-links";

const FOOTER_LINKS = [
  { href: "/contents", label: "Contents" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="sys-shell relative mt-16 sys-rule border-t" style={{ backgroundColor: "rgba(214, 208, 187, 0.55)" }}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-2">
            <p className="sys-eyebrow">NUNOMARU LABO</p>
            <p className="flex items-center gap-2 font-sans text-lg font-bold" style={{ color: "var(--sys-text)" }}>
              <span
                aria-hidden
                className="shrink-0"
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 24,
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
              ぬのまる工房
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--sys-text-muted)" }}>
              ひらめきを、形に。
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="フッターナビゲーション">
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="tracking-wide hover:underline underline-offset-4"
                style={{ color: "var(--sys-text)" }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={EXTERNAL_LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-wide hover:underline underline-offset-4"
              style={{ color: "var(--sys-text)" }}
            >
              X ↗
            </a>
            <a
              href={EXTERNAL_LINKS.note}
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-wide hover:underline underline-offset-4"
              style={{ color: "var(--sys-text)" }}
            >
              note ↗
            </a>
          </nav>
        </div>

        <div
          className="mt-8 sys-rule flex items-center justify-between gap-3 border-t pt-4 text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "var(--sys-text-muted)" }}
        >
          <span>© 2026 NUNOMARU LABO</span>
          <span>SYS // 001</span>
        </div>
      </div>
    </footer>
  );
}
