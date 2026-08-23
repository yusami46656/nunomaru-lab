"use client";

// ヘッダー右上のアカウントメニュー（PC用）。
//
// これがある理由：アカウントの入口がライブラリの中にしか無いと、作品ページや
// 遊び方ページからはログアウトも設定もできない。一度ライブラリまで戻る必要があった。
// 入口はサイト全体のものなので、ヘッダーに置く。
//
// スマホはハンバーガーの中に同じ項目を並べる（IenazoHeader 側）。
// 画面が狭いところにドロップダウンを重ねると、閉じ方が分かりにくくなるため。
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

const ITEMS = [
  { href: "/ienazo/account/library", label: "あなたのライブラリ" },
  { href: "/ienazo/account/settings", label: "アカウント設定" },
];

export function AccountMenu({ email, transparent }: { email: string | null; transparent: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // ページを移ったら閉じる。
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 外側クリックと Escape で閉じる。Escape のあとはボタンへ戻す。
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function onLogout() {
    if (!supabaseReady) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/ienazo");
    router.refresh();
  }

  // ボタンには @ より前だけ出す。ヘッダーは横幅が限られるため。
  const shortName = email ? email.split("@")[0] : "アカウント";

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex max-w-[13rem] items-center gap-2 border px-3 py-2 text-sm font-medium tracking-wide transition-colors ${
          transparent
            ? "border-white/40 text-white/90 hover:text-white"
            : "border-ienazo-rule text-ienazo-ink hover:border-ienazo-ink"
        }`}
      >
        <span className="truncate">{shortName}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9.5l6 5 6-5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="アカウント"
          className="absolute right-0 top-full z-50 mt-2 w-64 border border-ienazo-rule bg-ienazo-paper-soft shadow-ienazo-card"
        >
          <p className="break-all border-b border-ienazo-rule px-4 py-3 text-xs text-ienazo-ink-soft">
            {email ?? "メール未登録"}
          </p>

          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block border-b border-ienazo-line px-4 py-3 text-sm font-medium tracking-wide text-ienazo-ink transition-colors hover:bg-ienazo-paper-deep"
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            disabled={loading}
            className="block w-full px-4 py-3 text-left text-sm font-medium tracking-wide text-ienazo-ink-soft transition-colors hover:bg-ienazo-paper-deep hover:text-ienazo-red disabled:opacity-60"
          >
            {loading ? "ログアウト中…" : "ログアウト"}
          </button>
        </div>
      )}
    </div>
  );
}
