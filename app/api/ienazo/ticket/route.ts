// プレイゲート：所有検証 → 短命チケット（JWT）発行 → エンジン起動URLを返す。
// 無料作品はトークンなしで起動できるため、このAPIは有料作品の所有者専用。
import { NextResponse } from "next/server";
import { createClient } from "@/lib/ienazo/supabase/server";
import { supabaseReady, ENGINE_BASE_URL, SITE_URL } from "@/lib/ienazo/config";
import { issueTicket, ticketReady } from "@/lib/ienazo/ticket";
import { WORKS } from "@/data/ienazo/works";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!supabaseReady) {
    return NextResponse.json({ error: "認証は準備中です（未設定）。" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  let slug: string | undefined;
  try {
    ({ slug } = await req.json());
  } catch {
    /* noop */
  }
  const work = WORKS.find((w) => w.slug === slug);
  if (!work) {
    return NextResponse.json({ error: "作品が見つかりません。" }, { status: 404 });
  }

  // 有料作品は所有検証（自分の行のみ RLS で参照可）。
  if (work.type === "paid") {
    const { data, error } = await supabase
      .from("ienazo_entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("work_slug", work.slug)
      .maybeSingle();
    if (error || !data) {
      return NextResponse.json({ error: "この作品を所有していません。" }, { status: 403 });
    }
  }

  if (!ticketReady()) {
    return NextResponse.json({ error: "チケット署名鍵が未設定です。" }, { status: 503 });
  }

  const ticket = await issueTicket(user.id, work.slug);

  // エンジン未デプロイ（BASE 未設定）のうちは ready:false を返し、UI 側で準備中表示。
  // クリア画面の戻る導線用に、この作品の紹介ページを戻り先として渡す。
  const ret = encodeURIComponent(`${SITE_URL}/ienazo/works/${work.slug}`);
  const url = ENGINE_BASE_URL
    ? `${ENGINE_BASE_URL}/${work.slug}?ticket=${encodeURIComponent(ticket)}&return=${ret}`
    : null;

  return NextResponse.json({ ticket, url, ready: Boolean(url) });
}
