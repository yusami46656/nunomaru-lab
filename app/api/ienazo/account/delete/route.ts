// アカウント削除（本人のみ）。ログイン中ユーザーが「自分自身」を削除する。
// セッションから user を特定し、その user の関連データ（購入・進捗）と認証ユーザー本体を
// service role で削除する。他人を消せない設計（対象は常にセッションの user.id）。
import { NextResponse } from "next/server";
import { createClient } from "@/lib/ienazo/supabase/server";
import { createAdminClient } from "@/lib/ienazo/supabase/admin";
import { supabaseReady } from "@/lib/ienazo/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!supabaseReady) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // 同一オリジンのみ許可（CSRF緩和。SupabaseのCookieは SameSite=Lax だが多層防御）。
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(req.url).host) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }

  // ログイン中ユーザー本人のみ。
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // 関連データを先に削除（購入・進捗）。どちらか失敗したら中断（ユーザー本体は残す＝再試行可能）。
  const delEnt = await admin.from("ienazo_entitlements").delete().eq("user_id", user.id);
  if (delEnt.error) {
    return NextResponse.json({ error: "cleanup_failed" }, { status: 500 });
  }
  const delProg = await admin.from("ienazo_progress").delete().eq("user_id", user.id);
  if (delProg.error) {
    return NextResponse.json({ error: "cleanup_failed" }, { status: 500 });
  }

  // 認証ユーザー本体を削除。
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
