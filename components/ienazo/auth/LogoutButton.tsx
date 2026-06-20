"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/ienazo/supabase/client";
import { supabaseReady } from "@/lib/ienazo/config";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!supabaseReady) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/ienazo");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="text-xs font-bold tracking-wide text-ienazo-ink-soft underline-offset-4 hover:text-ienazo-red hover:underline disabled:opacity-60"
    >
      {loading ? "ログアウト中…" : "ログアウト"}
    </button>
  );
}
