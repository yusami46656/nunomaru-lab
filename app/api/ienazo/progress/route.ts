// プレイエンジンから呼ばれる：進捗のロード／セーブ。
// 認可は Authorization: Bearer <session>（verify-ticket が発行した長命トークン）。
// service role で RLS を迂回し、トークンの sub/slug に厳密に紐づく行だけを読み書きする。
// 契約：ienazo/docs/IENAZO_PLAY_GATE_CONTRACT.md §2-2 / §3
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/ienazo/ticket";
import { createAdminClient } from "@/lib/ienazo/supabase/admin";
import { supabaseReady } from "@/lib/ienazo/config";
import { corsHeaders } from "@/lib/ienazo/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: Request) {
  const cors = corsHeaders(req);
  if (!supabaseReady) {
    return NextResponse.json({ error: "not_configured" }, { status: 503, headers: cors });
  }

  // セッショントークンの検証（sub=userId / slug=作品）。
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: cors });
  }
  let userId: string;
  let slug: string;
  try {
    const payload = await verifySession(token);
    if (!payload.sub || !payload.slug) throw new Error("missing claims");
    userId = payload.sub;
    slug = payload.slug as string;
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: cors });
  }

  let body: { action?: string; data?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* noop */
  }

  const admin = createAdminClient();

  if (body.action === "load") {
    const { data, error } = await admin
      .from("ienazo_progress")
      .select("data")
      .eq("user_id", userId)
      .eq("work_slug", slug)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: "load_failed" }, { status: 500, headers: cors });
    }
    return NextResponse.json({ data: data?.data ?? null }, { status: 200, headers: cors });
  }

  if (body.action === "save") {
    if (typeof body.data !== "object" || body.data === null) {
      return NextResponse.json({ error: "bad_data" }, { status: 400, headers: cors });
    }
    const { error } = await admin
      .from("ienazo_progress")
      .upsert(
        { user_id: userId, work_slug: slug, data: body.data, updated_at: new Date().toISOString() },
        { onConflict: "user_id,work_slug" },
      );
    if (error) {
      return NextResponse.json({ error: "save_failed" }, { status: 500, headers: cors });
    }
    return NextResponse.json({ ok: true }, { status: 200, headers: cors });
  }

  return NextResponse.json({ error: "bad_action" }, { status: 400, headers: cors });
}
