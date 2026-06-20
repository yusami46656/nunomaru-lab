// セッション Cookie を更新する middleware ヘルパー（@supabase/ssr 規約）。
// /ienazo 配下のリクエストごとにトークンをリフレッシュする。
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseReady } from "@/lib/ienazo/config";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 未設定（プレースホルダー）のうちは認証を素通りさせる。
  if (!supabaseReady) return supabaseResponse;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() を呼ぶことでトークンのリフレッシュ＆Cookie反映が走る。
  await supabase.auth.getUser();

  return supabaseResponse;
}
