"use client";

// フッターSITE列のアカウント行。
//
// これがある理由：フッターはサーバー側で「ログイン」を固定表示していたので、
// ログイン中でもヘッダーは「マイページ」・フッターは「ログイン」という食い違いが起きていた。
// 同じ画面の上下で状態表示が割れないよう、ここで出し分ける。
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";
import { LogoutButton } from "@/components/ienazo/auth/LogoutButton";

export function FooterAccount() {
  // null＝未確定。確定するまで出さない（誤ったラベルを一瞬でも見せない）。
  const [authed, setAuthed] = useState<boolean | null>(supabaseReady ? null : false);

  useEffect(() => {
    if (!supabaseReady) return;
    const supabase = createClient();
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (alive) setAuthed(Boolean(data.session?.user));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session?.user));
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (authed === null) return null;

  if (!authed) {
    return (
      <li>
        <Link href="/ienazo/account/login" className="text-ienazo-ink hover:text-ienazo-red">
          ログイン
        </Link>
      </li>
    );
  }

  return (
    <>
      <li>
        <Link
          href="/ienazo/account/library"
          className="text-ienazo-ink hover:text-ienazo-red"
        >
          マイページ
        </Link>
      </li>
      <li>
        <LogoutButton variant="nav" />
      </li>
    </>
  );
}
