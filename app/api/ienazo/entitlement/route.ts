// 所有判定（軽量）：ログイン中ユーザーが指定作品を所有しているかを返す。
// 作品詳細ページ（静的）の CTA をクライアントから出し分けるために使う。
// 未ログイン・未設定・エラー時は owned:false に安全側フォールバック。
import { NextResponse } from "next/server";
import { hasEntitlement } from "@/lib/ienazo/entitlements";
import { supabaseReady } from "@/lib/ienazo/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ owned: false }, { status: 400 });
  }
  if (!supabaseReady) {
    return NextResponse.json({ owned: false });
  }
  const owned = await hasEntitlement(slug);
  return NextResponse.json({ owned });
}
