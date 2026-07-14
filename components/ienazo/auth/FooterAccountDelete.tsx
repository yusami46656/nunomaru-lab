"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

// フッターのSITE列に、ログイン中だけ「アカウント削除」リンクをさりげなく出す。
// クリックで確認ページ（/ienazo/account/delete）へ遷移。未ログイン・未設定時は非表示。
export function FooterAccountDelete() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!supabaseReady) return;
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session?.user));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!authed) return null;

  return (
    <div className="mt-2.5">
      <Link href="/ienazo/account/delete" className="text-sm text-ienazo-ink hover:text-ienazo-red">
        アカウント削除
      </Link>
    </div>
  );
}
