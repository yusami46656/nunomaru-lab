// メール確認／マジックリンク／ソーシャルログインのリダイレクト先。
// code（PKCE）または token_hash（メール確認）をセッションに交換する。
// ソーシャルログインも PKCE の code で戻ってくるので、同じ経路をそのまま通る。
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/ienazo/supabase/server";
import { supabaseReady } from "@/lib/ienazo/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") || "/ienazo/account/library";
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // ログイン画面へ戻すときの行き先。next を保って、再試行後に元の場所へ進めるようにする。
  const backToLogin = (reason: string) =>
    NextResponse.redirect(
      `${origin}/ienazo/account/login?error=${reason}&next=${encodeURIComponent(next)}`,
    );

  // ソーシャル側で中断・拒否された場合はここにエラーが載って戻ってくる（code は来ない）。
  if (searchParams.get("error")) {
    console.warn("[account/callback] oauth error", {
      error: searchParams.get("error"),
      description: searchParams.get("error_description"),
    });
    return backToLogin("oauth");
  }

  if (supabaseReady) {
    const supabase = await createClient();
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return backToLogin("auth");
}
