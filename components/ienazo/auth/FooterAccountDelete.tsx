"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";
import { DeleteAccountButton } from "./DeleteAccountButton";

// フッターのSITE列に、ログイン中だけ「アカウントを削除」をさりげなく出す。
// 未ログイン・未設定時は何も表示しない。
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
      <DeleteAccountButton />
    </div>
  );
}
