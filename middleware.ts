import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/ienazo/supabase/middleware";

// 家謎の認証セッションを維持する。matcher を /ienazo 配下に限定し、
// サイト全体（診断など）には一切影響させない。
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/ienazo/:path*", "/api/ienazo/:path*"],
};
