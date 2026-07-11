// プレイエンジンから呼ばれる：90秒チケット(JWT)を検証し、長命プレイセッションを返す。
// 秘密鍵はサーバーのみが持つ＝エンジン(ブラウザ)では検証できないため、ここで担う。
// 契約：ienazo/docs/IENAZO_PLAY_GATE_CONTRACT.md §2-1
import { NextResponse } from "next/server";
import { verifyTicket, issueSession, ticketReady } from "@/lib/ienazo/ticket";
import { corsHeaders } from "@/lib/ienazo/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: Request) {
  const cors = corsHeaders(req);
  if (!ticketReady()) {
    return NextResponse.json({ valid: false, error: "not_configured" }, { status: 503, headers: cors });
  }

  let ticket: string | undefined;
  try {
    ({ ticket } = await req.json());
  } catch {
    /* noop */
  }
  if (!ticket) {
    return NextResponse.json({ valid: false, error: "invalid" }, { status: 400, headers: cors });
  }

  try {
    const payload = await verifyTicket(ticket);
    const sub = payload.sub;
    const slug = payload.slug;
    if (!sub || !slug) {
      return NextResponse.json({ valid: false, error: "invalid" }, { status: 200, headers: cors });
    }
    const session = await issueSession(sub, slug);
    return NextResponse.json({ valid: true, slug, sub, session }, { status: 200, headers: cors });
  } catch {
    // 期限切れ・改ざん等はまとめて拒否（詳細は返さない）。
    return NextResponse.json({ valid: false, error: "expired" }, { status: 200, headers: cors });
  }
}
