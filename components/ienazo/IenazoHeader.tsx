"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";
import { AccountMenu } from "@/components/ienazo/auth/AccountMenu";
import { LogoutButton } from "@/components/ienazo/auth/LogoutButton";

const NAV = [
  { href: "/ienazo/works", label: "作品" },
  { href: "/ienazo/howto", label: "遊び方" },
  { href: "/ienazo/faq", label: "FAQ" },
];

// 認証状態でアカウント導線を出し分ける（未ログイン＝会員登録＋ログイン / ログイン中＝マイページ）。
const ACCOUNT_REGISTER = { href: "/ienazo/account/register", label: "会員登録" };
const ACCOUNT_LOGGED_OUT = { href: "/ienazo/account/login", label: "ログイン" };
// ログイン中に出す行き先。PC はアカウントメニューの中、スマホはハンバーガーの中。
const ACCOUNT_MENU = [
  { href: "/ienazo/account/library", label: "あなたのライブラリ" },
  { href: "/ienazo/account/settings", label: "アカウント設定" },
];

// 無料体験の入口（まず作品ページへ。そこから PLAY で起動）。
const FREE_TRIAL_HREF = "/ienazo/works/broken-android";

export function IenazoHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // null＝まだ分からない。false 始まりにすると、ログイン中の人にも初回描画で
  // 「会員登録／ログイン」が出てから「マイページ」に入れ替わる（実機で確認済み）。
  // 分からないあいだは場所だけ確保して、何も見せない。
  const [authed, setAuthed] = useState<boolean | null>(supabaseReady ? null : false);
  // ヘッダーのアカウントメニューに出す。取れないこともある（メールを返さないプロバイダ）。
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 認証状態を購読（初回セッションと以降の変化を反映）。
  // onAuthStateChange の初回発火を待たず、getSession() で自分から取りにいく。
  useEffect(() => {
    if (!supabaseReady) return;
    const supabase = createClient();
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setAuthed(Boolean(data.session?.user));
      setEmail(data.session?.user?.email ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session?.user));
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // 認証状態が確定したか。未確定のうちはアカウント導線を隠す。
  const resolved = authed !== null;

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
          {/* 未確定のあいだは幅だけ確保して中身を見せない（誤ったラベルを一瞬でも出さない）。
              未確定時は widest な未ログイン版を敷いておくので、確定しても横位置が動かない。 */}
          <span
            className={`inline-flex items-center gap-1 ${resolved ? "" : "invisible"}`}
            aria-hidden={!resolved}
          >
            {authed ? (
              <AccountMenu email={email} transparent={transparent} />
            ) : (
              <>
                <Link
                  href={ACCOUNT_REGISTER.href}
                  tabIndex={resolved ? undefined : -1}
                  className={`ienazo-navlink px-4 py-2 text-sm font-medium tracking-wide transition-colors ${navColor}`}
                >
                  {ACCOUNT_REGISTER.label}
                </Link>
                <Link
                  href={ACCOUNT_LOGGED_OUT.href}
                  tabIndex={resolved ? undefined : -1}
                  className={`ienazo-navlink px-4 py-2 text-sm font-medium tracking-wide transition-colors ${navColor}`}
                >
                  {ACCOUNT_LOGGED_OUT.label}
                </Link>
              </>
            )}
          </span>
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
            {/* 未確定なら出さない。メニューは押して開くものなので、その時点では確定している。
                スマホはドロップダウンを重ねず、ここに同じ項目を平らに並べる。 */}
            {[
              ...NAV,
              ...(!resolved ? [] : authed ? ACCOUNT_MENU : [ACCOUNT_REGISTER, ACCOUNT_LOGGED_OUT]),
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-ienazo-line px-5 py-3.5 text-sm font-medium tracking-wide text-ienazo-ink"
              >
                {item.label}
              </Link>
            ))}
            {resolved && authed && (
              <div className="border-b border-ienazo-line px-5 py-3.5">
                <LogoutButton variant="nav" />
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
