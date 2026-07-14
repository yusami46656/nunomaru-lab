"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

const NAV = [
  { href: "/ienazo/works", label: "作品" },
  { href: "/ienazo/howto", label: "遊び方" },
  { href: "/ienazo/faq", label: "FAQ" },
];

// 認証状態でアカウント導線を出し分ける（未ログイン＝ログイン / ログイン中＝マイページ）。
const ACCOUNT_LOGGED_OUT = { href: "/ienazo/account/login", label: "ログイン" };
const ACCOUNT_LOGGED_IN = { href: "/ienazo/account/library", label: "マイページ" };

// 無料体験の入口（まず作品ページへ。そこから PLAY で起動）。
const FREE_TRIAL_HREF = "/ienazo/works/broken-android";

export function IenazoHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 認証状態を購読（初回セッションと以降の変化を反映）。
  // 未設定・未ログイン時は「ログイン」表示のまま（安全側）。
  useEffect(() => {
    if (!supabaseReady) return;
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session?.user));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const account = authed ? ACCOUNT_LOGGED_IN : ACCOUNT_LOGGED_OUT;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // トップページの最上部のみ透明（黒いヒーローと同化・ロゴなし）。
  const isTop = pathname === "/ienazo";
  const transparent = isTop && !scrolled && !open;

  const navColor = transparent
    ? "text-white/90 hover:text-white"
    : "text-ienazo-ink hover:text-ienazo-red";

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-ienazo-rule bg-ienazo-paper/95 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* ロゴ（透明時は非表示＝黒背景と同化） */}
        <Link
          href="/ienazo"
          aria-label="家謎 トップへ"
          className={`inline-flex items-center transition-opacity ${
            transparent ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/ienazo/logo_lockup.png"
            alt="家謎"
            width={1139}
            height={450}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </Link>

        {/* PC ナビ */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ienazo-navlink px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                  active ? (transparent ? "text-white" : "text-ienazo-red") : navColor
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={account.href}
            className={`ienazo-navlink px-4 py-2 text-sm font-medium tracking-wide transition-colors ${navColor}`}
          >
            {account.label}
          </Link>
          <Link
            href={FREE_TRIAL_HREF}
            className="ml-2 inline-flex items-center bg-ienazo-red px-5 py-2.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-ienazo-red-deep"
          >
            無料で体験する
          </Link>
        </nav>

        {/* モバイル: 体験CTAは畳まず常設＋ハンバーガー */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={FREE_TRIAL_HREF}
            className="bg-ienazo-red px-3.5 py-2 text-xs font-bold tracking-wide text-white"
          >
            無料で体験
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="ienazo-mobile-nav"
            aria-label="メニューを開閉する"
            className={`inline-flex h-10 w-10 items-center justify-center border transition-colors ${
              transparent ? "border-white/40 text-white" : "border-ienazo-rule text-ienazo-ink"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
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
      </div>

      {/* モバイルメニュー（開いた時は常に明色パネルで可読に） */}
      {open && (
        <div
          id="ienazo-mobile-nav"
          className="border-t border-ienazo-rule bg-ienazo-paper-soft md:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col" aria-label="メインナビゲーション(モバイル)">
            {[...NAV, account].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-ienazo-line px-5 py-3.5 text-sm font-medium tracking-wide text-ienazo-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
